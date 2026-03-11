// Mapping ISO alpha-3 → ID numérique world-atlas (TopoJSON)
const ISO_LOOKUP = {
  AFG:4,   AGO:24,  ALB:8,   ARE:784, ARG:32,  ARM:51,  AUS:36,  AUT:40,
  AZE:31,  BDI:108, BEL:56,  BEN:204, BFA:854, BGD:50,  BGR:100, BHS:44,
  BIH:70,  BLR:112, BLZ:84,  BOL:68,  BRA:76,  BRN:96,  BTN:64,  BWA:72,
  CAF:140, CAN:124, CHE:756, CHL:152, CHN:156, CIV:384, CMR:120, COD:180,
  COG:178, COL:170, CRI:188, CUB:192, CYP:196, CZE:203, DEU:276, DJI:262,
  DNK:208, DOM:214, DZA:12,  ECU:218, EGY:818, ERI:232, ESP:724, EST:233,
  ETH:231, FIN:246, FJI:242, FRA:250, GAB:266, GBR:826, GEO:268, GHA:288,
  GIN:324, GMB:270, GNB:624, GNQ:226, GRC:300, GRD:308, GTM:320, GUY:328,
  HND:340, HRV:191, HTI:332, HUN:348, IDN:360, IND:356, IRL:372, IRN:364,
  IRQ:368, ISL:352, ISR:376, ITA:380, JAM:388, JOR:400, JPN:392, KAZ:398,
  KEN:404, KGZ:417, KHM:116, KOR:410, KWT:414, LAO:418, LBN:422, LBR:430,
  LBY:434, LKA:144, LSO:426,
  LTU:440, LUX:442, LVA:428, MAR:504, MDA:498, MDG:450, MEX:484, MKD:807,
  MLI:466, MLT:470, MMR:104, MNE:499, MNG:496, MOZ:508, MRT:478, MUS:480,
  MWI:454, MYS:458, NAM:516, NER:562, NGA:566, NIC:558, NLD:528, NOR:578,
  NPL:524, NZL:554, OMN:512, PAK:586, PAN:591, PER:604, PHL:608, PNG:598,
  POL:616, PRK:408, PRY:600, PRT:620, QAT:634, ROU:642, RUS:643, RWA:646,
  SAU:682, SDN:729, SEN:686, SLB:90,  SLE:694, SLV:222, SOM:706, SRB:688,
  SSD:728, SUR:740, SVK:703, SVN:705, SWE:752, SWZ:748, SYR:760, TCD:148,
  TGO:768, THA:764, TJK:762, TKM:795, TLS:626, TTO:780, TUN:788, TUR:792,
  TZA:834, UGA:800, UKR:804, URY:858, USA:840, UZB:860, VEN:862, VNM:704,
  VUT:548, WSM:882, YEM:887, ZAF:710, ZMB:894, ZWE:716,
};

