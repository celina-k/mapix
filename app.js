// ============================================================
// State
// ============================================================

const State = {
  mode: "revision",
  region: null,
  countries: [],
  index: 0,
  score: 0,
  answered: false,
  total: 0,

  reset(mode, region) {
    this.mode = mode;
    this.region = region;
    this.countries = shuffle(getCountriesByRegion(region));
    this.index = 0;
    this.score = 0;
    this.answered = false;
    this.total = this.countries.length;
  },
  get current() { return this.countries[this.index]; },
  get isLast()  { return this.index >= this.countries.length - 1; },
};

// ============================================================
// Storage
// ============================================================

const Storage = {
  KEY: "capitales_scores",
  load() { try { return JSON.parse(localStorage.getItem(this.KEY)) || {}; } catch { return {}; } },
  save(mode, region, score, total) {
    const data = this.load();
    const key = `${mode}_${region || "all"}`;
    if (!data[key] || score > data[key].best)
      data[key] = { best: score, total, date: new Date().toLocaleDateString("fr-FR") };
    localStorage.setItem(this.KEY, JSON.stringify(data));
  },
};

// ============================================================
// UI
// ============================================================

const UI = {
  updateScore() {
    const pct = State.total ? (State.index / State.total) * 100 : 0;
    document.getElementById("progress-fill").style.width = `${pct}%`;
    document.getElementById("score-correct").textContent = State.score;
    document.getElementById("score-total").textContent = State.total;
    document.getElementById("score-index").textContent = State.total ? `${State.index + 1} / ${State.total}` : "–";
  },

  setActiveMode(mode) {
    document.querySelectorAll(".mode-btn").forEach(b => b.classList.toggle("active", b.dataset.mode === mode));
  },

  setActiveRegion(region) {
    document.querySelectorAll(".region-btn").forEach(b => {
      b.classList.toggle("active", b.dataset.region === (region || ""));
    });
    document.querySelectorAll(".region-parent").forEach(parent => {
      const subList = document.getElementById(`sub-${parent.dataset.region}`);
      if (!subList) return;
      const hasActive = [...subList.querySelectorAll(".region-btn")].some(b => b.dataset.region === (region || ""));
      if (hasActive) { parent.classList.add("open"); subList.classList.add("open"); }
    });
  },

  showResults() {
    const pct = State.total ? Math.round((State.score / State.total) * 100) : 0;
    const emoji = pct >= 80 ? "🎉" : pct >= 50 ? "👍" : "💪";
    const card = document.getElementById("results-card");
    card.querySelector(".big-score").textContent = `${State.score}/${State.total}`;
    card.querySelector(".results-pct").textContent = `${pct}% de bonnes réponses ${emoji}`;
    Storage.save(State.mode, State.region, State.score, State.total);
    document.getElementById("results-screen").classList.remove("hidden");
  },
};

// Retourne la région parente d'une sous-région
function getParentRegion(region) {
  const PARENTS = {
    "Europe de l'Ouest": "Europe", "Europe du Nord": "Europe", "Europe du Sud": "Europe", "Europe de l'Est": "Europe",
    "Asie de l'Est": "Asie", "Asie du Sud-Est": "Asie", "Asie du Sud": "Asie", "Asie Centrale": "Asie", "Moyen-Orient": "Asie",
    "Afrique du Nord": "Afrique", "Afrique de l'Ouest": "Afrique", "Afrique de l'Est": "Afrique", "Afrique Centrale": "Afrique", "Afrique Australe": "Afrique",
    "Amérique du Nord": "Amériques", "Amérique Centrale": "Amériques", "Caraïbes": "Amériques", "Amérique du Sud": "Amériques",
    "Australasie": "Océanie", "Pacifique": "Océanie",
  };
  return PARENTS[region] || region;
}

// ============================================================
// Révision
// ============================================================

