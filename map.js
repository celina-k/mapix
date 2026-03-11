const MapD3 = (() => {
  let svgEl, svg, g, pathGen, projection, zoomBehavior;
  let features = [];
  let isoIndex = {};    // alpha-3 → { el, feature }
  let numToCountry = {}; // String(numId) → country object
  let clickCb = null;
  let currentRegion = null;
  let regionIsoSet = null;

  // Palette éducative 10 pastels — sans bleu (réservé à l'océan)
  const EDU_PALETTE = [
    '#f5d98a',  // jaune blé
    '#f4a89e',  // saumon rosé
    '#8dd4a0',  // vert menthe
    '#f0c280',  // pêche dorée
    '#c4b0e0',  // lavande
    '#7ecfc4',  // turquoise
    '#f9b97a',  // orange doux
    '#b5e0a0',  // vert pomme
    '#f2a0c0',  // rose pâle
    '#d4c48a',  // kaki doré
  ];

  const HIGHLIGHT = {
    target:  '#4F8EF7',
    correct: '#10B981',
    wrong:   '#EF4444',
    explore: '#A855F7',
  };
  const C_DEFAULT = '#d8d0c0';
  const C_OCEAN   = '#4a9fc5';
  const C_BORDER  = '#7a8888';
  const C_HL      = '#1a1a1a';

  // Bounding boxes par continent
  const REGION_BOUNDS = {
    'Europe':    [[-25, 34],  [45, 72]],
    'Asie':      [[25, -10],  [145, 75]],
    'Afrique':   [[-20, -35], [55, 38]],
    'Amériques': [[-170, -60],[-30, 75]],
    'Océanie':   [[100, -50], [180, 20]],
  };

  let colorMap = {};  // String(numId) → index palette

  function nid(id) { return String(+id); }

  function computeColoring(topoData) {
    const neighbors = topojson.neighbors(topoData.objects.countries.geometries);
    colorMap = {};
    features.forEach((f, i) => {
      if (!numToCountry[nid(f.id)]) return;
      const used = new Set(
        neighbors[i].map(j => colorMap[nid(features[j].id)]).filter(c => c !== undefined)
      );
      const start = Math.abs(+f.id * 7 + 13) % EDU_PALETTE.length;
      let idx = start;
      for (let k = 0; k < EDU_PALETTE.length; k++) {
        if (!used.has(idx)) break;
        idx = (idx + 1) % EDU_PALETTE.length;
      }
      colorMap[nid(f.id)] = idx;
    });
  }

  function getCountryFill(numId) {
    if (!numToCountry[nid(numId)]) return C_DEFAULT;
    return EDU_PALETTE[colorMap[nid(numId)] ?? 0];
  }

  function init(el, topoData) {
    svgEl = el;
    const W = el.clientWidth  || window.innerWidth - 240;
    const H = el.clientHeight || window.innerHeight - 52;

    // Construire numToCountry directement depuis COUNTRIES + ISO_LOOKUP
    COUNTRIES.forEach(c => {
      const num = ISO_LOOKUP[c.iso];
      if (num !== undefined) numToCountry[String(num)] = c;
    });

    svg = d3.select(el).attr('width', W).attr('height', H);

    projection = d3.geoNaturalEarth1().scale(W / 5.8).translate([W / 2, H / 2]);
    pathGen = d3.geoPath().projection(projection);

    // Filtre glow
    const defs = svg.append('defs');
    const f = defs.append('filter').attr('id', 'glow')
      .attr('x', '-30%').attr('y', '-30%').attr('width', '160%').attr('height', '160%');
    f.append('feGaussianBlur').attr('stdDeviation', '3').attr('result', 'blur');
    const m = f.append('feMerge');
    m.append('feMergeNode').attr('in', 'blur');
    m.append('feMergeNode').attr('in', 'SourceGraphic');

    // Zoom/pan
    zoomBehavior = d3.zoom().scaleExtent([0.8, 12])
      .on('zoom', e => g.attr('transform', e.transform));
    svg.call(zoomBehavior);

    g = svg.append('g');

    // Fond océan
    g.append('path').datum({ type: 'Sphere' })
      .attr('d', pathGen)
      .attr('fill', C_OCEAN)
      .attr('stroke', '#7ab0c8')
      .attr('stroke-width', 1);

    features = topojson.feature(topoData, topoData.objects.countries).features;

    computeColoring(topoData);

    // Dessin des pays
    g.selectAll('.country')
      .data(features)
      .join('path')
      .attr('class', 'country')
      .attr('d', pathGen)
      .attr('fill', d => getCountryFill(d.id))
      .attr('stroke', C_BORDER)
      .attr('stroke-width', 0.6)
      .style('cursor', d => numToCountry[nid(d.id)] ? 'pointer' : 'default')
      .on('mouseover', (e, d) => {
        const c = numToCountry[nid(d.id)];
        if (!c) return;
        if (!d3.select(e.currentTarget).classed('hl'))
          d3.select(e.currentTarget).attr('stroke', C_HL).attr('stroke-width', 1.8);
        showTip(c.iso, e.pageX, e.pageY);
      })
      .on('mouseout', (e, d) => {
        if (!d3.select(e.currentTarget).classed('hl'))
          d3.select(e.currentTarget).attr('stroke', C_BORDER).attr('stroke-width', 0.6);
        hideTip();
      })
      .on('click', (e, d) => {
        if (!clickCb) return;
        const c = numToCountry[nid(d.id)];
        if (c) clickCb(c.iso);
      });

    // Index alpha-3 → élément SVG + feature
    g.selectAll('.country').each(function(d) {
      const c = numToCountry[nid(d.id)];
      if (c) isoIndex[c.iso] = { el: this, feature: d };
    });

    window.addEventListener('resize', resize);
  }

  function highlightCountry(isoA3, style) {
    const entry = isoIndex[isoA3];
    if (!entry) return;
    d3.select(entry.el).raise()
      .attr('fill', HIGHLIGHT[style] || HIGHLIGHT.target)
      .attr('stroke', C_HL).attr('stroke-width', 1.2)
      .attr('filter', 'url(#glow)').attr('opacity', 1)
      .classed('hl', true);
  }

  function resetStyles() {
    g.selectAll('.country.hl').each(function(d) {
      const c = numToCountry[nid(d.id)];
      const inRegion = !regionIsoSet || (c && regionIsoSet.has(c.iso));
      d3.select(this)
        .attr('fill', getCountryFill(d.id))
        .attr('stroke', C_BORDER).attr('stroke-width', 0.6)
        .attr('filter', null).attr('opacity', inRegion ? 1 : 0.22)
        .classed('hl', false);
    });
  }

  function applyRegionFilter(region) {
    currentRegion = region;
    regionIsoSet = region ? new Set(getCountriesByRegion(region).map(c => c.iso)) : null;
    g.selectAll('.country:not(.hl)').each(function(d) {
      const c = numToCountry[nid(d.id)];
      const inRegion = !regionIsoSet || (c && regionIsoSet.has(c.iso));
      d3.select(this).attr('opacity', inRegion ? 1 : 0.22);
    });
  }

  function zoomToCountry(isoA3, animate = true) {
    const entry = isoIndex[isoA3];
    if (!entry) return;
    const W = svgEl.clientWidth, H = svgEl.clientHeight;
    const [[x0, y0], [x1, y1]] = pathGen.bounds(entry.feature);
    const scale = Math.min(5, 0.35 / Math.max(Math.max(x1 - x0, 1) / W, Math.max(y1 - y0, 1) / H));
    const t = d3.zoomIdentity
      .translate(W / 2 - scale * (x0 + x1) / 2, H / 2 - scale * (y0 + y1) / 2)
      .scale(scale);
    _zoom(t, animate);
  }

  function zoomToRegion(region, animate = true) {
    const b = REGION_BOUNDS[region];
    if (!b) { zoomToWorld(animate); return; }
    const W = svgEl.clientWidth, H = svgEl.clientHeight;
    const [px0, py0] = projection(b[0]);
    const [px1, py1] = projection(b[1]);
    const scale = Math.min(6, 0.8 / Math.max(Math.abs(px1 - px0) / W, Math.abs(py1 - py0) / H));
    const t = d3.zoomIdentity
      .translate(W / 2 - scale * (px0 + px1) / 2, H / 2 - scale * (py0 + py1) / 2)
      .scale(scale);
    _zoom(t, animate);
  }

  function zoomToWorld(animate = true) {
    _zoom(d3.zoomIdentity, animate);
  }

  function zoomOutSlightly(factor = 1.8, animate = true) {
    const t = d3.zoomTransform(svgEl);
    const newScale = Math.max(0.8, t.k / factor);
    const W = svgEl.clientWidth, H = svgEl.clientHeight;
    const cx = W / 2, cy = H / 2;
    // zoom out centré sur le centre de l'écran
    const newX = cx - (cx - t.x) / t.k * newScale;
    const newY = cy - (cy - t.y) / t.k * newScale;
    _zoom(d3.zoomIdentity.translate(newX, newY).scale(newScale), animate);
  }

  function _zoom(t, animate) {
    if (animate)
      svg.transition().duration(600).ease(d3.easeCubicInOut).call(zoomBehavior.transform, t);
    else
      svg.call(zoomBehavior.transform, t);
  }

  // Tooltip
  let tipEl = null;
  let tipEnabled = true;
  function setTooltip(el) { tipEl = el; }
  function enableTooltip()  { tipEnabled = true; }
  function disableTooltip() { tipEnabled = false; hideTip(); }
  function showTip(a3, x, y) {
    if (!tipEl || !tipEnabled) return;
    const c = COUNTRIES.find(c => c.iso === a3);
    if (!c) return;
    tipEl.textContent = c.name;
    Object.assign(tipEl.style, { display: 'block', left: (x + 14) + 'px', top: (y - 8) + 'px' });
  }
  function hideTip() { if (tipEl) tipEl.style.display = 'none'; }

  function enableClick(cb) { clickCb = cb; }
  function disableClick() { clickCb = null; }

  function resize() {
    const W = svgEl.clientWidth, H = svgEl.clientHeight;
    svg.attr('width', W).attr('height', H);
    projection.scale(W / 5.8).translate([W / 2, H / 2]);
    pathGen.projection(projection);
    g.selectAll('path').attr('d', pathGen);
  }

  return { init, highlightCountry, resetStyles, applyRegionFilter, zoomToCountry, zoomToRegion, zoomToWorld, zoomOutSlightly, enableClick, disableClick, setTooltip, enableTooltip, disableTooltip, resize };
})();