const COUNTRIES = [
  // ── Europe de l'Ouest ─────────────────────────────────────
  { name: "Allemagne",       capital: "Berlin",               iso: "DEU", region: "Europe", subregion: "Europe de l'Ouest", lat: 52.52,  lng: 13.40  },
  { name: "Autriche",        capital: "Vienne",               iso: "AUT", region: "Europe", subregion: "Europe de l'Ouest", lat: 48.21,  lng: 16.37  },
  { name: "Belgique",        capital: "Bruxelles",            iso: "BEL", region: "Europe", subregion: "Europe de l'Ouest", lat: 50.85,  lng: 4.35   },
  { name: "France",          capital: "Paris",                iso: "FRA", region: "Europe", subregion: "Europe de l'Ouest", lat: 48.86,  lng: 2.35   },
  { name: "Irlande",         capital: "Dublin",               iso: "IRL", region: "Europe", subregion: "Europe de l'Ouest", lat: 53.33,  lng: -6.25  },
  { name: "Luxembourg",      capital: "Luxembourg",           iso: "LUX", region: "Europe", subregion: "Europe de l'Ouest", lat: 49.61,  lng: 6.13   },
  { name: "Pays-Bas",        capital: "Amsterdam",            iso: "NLD", region: "Europe", subregion: "Europe de l'Ouest", lat: 52.37,  lng: 4.90   },
  { name: "Royaume-Uni",     capital: "Londres",              iso: "GBR", region: "Europe", subregion: "Europe de l'Ouest", lat: 51.51,  lng: -0.13  },
  { name: "Suisse",          capital: "Berne",                iso: "CHE", region: "Europe", subregion: "Europe de l'Ouest", lat: 46.95,  lng: 7.45   },

  // ── Europe du Nord ────────────────────────────────────────
  { name: "Danemark",        capital: "Copenhague",           iso: "DNK", region: "Europe", subregion: "Europe du Nord",    lat: 55.68,  lng: 12.57  },
  { name: "Estonie",         capital: "Tallinn",              iso: "EST", region: "Europe", subregion: "Europe du Nord",    lat: 59.44,  lng: 24.75  },
  { name: "Finlande",        capital: "Helsinki",             iso: "FIN", region: "Europe", subregion: "Europe du Nord",    lat: 60.17,  lng: 24.94  },
  { name: "Islande",         capital: "Reykjavik",            iso: "ISL", region: "Europe", subregion: "Europe du Nord",    lat: 64.14,  lng: -21.90 },
  { name: "Lettonie",        capital: "Riga",                 iso: "LVA", region: "Europe", subregion: "Europe du Nord",    lat: 56.95,  lng: 24.11  },
  { name: "Lituanie",        capital: "Vilnius",              iso: "LTU", region: "Europe", subregion: "Europe du Nord",    lat: 54.69,  lng: 25.28  },
  { name: "Norvège",         capital: "Oslo",                 iso: "NOR", region: "Europe", subregion: "Europe du Nord",    lat: 59.91,  lng: 10.75  },
  { name: "Suède",           capital: "Stockholm",            iso: "SWE", region: "Europe", subregion: "Europe du Nord",    lat: 59.33,  lng: 18.07  },

  // ── Europe du Sud ─────────────────────────────────────────
  { name: "Albanie",         capital: "Tirana",               iso: "ALB", region: "Europe", subregion: "Europe du Sud",     lat: 41.33,  lng: 19.82  },
  { name: "Bosnie-Herzégovine", capital: "Sarajevo",          iso: "BIH", region: "Europe", subregion: "Europe du Sud",     lat: 43.85,  lng: 18.36  },
  { name: "Chypre",          capital: "Nicosie",              iso: "CYP", region: "Europe", subregion: "Europe du Sud",     lat: 35.17,  lng: 33.37  },
  { name: "Croatie",         capital: "Zagreb",               iso: "HRV", region: "Europe", subregion: "Europe du Sud",     lat: 45.81,  lng: 15.98  },
  { name: "Espagne",         capital: "Madrid",               iso: "ESP", region: "Europe", subregion: "Europe du Sud",     lat: 40.42,  lng: -3.70  },
  { name: "Grèce",           capital: "Athènes",              iso: "GRC", region: "Europe", subregion: "Europe du Sud",     lat: 37.98,  lng: 23.73  },
  { name: "Italie",          capital: "Rome",                 iso: "ITA", region: "Europe", subregion: "Europe du Sud",     lat: 41.90,  lng: 12.50  },
  { name: "Macédoine du Nord", capital: "Skopje",             iso: "MKD", region: "Europe", subregion: "Europe du Sud",     lat: 42.00,  lng: 21.43  },
  { name: "Malte",           capital: "La Valette",           iso: "MLT", region: "Europe", subregion: "Europe du Sud",     lat: 35.90,  lng: 14.51  },
  { name: "Monténégro",      capital: "Podgorica",            iso: "MNE", region: "Europe", subregion: "Europe du Sud",     lat: 42.44,  lng: 19.26  },
  { name: "Portugal",        capital: "Lisbonne",             iso: "PRT", region: "Europe", subregion: "Europe du Sud",     lat: 38.72,  lng: -9.14  },
  { name: "Serbie",          capital: "Belgrade",             iso: "SRB", region: "Europe", subregion: "Europe du Sud",     lat: 44.80,  lng: 20.47  },
  { name: "Slovénie",        capital: "Ljubljana",            iso: "SVN", region: "Europe", subregion: "Europe du Sud",     lat: 46.05,  lng: 14.51  },

  // ── Europe de l'Est ───────────────────────────────────────
  { name: "Biélorussie",     capital: "Minsk",                iso: "BLR", region: "Europe", subregion: "Europe de l'Est",   lat: 53.90,  lng: 27.57  },
  { name: "Bulgarie",        capital: "Sofia",                iso: "BGR", region: "Europe", subregion: "Europe de l'Est",   lat: 42.70,  lng: 23.32  },
  { name: "Hongrie",         capital: "Budapest",             iso: "HUN", region: "Europe", subregion: "Europe de l'Est",   lat: 47.50,  lng: 19.04  },
  { name: "Moldavie",        capital: "Chișinău",             iso: "MDA", region: "Europe", subregion: "Europe de l'Est",   lat: 47.01,  lng: 28.86  },
  { name: "Pologne",         capital: "Varsovie",             iso: "POL", region: "Europe", subregion: "Europe de l'Est",   lat: 52.23,  lng: 21.01  },
  { name: "République tchèque", capital: "Prague",            iso: "CZE", region: "Europe", subregion: "Europe de l'Est",   lat: 50.08,  lng: 14.47  },
  { name: "Roumanie",        capital: "Bucarest",             iso: "ROU", region: "Europe", subregion: "Europe de l'Est",   lat: 44.43,  lng: 26.10  },
  { name: "Russie",          capital: "Moscou",               iso: "RUS", region: "Europe", subregion: "Europe de l'Est",   lat: 55.75,  lng: 37.62  },
  { name: "Slovaquie",       capital: "Bratislava",           iso: "SVK", region: "Europe", subregion: "Europe de l'Est",   lat: 48.15,  lng: 17.11  },
  { name: "Ukraine",         capital: "Kiev",                 iso: "UKR", region: "Europe", subregion: "Europe de l'Est",   lat: 50.45,  lng: 30.52  },

  // ── Asie de l'Est ─────────────────────────────────────────
  { name: "Chine",           capital: "Pékin",                iso: "CHN", region: "Asie", subregion: "Asie de l'Est",       lat: 39.91,  lng: 116.39 },
  { name: "Corée du Nord",   capital: "Pyongyang",            iso: "PRK", region: "Asie", subregion: "Asie de l'Est",       lat: 39.02,  lng: 125.75 },
  { name: "Corée du Sud",    capital: "Séoul",                iso: "KOR", region: "Asie", subregion: "Asie de l'Est",       lat: 37.57,  lng: 126.98 },
  { name: "Japon",           capital: "Tokyo",                iso: "JPN", region: "Asie", subregion: "Asie de l'Est",       lat: 35.69,  lng: 139.69 },
  { name: "Mongolie",        capital: "Oulan-Bator",          iso: "MNG", region: "Asie", subregion: "Asie de l'Est",       lat: 47.91,  lng: 106.92 },

  // ── Asie du Sud-Est ───────────────────────────────────────
  { name: "Birmanie",        capital: "Naypyidaw",            iso: "MMR", region: "Asie", subregion: "Asie du Sud-Est",     lat: 19.76,  lng: 96.08  },
  { name: "Brunei",          capital: "Bandar Seri Begawan",  iso: "BRN", region: "Asie", subregion: "Asie du Sud-Est",     lat: 4.94,   lng: 114.95 },
  { name: "Cambodge",        capital: "Phnom Penh",           iso: "KHM", region: "Asie", subregion: "Asie du Sud-Est",     lat: 11.56,  lng: 104.92 },
  { name: "Indonésie",       capital: "Jakarta",              iso: "IDN", region: "Asie", subregion: "Asie du Sud-Est",     lat: -6.21,  lng: 106.85 },
  { name: "Laos",            capital: "Vientiane",            iso: "LAO", region: "Asie", subregion: "Asie du Sud-Est",     lat: 17.97,  lng: 102.60 },
  { name: "Malaisie",        capital: "Kuala Lumpur",         iso: "MYS", region: "Asie", subregion: "Asie du Sud-Est",     lat: 3.15,   lng: 101.69 },
  { name: "Philippines",     capital: "Manille",              iso: "PHL", region: "Asie", subregion: "Asie du Sud-Est",     lat: 14.60,  lng: 120.98 },
  { name: "Thaïlande",       capital: "Bangkok",              iso: "THA", region: "Asie", subregion: "Asie du Sud-Est",     lat: 13.75,  lng: 100.52 },
  { name: "Timor oriental",  capital: "Dili",                 iso: "TLS", region: "Asie", subregion: "Asie du Sud-Est",     lat: -8.56,  lng: 125.58 },
  { name: "Vietnam",         capital: "Hanoï",                iso: "VNM", region: "Asie", subregion: "Asie du Sud-Est",     lat: 21.03,  lng: 105.83 },

  // ── Asie du Sud ───────────────────────────────────────────
  { name: "Afghanistan",     capital: "Kaboul",               iso: "AFG", region: "Asie", subregion: "Asie du Sud",         lat: 34.53,  lng: 69.17  },
  { name: "Bangladesh",      capital: "Dacca",                iso: "BGD", region: "Asie", subregion: "Asie du Sud",         lat: 23.72,  lng: 90.41  },
  { name: "Bhoutan",         capital: "Thimphou",             iso: "BTN", region: "Asie", subregion: "Asie du Sud",         lat: 27.47,  lng: 89.64  },
  { name: "Inde",            capital: "New Delhi",            iso: "IND", region: "Asie", subregion: "Asie du Sud",         lat: 28.63,  lng: 77.22  },
  { name: "Népal",           capital: "Katmandou",            iso: "NPL", region: "Asie", subregion: "Asie du Sud",         lat: 27.71,  lng: 85.31  },
  { name: "Pakistan",        capital: "Islamabad",            iso: "PAK", region: "Asie", subregion: "Asie du Sud",         lat: 33.72,  lng: 73.06  },
  { name: "Sri Lanka",       capital: "Sri Jayawardenepura Kotte", iso: "LKA", region: "Asie", subregion: "Asie du Sud",   lat: 6.89,   lng: 79.90  },

  // ── Asie Centrale ─────────────────────────────────────────
  { name: "Kazakhstan",      capital: "Astana",               iso: "KAZ", region: "Asie", subregion: "Asie Centrale",       lat: 51.18,  lng: 71.45  },
  { name: "Kirghizistan",    capital: "Bichkek",              iso: "KGZ", region: "Asie", subregion: "Asie Centrale",       lat: 42.87,  lng: 74.59  },
  { name: "Ouzbékistan",     capital: "Tachkent",             iso: "UZB", region: "Asie", subregion: "Asie Centrale",       lat: 41.30,  lng: 69.27  },
  { name: "Tadjikistan",     capital: "Douchanbe",            iso: "TJK", region: "Asie", subregion: "Asie Centrale",       lat: 38.56,  lng: 68.77  },
  { name: "Turkménistan",    capital: "Achgabat",             iso: "TKM", region: "Asie", subregion: "Asie Centrale",       lat: 37.95,  lng: 58.39  },

  // ── Moyen-Orient ──────────────────────────────────────────
  { name: "Arabie Saoudite", capital: "Riyad",                iso: "SAU", region: "Asie", subregion: "Moyen-Orient",        lat: 24.69,  lng: 46.72  },
  { name: "Arménie",         capital: "Erevan",               iso: "ARM", region: "Asie", subregion: "Moyen-Orient",        lat: 40.18,  lng: 44.51  },
  { name: "Azerbaïdjan",     capital: "Bakou",                iso: "AZE", region: "Asie", subregion: "Moyen-Orient",        lat: 40.41,  lng: 49.87  },
  { name: "Émirats arabes unis", capital: "Abou Dabi",        iso: "ARE", region: "Asie", subregion: "Moyen-Orient",        lat: 24.47,  lng: 54.37  },
  { name: "Géorgie",         capital: "Tbilissi",             iso: "GEO", region: "Asie", subregion: "Moyen-Orient",        lat: 41.69,  lng: 44.83  },
  { name: "Irak",            capital: "Bagdad",               iso: "IRQ", region: "Asie", subregion: "Moyen-Orient",        lat: 33.34,  lng: 44.40  },
  { name: "Iran",            capital: "Téhéran",              iso: "IRN", region: "Asie", subregion: "Moyen-Orient",        lat: 35.69,  lng: 51.42  },
  { name: "Palestine",       capital: "Jérusalem",            iso: "ISR", region: "Asie", subregion: "Moyen-Orient",        lat: 31.77,  lng: 35.22  },
  { name: "Jordanie",        capital: "Amman",                iso: "JOR", region: "Asie", subregion: "Moyen-Orient",        lat: 31.95,  lng: 35.93  },
  { name: "Koweït",          capital: "Koweït",               iso: "KWT", region: "Asie", subregion: "Moyen-Orient",        lat: 29.37,  lng: 47.98  },
  { name: "Liban",           capital: "Beyrouth",             iso: "LBN", region: "Asie", subregion: "Moyen-Orient",        lat: 33.89,  lng: 35.50  },
  { name: "Oman",            capital: "Mascate",              iso: "OMN", region: "Asie", subregion: "Moyen-Orient",        lat: 23.61,  lng: 58.59  },
  { name: "Qatar",           capital: "Doha",                 iso: "QAT", region: "Asie", subregion: "Moyen-Orient",        lat: 25.29,  lng: 51.53  },
  { name: "Syrie",           capital: "Damas",                iso: "SYR", region: "Asie", subregion: "Moyen-Orient",        lat: 33.51,  lng: 36.29  },
  { name: "Turquie",         capital: "Ankara",               iso: "TUR", region: "Asie", subregion: "Moyen-Orient",        lat: 39.92,  lng: 32.85  },
  { name: "Yémen",           capital: "Sanaa",                iso: "YEM", region: "Asie", subregion: "Moyen-Orient",        lat: 15.35,  lng: 44.21  },

  // ── Afrique du Nord ───────────────────────────────────────
  { name: "Algérie",         capital: "Alger",                iso: "DZA", region: "Afrique", subregion: "Afrique du Nord",  lat: 36.74,  lng: 3.06   },
  { name: "Égypte",          capital: "Le Caire",             iso: "EGY", region: "Afrique", subregion: "Afrique du Nord",  lat: 30.06,  lng: 31.25  },
  { name: "Libye",           capital: "Tripoli",              iso: "LBY", region: "Afrique", subregion: "Afrique du Nord",  lat: 32.90,  lng: 13.18  },
  { name: "Maroc",           capital: "Rabat",                iso: "MAR", region: "Afrique", subregion: "Afrique du Nord",  lat: 34.02,  lng: -6.84  },
  { name: "Mauritanie",      capital: "Nouakchott",           iso: "MRT", region: "Afrique", subregion: "Afrique du Nord",  lat: 18.08,  lng: -15.97 },
  { name: "Soudan",          capital: "Khartoum",             iso: "SDN", region: "Afrique", subregion: "Afrique du Nord",  lat: 15.55,  lng: 32.53  },
  { name: "Tunisie",         capital: "Tunis",                iso: "TUN", region: "Afrique", subregion: "Afrique du Nord",  lat: 36.82,  lng: 10.17  },

  // ── Afrique de l'Ouest ────────────────────────────────────
  { name: "Bénin",           capital: "Porto-Novo",           iso: "BEN", region: "Afrique", subregion: "Afrique de l'Ouest", lat: 6.37,  lng: 2.42   },
  { name: "Burkina Faso",    capital: "Ouagadougou",          iso: "BFA", region: "Afrique", subregion: "Afrique de l'Ouest", lat: 12.37, lng: -1.52  },
  { name: "Côte d'Ivoire",   capital: "Yamoussoukro",         iso: "CIV", region: "Afrique", subregion: "Afrique de l'Ouest", lat: 6.82,  lng: -5.28  },
  { name: "Gambie",          capital: "Banjul",               iso: "GMB", region: "Afrique", subregion: "Afrique de l'Ouest", lat: 13.45, lng: -16.58 },
  { name: "Ghana",           capital: "Accra",                iso: "GHA", region: "Afrique", subregion: "Afrique de l'Ouest", lat: 5.55,  lng: -0.20  },
  { name: "Guinée",          capital: "Conakry",              iso: "GIN", region: "Afrique", subregion: "Afrique de l'Ouest", lat: 9.54,  lng: -13.68 },
  { name: "Guinée-Bissau",   capital: "Bissau",               iso: "GNB", region: "Afrique", subregion: "Afrique de l'Ouest", lat: 11.86, lng: -15.60 },
  { name: "Liberia",         capital: "Monrovia",             iso: "LBR", region: "Afrique", subregion: "Afrique de l'Ouest", lat: 6.30,  lng: -10.80 },
  { name: "Mali",            capital: "Bamako",               iso: "MLI", region: "Afrique", subregion: "Afrique de l'Ouest", lat: 12.65, lng: -8.00  },
  { name: "Niger",           capital: "Niamey",               iso: "NER", region: "Afrique", subregion: "Afrique de l'Ouest", lat: 13.51, lng: 2.12   },
  { name: "Nigeria",         capital: "Abuja",                iso: "NGA", region: "Afrique", subregion: "Afrique de l'Ouest", lat: 9.07,  lng: 7.40   },
  { name: "Sénégal",         capital: "Dakar",                iso: "SEN", region: "Afrique", subregion: "Afrique de l'Ouest", lat: 14.72, lng: -17.47 },
  { name: "Sierra Leone",    capital: "Freetown",             iso: "SLE", region: "Afrique", subregion: "Afrique de l'Ouest", lat: 8.49,  lng: -13.23 },
  { name: "Togo",            capital: "Lomé",                 iso: "TGO", region: "Afrique", subregion: "Afrique de l'Ouest", lat: 6.14,  lng: 1.22   },

  // ── Afrique de l'Est ──────────────────────────────────────
  { name: "Burundi",         capital: "Gitega",               iso: "BDI", region: "Afrique", subregion: "Afrique de l'Est",  lat: -3.43, lng: 29.93  },
  { name: "Djibouti",        capital: "Djibouti",             iso: "DJI", region: "Afrique", subregion: "Afrique de l'Est",  lat: 11.59, lng: 43.15  },
  { name: "Érythrée",        capital: "Asmara",               iso: "ERI", region: "Afrique", subregion: "Afrique de l'Est",  lat: 15.34, lng: 38.93  },
  { name: "Éthiopie",        capital: "Addis-Abeba",          iso: "ETH", region: "Afrique", subregion: "Afrique de l'Est",  lat: 9.02,  lng: 38.75  },
  { name: "Kenya",           capital: "Nairobi",              iso: "KEN", region: "Afrique", subregion: "Afrique de l'Est",  lat: -1.29, lng: 36.82  },
  { name: "Madagascar",      capital: "Antananarivo",         iso: "MDG", region: "Afrique", subregion: "Afrique de l'Est",  lat: -18.91, lng: 47.54 },
  { name: "Maurice",         capital: "Port-Louis",           iso: "MUS", region: "Afrique", subregion: "Afrique de l'Est",  lat: -20.16, lng: 57.50 },
  { name: "Ouganda",         capital: "Kampala",              iso: "UGA", region: "Afrique", subregion: "Afrique de l'Est",  lat: 0.32,  lng: 32.58  },
  { name: "Rwanda",          capital: "Kigali",               iso: "RWA", region: "Afrique", subregion: "Afrique de l'Est",  lat: -1.95, lng: 30.06  },
  { name: "Somalie",         capital: "Mogadiscio",           iso: "SOM", region: "Afrique", subregion: "Afrique de l'Est",  lat: 2.05,  lng: 45.34  },
  { name: "Soudan du Sud",   capital: "Djouba",               iso: "SSD", region: "Afrique", subregion: "Afrique de l'Est",  lat: 4.86,  lng: 31.57  },
  { name: "Tanzanie",        capital: "Dodoma",               iso: "TZA", region: "Afrique", subregion: "Afrique de l'Est",  lat: -6.17, lng: 35.74  },

  // ── Afrique Centrale ──────────────────────────────────────
  { name: "Cameroun",        capital: "Yaoundé",              iso: "CMR", region: "Afrique", subregion: "Afrique Centrale",  lat: 3.87,  lng: 11.52  },
  { name: "Centrafrique",    capital: "Bangui",               iso: "CAF", region: "Afrique", subregion: "Afrique Centrale",  lat: 4.36,  lng: 18.56  },
  { name: "Congo",           capital: "Brazzaville",          iso: "COG", region: "Afrique", subregion: "Afrique Centrale",  lat: -4.27, lng: 15.28  },
  { name: "Congo (RDC)",     capital: "Kinshasa",             iso: "COD", region: "Afrique", subregion: "Afrique Centrale",  lat: -4.32, lng: 15.32  },
  { name: "Gabon",           capital: "Libreville",           iso: "GAB", region: "Afrique", subregion: "Afrique Centrale",  lat: 0.39,  lng: 9.45   },
  { name: "Guinée équatoriale", capital: "Malabo",            iso: "GNQ", region: "Afrique", subregion: "Afrique Centrale",  lat: 3.75,  lng: 8.78   },
  { name: "Tchad",           capital: "N'Djaména",            iso: "TCD", region: "Afrique", subregion: "Afrique Centrale",  lat: 12.11, lng: 15.05  },

  // ── Afrique Australe ──────────────────────────────────────
  { name: "Afrique du Sud",  capital: "Pretoria",             iso: "ZAF", region: "Afrique", subregion: "Afrique Australe",  lat: -25.74, lng: 28.19 },
  { name: "Angola",          capital: "Luanda",               iso: "AGO", region: "Afrique", subregion: "Afrique Australe",  lat: -8.84, lng: 13.23  },
  { name: "Botswana",        capital: "Gaborone",             iso: "BWA", region: "Afrique", subregion: "Afrique Australe",  lat: -24.65, lng: 25.91 },
  { name: "Eswatini",        capital: "Mbabane",              iso: "SWZ", region: "Afrique", subregion: "Afrique Australe",  lat: -26.32, lng: 31.14 },
  { name: "Lesotho",         capital: "Maseru",               iso: "LSO", region: "Afrique", subregion: "Afrique Australe",  lat: -29.32, lng: 27.48 },
  { name: "Malawi",          capital: "Lilongwe",             iso: "MWI", region: "Afrique", subregion: "Afrique Australe",  lat: -13.97, lng: 33.79 },
  { name: "Mozambique",      capital: "Maputo",               iso: "MOZ", region: "Afrique", subregion: "Afrique Australe",  lat: -25.97, lng: 32.59 },
  { name: "Namibie",         capital: "Windhoek",             iso: "NAM", region: "Afrique", subregion: "Afrique Australe",  lat: -22.56, lng: 17.08 },
  { name: "Zambie",          capital: "Lusaka",               iso: "ZMB", region: "Afrique", subregion: "Afrique Australe",  lat: -15.42, lng: 28.28 },
  { name: "Zimbabwe",        capital: "Harare",               iso: "ZWE", region: "Afrique", subregion: "Afrique Australe",  lat: -17.83, lng: 31.05 },

  // ── Amérique du Nord ──────────────────────────────────────
  { name: "Canada",          capital: "Ottawa",               iso: "CAN", region: "Amériques", subregion: "Amérique du Nord",   lat: 45.42,  lng: -75.69 },
  { name: "États-Unis",      capital: "Washington D.C.",      iso: "USA", region: "Amériques", subregion: "Amérique du Nord",   lat: 38.91,  lng: -77.02 },
  { name: "Mexique",         capital: "Mexico",               iso: "MEX", region: "Amériques", subregion: "Amérique du Nord",   lat: 19.43,  lng: -99.13 },

  // ── Amérique Centrale ─────────────────────────────────────
  { name: "Belize",          capital: "Belmopan",             iso: "BLZ", region: "Amériques", subregion: "Amérique Centrale",  lat: 17.25,  lng: -88.77 },
  { name: "Costa Rica",      capital: "San José",             iso: "CRI", region: "Amériques", subregion: "Amérique Centrale",  lat: 9.93,   lng: -84.08 },
  { name: "El Salvador",     capital: "San Salvador",         iso: "SLV", region: "Amériques", subregion: "Amérique Centrale",  lat: 13.69,  lng: -89.19 },
  { name: "Guatemala",       capital: "Guatemala",            iso: "GTM", region: "Amériques", subregion: "Amérique Centrale",  lat: 14.64,  lng: -90.51 },
  { name: "Honduras",        capital: "Tegucigalpa",          iso: "HND", region: "Amériques", subregion: "Amérique Centrale",  lat: 14.10,  lng: -87.22 },
  { name: "Nicaragua",       capital: "Managua",              iso: "NIC", region: "Amériques", subregion: "Amérique Centrale",  lat: 12.13,  lng: -86.28 },
  { name: "Panama",          capital: "Panama",               iso: "PAN", region: "Amériques", subregion: "Amérique Centrale",  lat: 8.99,   lng: -79.52 },

  // ── Caraïbes ──────────────────────────────────────────────
  { name: "Bahamas",         capital: "Nassau",               iso: "BHS", region: "Amériques", subregion: "Caraïbes",           lat: 25.06,  lng: -77.34 },
  { name: "Cuba",            capital: "La Havane",            iso: "CUB", region: "Amériques", subregion: "Caraïbes",           lat: 23.14,  lng: -82.36 },
  { name: "Haïti",           capital: "Port-au-Prince",       iso: "HTI", region: "Amériques", subregion: "Caraïbes",           lat: 18.54,  lng: -72.34 },
  { name: "Jamaïque",        capital: "Kingston",             iso: "JAM", region: "Amériques", subregion: "Caraïbes",           lat: 17.99,  lng: -76.79 },
  { name: "République dominicaine", capital: "Saint-Domingue", iso: "DOM", region: "Amériques", subregion: "Caraïbes",         lat: 18.48,  lng: -69.90 },
  { name: "Trinité-et-Tobago", capital: "Port d'Espagne",     iso: "TTO", region: "Amériques", subregion: "Caraïbes",           lat: 10.65,  lng: -61.52 },

  // ── Amérique du Sud ───────────────────────────────────────
  { name: "Argentine",       capital: "Buenos Aires",         iso: "ARG", region: "Amériques", subregion: "Amérique du Sud",    lat: -34.61, lng: -58.38 },
  { name: "Bolivie",         capital: "Sucre",                iso: "BOL", region: "Amériques", subregion: "Amérique du Sud",    lat: -19.04, lng: -65.26 },
  { name: "Brésil",          capital: "Brasilia",             iso: "BRA", region: "Amériques", subregion: "Amérique du Sud",    lat: -15.78, lng: -47.93 },
  { name: "Chili",           capital: "Santiago",             iso: "CHL", region: "Amériques", subregion: "Amérique du Sud",    lat: -33.46, lng: -70.65 },
  { name: "Colombie",        capital: "Bogota",               iso: "COL", region: "Amériques", subregion: "Amérique du Sud",    lat: 4.71,   lng: -74.07 },
  { name: "Équateur",        capital: "Quito",                iso: "ECU", region: "Amériques", subregion: "Amérique du Sud",    lat: -0.23,  lng: -78.52 },
  { name: "Guyana",          capital: "Georgetown",           iso: "GUY", region: "Amériques", subregion: "Amérique du Sud",    lat: 6.80,   lng: -58.16 },
  { name: "Paraguay",        capital: "Asunción",             iso: "PRY", region: "Amériques", subregion: "Amérique du Sud",    lat: -25.29, lng: -57.65 },
  { name: "Pérou",           capital: "Lima",                 iso: "PER", region: "Amériques", subregion: "Amérique du Sud",    lat: -12.05, lng: -77.04 },
  { name: "Suriname",        capital: "Paramaribo",           iso: "SUR", region: "Amériques", subregion: "Amérique du Sud",    lat: 5.87,   lng: -55.17 },
  { name: "Uruguay",         capital: "Montevideo",           iso: "URY", region: "Amériques", subregion: "Amérique du Sud",    lat: -34.90, lng: -56.19 },
  { name: "Venezuela",       capital: "Caracas",              iso: "VEN", region: "Amériques", subregion: "Amérique du Sud",    lat: 10.49,  lng: -66.88 },

  // ── Australasie ───────────────────────────────────────────
  { name: "Australie",       capital: "Canberra",             iso: "AUS", region: "Océanie", subregion: "Australasie",          lat: -35.28, lng: 149.13 },
  { name: "Nouvelle-Zélande", capital: "Wellington",          iso: "NZL", region: "Océanie", subregion: "Australasie",          lat: -41.29, lng: 174.78 },
  { name: "Papouasie-Nouvelle-Guinée", capital: "Port Moresby", iso: "PNG", region: "Océanie", subregion: "Australasie",       lat: -9.44,  lng: 147.18 },

  // ── Pacifique ─────────────────────────────────────────────
  { name: "Fidji",           capital: "Suva",                 iso: "FJI", region: "Océanie", subregion: "Pacifique",            lat: -18.14, lng: 178.44 },
  { name: "Îles Salomon",    capital: "Honiara",              iso: "SLB", region: "Océanie", subregion: "Pacifique",            lat: -9.43,  lng: 160.04 },
  { name: "Samoa",           capital: "Apia",                 iso: "WSM", region: "Océanie", subregion: "Pacifique",            lat: -13.83, lng: -171.77},
  { name: "Vanuatu",         capital: "Port-Vila",            iso: "VUT", region: "Océanie", subregion: "Pacifique",            lat: -17.73, lng: 168.32 },
];

// ISO alpha-3 → région (lookup rapide)
const a3ToRegion = {};
COUNTRIES.forEach(c => a3ToRegion[c.iso] = c.region);

function normalizeText(str) {
  return str.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[-'\s]+/g, " ").trim();
}
function checkCapitalAnswer(input, capital) {
  return normalizeText(input) === normalizeText(capital);
}
function getCountriesByRegion(filter) {
  if (!filter) return COUNTRIES;
  return COUNTRIES.filter(c => c.region === filter || c.subregion === filter);
}
function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}