const Revision = {
  start() {
    State.reset("revision", State.region);
    MapD3.resetStyles();
    MapD3.disableClick();
    this._removeOverlay();
    this._render();
  },

  _render() {
    UI.updateScore();
    const c = State.current;
    MapD3.resetStyles();
    MapD3.highlightCountry(c.iso, "target");
    MapD3.zoomToCountry(c.iso);

    let overlay = document.getElementById("revision-overlay");
    if (!overlay) {
      overlay = document.createElement("div");
      overlay.id = "revision-overlay";
      overlay.className = "revision-info";
      document.getElementById("panel").appendChild(overlay);
    }

    overlay.innerHTML = `
      <div class="revision-counter">${State.index + 1} / ${State.total}</div>
      <div class="country-name">${c.name}</div>
      <div class="capital-display">Capitale : <span>${c.capital}</span></div>
      <div class="revision-nav">
        <button class="btn btn-secondary" id="rev-prev" ${State.index === 0 ? "disabled" : ""}>‹ Précédent</button>
        <button class="btn btn-primary" id="rev-next">${State.isLast ? "Terminer" : "Suivant ›"}</button>
      </div>`;

    document.getElementById("rev-next").onclick = () => {
      if (State.isLast) { this._removeOverlay(); return; }
      State.index++;
      this._render();
    };
    document.getElementById("rev-prev").onclick = () => {
      if (State.index > 0) { State.index--; this._render(); }
    };
  },

  _removeOverlay() { document.getElementById("revision-overlay")?.remove(); },
};

// ============================================================
// Quiz Capitales
// ============================================================

const QuizCapitals = {
  start() {
    State.reset("capitals", State.region);
    MapD3.resetStyles();
    MapD3.disableClick();
    Revision._removeOverlay();
    document.getElementById("results-screen").classList.add("hidden");
    this._render();
  },

  _render() {
    UI.updateScore();
    const c = State.current;
    MapD3.resetStyles();
    MapD3.highlightCountry(c.iso, "target");
    MapD3.zoomToCountry(c.iso);

    let overlay = document.getElementById("quiz-cap-overlay");
    if (!overlay) {
      overlay = document.createElement("div");
      overlay.id = "quiz-cap-overlay";
      overlay.className = "quiz-overlay";
      document.getElementById("panel").appendChild(overlay);
    }

    overlay.innerHTML = `
      <div class="question-label">Quelle est la capitale de…</div>
      <div class="country-name">${c.name}</div>
      <div class="input-row">
        <input class="capital-input" id="cap-input" type="text" placeholder="Entrez la capitale…" autocomplete="off" spellcheck="false">
        <button class="btn btn-primary" id="cap-submit">Valider</button>
      </div>
      <div class="feedback" id="cap-feedback"></div>
      <div class="quiz-nav">
        <button class="btn btn-secondary hidden" id="cap-next">
          ${State.isLast ? "Voir les résultats" : "Question suivante ›"}
        </button>
      </div>`;

    const input    = document.getElementById("cap-input");
    const feedback = document.getElementById("cap-feedback");
    const submitBtn= document.getElementById("cap-submit");
    const nextBtn  = document.getElementById("cap-next");

    input.focus();

    const submit = () => {
      if (State.answered) return;
      const val = input.value.trim();
      if (!val) return;
      State.answered = true;
      submitBtn.disabled = true;

      if (checkCapitalAnswer(val, c.capital)) {
        State.score++;
        input.classList.add("correct");
        feedback.className = "feedback correct";
        feedback.textContent = "✓ Correct !";
        MapD3.highlightCountry(c.iso, "correct");
      } else {
        input.classList.add("wrong");
        feedback.className = "feedback wrong";
        feedback.textContent = `✗ La bonne réponse était : ${c.capital}`;
        MapD3.highlightCountry(c.iso, "wrong");
      }

      UI.updateScore();
      nextBtn.classList.remove("hidden");
    };

    submitBtn.onclick = submit;
    input.onkeydown = e => { if (e.key === "Enter") { if (State.answered) nextBtn.click(); else submit(); } };

    nextBtn.onclick = () => {
      State.answered = false;
      if (State.isLast) { overlay.remove(); UI.showResults(); }
      else { State.index++; this._render(); }
    };
  },
};

// ============================================================
// Quiz Localisation
// ============================================================

const QuizLocation = {
  _onKey: null,

  _clearKey() {
    if (this._onKey) {
      document.removeEventListener("keydown", this._onKey);
      this._onKey = null;
    }
  },

  start() {
    this._clearKey();
    State.reset("location", State.region);
    MapD3.resetStyles();
    MapD3.disableClick();
    MapD3.disableTooltip();
    Revision._removeOverlay();
    document.getElementById("quiz-cap-overlay")?.remove();
    document.getElementById("results-screen").classList.add("hidden");
    this._render();
  },

  _render() {
    this._clearKey();
    UI.updateScore();
    const c = State.current;
    MapD3.resetStyles();

    // Zoom sur la région sélectionnée à la première question, léger dézoom ensuite
    if (State.index === 0) {
      const parentRegion = State.region ? getParentRegion(State.region) : null;
      if (parentRegion) MapD3.zoomToRegion(parentRegion);
      else MapD3.zoomToWorld();
    } else {
      MapD3.zoomOutSlightly();
    }

    let overlay = document.getElementById("quiz-loc-overlay");
    if (!overlay) {
      overlay = document.createElement("div");
      overlay.id = "quiz-loc-overlay";
      overlay.className = "quiz-overlay";
      document.getElementById("panel").appendChild(overlay);
    }

    overlay.innerHTML = `
      <div class="question-label">Cliquez sur le pays…</div>
      <div class="country-name">${c.name}</div>
      <div class="location-hint">Région : ${c.region}</div>
      <div class="feedback" id="loc-feedback"></div>
      <div class="quiz-nav">
        <button class="btn btn-secondary hidden" id="loc-next">
          ${State.isLast ? "Voir les résultats" : "Question suivante ›"}
        </button>
      </div>`;

    const feedback = document.getElementById("loc-feedback");
    const nextBtn  = document.getElementById("loc-next");

    MapD3.enableClick(clickedIso => {
      if (State.answered) return;
      State.answered = true;

      if (clickedIso === c.iso) {
        State.score++;
        MapD3.highlightCountry(c.iso, "correct");
        feedback.className = "feedback correct";
        feedback.textContent = `✓ Correct ! Capitale : ${c.capital}`;
      } else {
        MapD3.highlightCountry(clickedIso, "wrong");
        MapD3.highlightCountry(c.iso, "correct");
        feedback.className = "feedback wrong";
        const clicked = COUNTRIES.find(x => x.iso === clickedIso);
        const clickedName = clicked ? ` (vous avez cliqué : ${clicked.name})` : "";
        feedback.textContent = `✗ C'était ${c.name}. Capitale : ${c.capital}${clickedName}`;
        MapD3.zoomToCountry(c.iso);
      }

      UI.updateScore();
      nextBtn.classList.remove("hidden");
    });

    const goNext = () => {
      this._clearKey();
      State.answered = false;
      MapD3.disableClick();
      if (State.isLast) { overlay.remove(); UI.showResults(); }
      else { State.index++; this._render(); }
    };

    nextBtn.onclick = goNext;

    this._onKey = e => {
      if (e.key === "Enter" && State.answered) goNext();
    };
    document.addEventListener("keydown", this._onKey);
  },
};

// ============================================================
// Exploration
// ============================================================

const Explore = {
  start() {
    MapD3.resetStyles();
    MapD3.disableClick();
    Revision._removeOverlay();
    document.getElementById("quiz-cap-overlay")?.remove();
    document.getElementById("quiz-loc-overlay")?.remove();
    document.getElementById("results-screen").classList.add("hidden");
    document.getElementById("explore-panel")?.remove();

    MapD3.zoomToWorld();

    const panel = document.createElement("div");
    panel.id = "explore-panel";
    panel.className = "explore-panel";
    panel.innerHTML = `<div class="explore-hint">Cliquez sur un pays pour voir ses informations</div>`;
    document.getElementById("panel").appendChild(panel);

    MapD3.enableClick(iso => {
      const country = COUNTRIES.find(c => c.iso === iso);
      if (!country) return;
      MapD3.resetStyles();
      MapD3.highlightCountry(iso, "explore");

      panel.innerHTML = `
        <div class="explore-country">${country.name}</div>
        <div class="explore-row"><span class="explore-label">Capitale</span><span class="explore-value">${country.capital}</span></div>
        <div class="explore-row"><span class="explore-label">Région</span><span class="explore-value">${country.region}</span></div>
        <div class="explore-row"><span class="explore-label">Sous-région</span><span class="explore-value">${country.subregion}</span></div>`;
    });
  },
};

// ============================================================
// Bootstrap
// ============================================================

function startMode(mode) {
  QuizLocation._clearKey();
  document.getElementById("quiz-cap-overlay")?.remove();
  document.getElementById("quiz-loc-overlay")?.remove();
  document.getElementById("explore-panel")?.remove();
  Revision._removeOverlay();
  MapD3.disableClick();
  if (mode !== "location") MapD3.enableTooltip();

  State.mode = mode;
  if (mode === "revision") Revision.start();
  else if (mode === "capitals") QuizCapitals.start();
  else if (mode === "location") QuizLocation.start();
  else if (mode === "explore") Explore.start();

  MapD3.applyRegionFilter(State.region);
}

async function init() {
  try {
    const topoData = await d3.json("https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json");
    MapD3.init(document.getElementById("world-map"), topoData);
    MapD3.setTooltip(document.getElementById("map-tooltip"));
  } catch (e) {
    console.error("Erreur chargement carte :", e);
  }
  document.getElementById("loading-bar")?.classList.add("done");

  // Boutons de mode
  document.querySelectorAll(".mode-btn").forEach(btn => {
    btn.onclick = () => { UI.setActiveMode(btn.dataset.mode); startMode(btn.dataset.mode); };
  });

  // Boutons de région (accordéon)
  document.querySelectorAll(".region-btn").forEach(btn => {
    btn.onclick = () => {
      if (btn.classList.contains("region-parent")) {
        const subList = document.getElementById(`sub-${btn.dataset.region}`);
        const isOpen = btn.classList.toggle("open");
        if (subList) subList.classList.toggle("open", isOpen);
      }
      State.region = btn.dataset.region || null;
      UI.setActiveRegion(State.region);
      startMode(State.mode);
    };
  });

  document.getElementById("btn-replay").onclick = () => {
    document.getElementById("results-screen").classList.add("hidden");
    startMode(State.mode);
  };
  document.getElementById("btn-change-mode").onclick = () => {
    document.getElementById("results-screen").classList.add("hidden");
  };

  const sidebar  = document.querySelector(".sidebar");
  const backdrop = document.getElementById("sidebar-backdrop");
  const toggleBtn = document.getElementById("sidebar-toggle");

  function isMobile() { return window.innerWidth <= 640; }

  function closeSidebar() {
    if (isMobile()) {
      sidebar.classList.remove("mobile-open");
      backdrop.classList.remove("open");
      toggleBtn.textContent = "☰";
    }
  }

  toggleBtn.onclick = () => {
    if (isMobile()) {
      const open = sidebar.classList.toggle("mobile-open");
      backdrop.classList.toggle("open", open);
      toggleBtn.textContent = open ? "✕" : "☰";
    } else {
      const collapsed = sidebar.classList.toggle("collapsed");
      toggleBtn.textContent = collapsed ? "›" : "‹";
      setTimeout(() => MapD3.resize?.(), 260);
    }
  };

  backdrop.onclick = closeSidebar;

  // Fermer la sidebar sur mobile quand on choisit un mode ou une sous-région (pas les parents accordéon)
  document.querySelectorAll(".mode-btn, .region-btn:not(.region-parent)").forEach(btn => {
    btn.addEventListener("click", () => { if (isMobile()) closeSidebar(); });
  });

  // Initialiser l'icône selon l'écran
  if (isMobile()) toggleBtn.textContent = "☰";

  UI.setActiveMode("revision");
  UI.setActiveRegion(null);
  startMode("revision");
}

document.addEventListener("DOMContentLoaded", init);
