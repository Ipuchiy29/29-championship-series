/* ---------- Данные ---------- */
const STORE = "winterCup2027v2";
const ROLES = ["Керри", "Мид", "Оффлейн", "Саппорт 4", "Саппорт 5"];
const mkPlayers = () => ROLES.map((role, i) => ({ nick: `Player ${i + 1}`, role }));
const mkTeam = n => ({ name: `Team ${n}`, tag: `TM${n}`, p: 0, w: 0, l: 0, pts: 0, players: mkPlayers() });
const mkMatch = (stage, a, b) => ({ stage, date: "Дата уточняется", a, b, scoreA: "—", scoreB: "—", status: "Ожидается" });

const defaultData = {
  groups: {
    A: [1, 2, 3, 4].map(n => mkTeam(n)),
    B: [5, 6, 7, 8].map(n => mkTeam(n))
  },
  matches: [
    mkMatch("Группа A", "Team 1", "Team 2"),
    mkMatch("Группа A", "Team 3", "Team 4"),
    mkMatch("Группа B", "Team 5", "Team 6"),
    mkMatch("Группа B", "Team 7", "Team 8")
  ],
  playoffs: { semi1: ["A1", "B2"], semi2: ["B1", "A2"], final: ["Победитель SF1", "Победитель SF2"] }
};

/* Трансляция (Twitch). Чтобы сменить канал, поменяйте значение ниже. */
const STREAM = { channel: "ipuchiy_29" };

/* ---------- Прошедший турнир: Winter Cup 2026 · Season 2 ---------- */
const PRIZE = "50\u00a0000\u00a0₽"; // приз за 1 место (одинаковый для Season 2 и Season 3)
const mkTag = n => { const s = x => x.replace(/[^\p{L}\p{N}]/gu, ""), m = /^team\s+(.+)$/i.exec(n); return (m ? "T" + s(m[1]).slice(0, 2) : s(n).slice(0, 3)).toUpperCase(); };
/* команда: название, группа, средний MMR, игроки [ник, MMR, 1 = выделен зелёным в таблице] */
const T2 = (name, g, avg, ...pl) => ({ name, g, avg, tag: mkTag(name), players: pl.map(([nick, mmr, hl]) => ({ nick, mmr, hl: !!hl })) });
/* матч: id, [команда, сид, счёт], [команда, сид, счёт], победитель a|b, опции (from — откуда идут линии, wo — техническая победа) */
const mt = (id, a, b, w, o = {}) => ({ id, a: { n: a[0], s: a[1], v: a[2] }, b: { n: b[0], s: b[1], v: b[2] }, w, ...o });

const S2 = {
  teams: [
    /* Группа A (по сидам) */
    T2("МАЛЫШКИ", "A", 4040, ["imortal_boy", 7600, 1], ["milwaukeeeeeeeeeee", 1500], ["fe1ka1", 4100], ["niksniks", 2000], ["mykola_inv", 5000]),
    T2("КОРАБЛЬ", "A", 4040, ["kusarixxrain", 11500], ["hom1x1deg", 4300, 1], ["ssimpblvde", 2900], ["kwaannk", 900], ["snowkas", 900]),
    T2("PUSSYPOWER", "A", 3920, ["andreyhed", 5800, 1], ["mariiqqq", 5000], ["murmuwer", 5600], ["BOB9H", 2200], ["qoqu_superwoman", 1000]),
    T2("6am in Tokyo", "A", 4060, ["unformous", 8800], ["tokyoto99", 5600, 1], ["sasaxui322", 2700], ["Dastr_", 2000], ["kabanidze44", 1200]),
    T2("Akatsuki 死", "A", 4260, ["casadise", 8000], ["yalkii", 5200], ["Yupieeee", 2300], ["hoper", 5700], ["Ne_Hatiko28", 100, 1]),
    T2("ОХАЁШЕЧКИ", "A", 3900, ["6996_6996_6996", 7700], ["sasshk0", 3000], ["paranoic_kid", 6500, 1], ["emob3rn", 1500], ["loly_holly", 800]),
    T2("r3ich", "A", 4120, ["coldfronsour", 5000], ["yanlxd", 5000, 1], ["zxcnexty", 2000], ["kapysta2005", 4600], ["zhrwdeath", 4000]),
    T2("ПУЗОТРЯС TEAM", "A", 4140, ["Zong", 9500], ["Ditor", 6100, 1], ["Yukyol", 3100], ["Dinsooooo", 1500], ["papir00s", 500]),
    /* Группа B (по сидам) */
    T2("Team 10", "B", 3960, ["hontowill", 7100, 1], ["seshoqu", 5000], ["sp3cifika", 2000], ["kaevawy", 2200], ["akiranosense", 3500]),
    T2("67", "B", 3960, ["dazzqwe", 6500, 1], ["matvey_cheska", 2500], ["payforshine", 7000], ["aluu", 2500], ["youusane", 1800]),
    T2("ШТАНЫ БЕЛЫЕ", "B", 4060, ["INBoss1k", 10500, 1], ["warcraftplayer333", 3000], ["Munular", 3000], ["timnik_btw", 2700], ["eiko633", 1300]),
    T2("Team Kizaru", "B", 4200, ["ssgmura", 7000, 1], ["holorabangg4", 4000], ["r4dom1r", 3500], ["1mpuulz_", 6000], ["kurokoken", 500]),
    T2("котята^_^", "B", 3940, ["dummy_vs_world", 9000], ["etotubludok", 6000], ["rouziik", 1000, 1], ["uuniucky", 2200], ["bonechka_tw", 1500]),
    T2("хохоряшки", "B", 3900, ["6a604ka", 10600, 1], ["idk_dimasik", 5100], ["yurapivo", 1500], ["poisonika", 2000], ["alko_trener", 300]),
    T2("akira yamaokaクス", "B", 4060, ["gordushha", 5900, 1], ["yuniko07", 4000], ["cutepenka", 4000], ["gorchlca", 3000], ["yarizzashy", 3400]),
    T2("КОНОХА", "B", 3900, ["vladikvladik", 5000, 1], ["prp1337", 4500], ["schmarlya", 3500], ["roxxln", 3600], ["dreamal0ne", 2900])
  ],
  brackets: {
    groupA: {
      upper: [
        { t: "Раунд 1", m: [mt(1, ["МАЛЫШКИ", 1, 1], ["ПУЗОТРЯС TEAM", 8, 0], "a"), mt(2, ["6am in Tokyo", 4, 1], ["Akatsuki 死", 5, 0], "a"), mt(3, ["КОРАБЛЬ", 2, 0], ["r3ich", 7, 1], "b"), mt(4, ["PUSSYPOWER", 3, 0], ["ОХАЁШЕЧКИ", 6, 1], "b")] },
        { t: "Полуфиналы", m: [mt(7, ["МАЛЫШКИ", 1, 1], ["6am in Tokyo", 4, 0], "a", { from: [1, 2] }), mt(8, ["r3ich", 7, 1], ["ОХАЁШЕЧКИ", 6, 0], "a", { from: [3, 4] })] },
        { t: "Финал", m: [mt(12, ["МАЛЫШКИ", 1, 2], ["r3ich", 7, 0], "a", { from: [7, 8] })] }
      ],
      lower: [
        { t: "Раунд нижней сетки 1", m: [mt(5, ["ПУЗОТРЯС TEAM", 8, 1], ["Akatsuki 死", 5, 0], "a"), mt(6, ["КОРАБЛЬ", 2, 1], ["PUSSYPOWER", 3, 0], "a")] },
        { t: "Раунд нижней сетки 2", m: [mt(10, ["ОХАЁШЕЧКИ", 6, 0], ["ПУЗОТРЯС TEAM", 8, 1], "b", { from: [5] }), mt(9, ["6am in Tokyo", 4, 0], ["КОРАБЛЬ", 2, 1], "b", { from: [6] })] },
        { t: "Раунд нижней сетки 3", m: [mt(11, ["ПУЗОТРЯС TEAM", 8, 1], ["КОРАБЛЬ", 2, 0], "a", { from: [10, 9] })] },
        { t: "Раунд нижней сетки 4", m: [mt(15, ["r3ich", 7, 0], ["ПУЗОТРЯС TEAM", 8, 2], "b", { from: [11] })] }
      ]
    },
    groupB: {
      upper: [
        { t: "Раунд 1", m: [mt(1, ["Team 10", 1, 1], ["КОНОХА", 8, 0], "a"), mt(2, ["Team Kizaru", 4, 1], ["котята^_^", 5, 0], "a"), mt(3, ["67", 2, 1], ["akira yamaokaクス", 7, 0], "a"), mt(4, ["ШТАНЫ БЕЛЫЕ", 3, 0], ["хохоряшки", 6, 1], "b")] },
        { t: "Полуфиналы", m: [mt(7, ["Team 10", 1, null], ["Team Kizaru", 4, null], "a", { from: [1, 2], wo: true }), mt(8, ["67", 2, 0], ["хохоряшки", 6, 1], "b", { from: [3, 4] })] },
        { t: "Финал", m: [mt(12, ["Team 10", 1, 0], ["хохоряшки", 6, 2], "b", { from: [7, 8] })] }
      ],
      lower: [
        { t: "Раунд нижней сетки 1", m: [mt(5, ["КОНОХА", 8, 1], ["котята^_^", 5, 0], "a"), mt(6, ["akira yamaokaクス", 7, 0], ["ШТАНЫ БЕЛЫЕ", 3, 1], "b")] },
        { t: "Раунд нижней сетки 2", m: [mt(10, ["67", 2, 0], ["КОНОХА", 8, 1], "b", { from: [5] }), mt(9, ["Team Kizaru", 4, null], ["ШТАНЫ БЕЛЫЕ", 3, null], "b", { from: [6], wo: true })] },
        { t: "Раунд нижней сетки 3", m: [mt(11, ["КОНОХА", 8, 0], ["ШТАНЫ БЕЛЫЕ", 3, 1], "b", { from: [10, 9] })] },
        { t: "Раунд нижней сетки 4", m: [mt(15, ["Team 10", 1, 0], ["ШТАНЫ БЕЛЫЕ", 3, 2], "b", { from: [11] })] }
      ]
    },
    playoffs: {
      upper: [
        { t: "Раунд 1", m: [mt(1, ["МАЛЫШКИ", 1, 1], ["ШТАНЫ БЕЛЫЕ", 4, 2], "b"), mt(2, ["хохоряшки", 2, 0], ["ПУЗОТРЯС TEAM", 3, 2], "b")] },
        { t: "Полуфиналы", m: [mt(4, ["ШТАНЫ БЕЛЫЕ", 4, 2], ["ПУЗОТРЯС TEAM", 3, 1], "a", { from: [1, 2] })] },
        { t: "Финал", m: [mt(6, ["ШТАНЫ БЕЛЫЕ", 4, 2], ["хохоряшки", 2, 3], "b", { from: [4, 5] })] }
      ],
      lower: [
        { t: "Раунд нижней сетки 1", m: [mt(3, ["МАЛЫШКИ", 1, 0], ["хохоряшки", 2, 2], "b")] },
        { t: "Раунд нижней сетки 2", m: [mt(5, ["ПУЗОТРЯС TEAM", 3, 2], ["хохоряшки", 2, 0], "b", { from: [3] })] }
      ]
    }
  }
};

/* WINTER CUP 2025 · SEASON 1 — данные из предоставленных таблиц */
const S1 = {
 teams: [
 T2("ANONYMOUS TEAM","B",4480,["vanek",6515],["yanlx",5367],["himera",5500],["sasshk0",2618],["yuniko",3000]),
 T2("DARK REEF","A",4580,["leiineezy",7900],["hoper",5600],["gordushha",5000],["akiranosense",1584],["cutepenka",3500]),
 T2("TEAM 3","B",4500,["Zong",7900],["1mpuulz_",6000],["seshoqu",4400],["Dinsooooo",1556],["chegewar",2000]),
 T2("WWWWW TEAM","A",4400,["GrandUrahara",10200],["ognev__",4819],["hoplesov",1000],["watcher_hZ",3000],["Yukyol",3000]),
 T2("EGOISTCINEMA","A",4520,["casadise",6600],["imortal_boy",6308],["Ditor",6000],["vladikvladik",3085],["ferus_s",1108]),
 T2("INVALIDIKI TEAM","B",4840,["Andrew Tate",8000],["lobotomy333",4200],["spermodrop",6003],["арсений чечен",1001],["coldfrontsour",5032])
 ],
 standings: {
 A:[{n:"EGOISTCINEMA",w:2,l:0,h:["W","W"]},{n:"WWWWW TEAM",w:1,l:1,h:["L","W"]},{n:"DARK REEF",w:0,l:2,h:["L","L"]}],
 B:[{n:"ANONYMOUS TEAM",w:2,l:0,h:["W","W"]},{n:"INVALIDIKI TEAM",w:1,l:1,h:["W","L"]},{n:"TEAM 3",w:0,l:2,h:["L","L"]}]
 },
 matches:[
 {stage:"Плей-офф · Полуфинал 1",a:"INVALIDIKI TEAM",b:"EGOISTCINEMA",sa:0,sb:2},
 {stage:"Плей-офф · Полуфинал 2",a:"ANONYMOUS TEAM",b:"WWWWW TEAM",sa:2,sb:1},
 {stage:"Плей-офф · Финал",a:"EGOISTCINEMA",b:"ANONYMOUS TEAM",sa:3,sb:0}
 ]
};
const historic = () => current?.id === "winter-cup-2025-s1" ? S1 : S2;
const prizeFor = () => current?.id === "winter-cup-2025-s1" ? "25 000 ₽" : PRIZE;
function s1Standings(){return ["A","B"].map(g=>`<h3 class="team-group-title">Группа ${g}</h3><div class="s1-table-wrap"><table class="team-table"><thead><tr><th>МЕСТО</th><th>КОМАНДА</th><th>МАТЧИ В-П</th><th>ПОБЕДЫ</th><th>ОЧКИ</th><th>ИСТОРИЯ</th></tr></thead><tbody>${S1.standings[g].map((t,i)=>`<tr><td>${i+1}</td><td><strong>${esc(t.n)}</strong></td><td>${t.w} - ${t.l}</td><td>${t.w}</td><td>${t.w}</td><td>${t.h.map(v=>`<span class="result-chip ${v==='W'?'win':'loss'}">${v}</span>`).join(' ')}</td></tr>`).join('')}</tbody></table></div>`).join('');}
function s1Bracket(){const m=S1.matches;const tile=x=>`<div class="bracket-match"><div class="bracket-team ${x.sa>x.sb?'winner':''}"><span>${esc(x.a)}</span><b>${x.sa}</b></div><div class="bracket-team ${x.sb>x.sa?'winner':''}"><span>${esc(x.b)}</span><b>${x.sb}</b></div><div class="bracket-note">${esc(x.stage)}</div></div>`;return `<div class="bracket-round"><div class="round-title">ПОЛУФИНАЛЫ · BO3</div>${tile(m[0])}${tile(m[1])}</div><div class="bracket-round"><div class="round-title">ФИНАЛ · BO5</div>${tile(m[2])}</div><div class="bracket-round"><div class="round-title">ЧЕМПИОН</div><div class="bracket-match final"><div class="bracket-team winner"><span>EGOISTCINEMA</span><b>🏆</b></div><div class="bracket-note">WINTER CUP 2025 · SEASON 1</div></div></div>`;}
/* Список турниров. Чтобы добавить новый, добавьте объект в этот массив. */
const tournaments = [
  {
    id: "winter-cup-2027",
    title: "WINTER CUP 2027",
    season: "Season 3",
    game: "Dota 2",
    status: "Скоро",
    format: "Group Stage + Playoffs",
    image: "assets/trophy.webp",
    playoffsLabel: "SINGLE ELIMINATION",
    blurb: "Групповой этап определит сильнейших, а плей-офф решит, кто станет чемпионом Winter Cup 2027.",
    meta: () => [["Команды", teamCount()], ["Группы", "2"], ["Приз за 1 место", PRIZE], ["Старт", "Дата уточняется"]],
    stats: () => [
      ["ФОРМАТ", "GROUPS <i>+</i><br>PLAYOFFS", "Группы и плей-офф"],
      ["УЧАСТНИКИ", String(teamCount()).padStart(2, "0"), "Команд-участников"],
      ["ГРУППЫ", "02", "По 4 команды"],
      ["ПРИЗОВОЙ", PRIZE, "За 1 место"]
    ]
  },
  {
    id: "winter-cup-2025-s1", title: "WINTER CUP 2025", season: "Season 1", game: "Dota 2",
    status: "Завершён", finished: true, format: "Group Stage + Playoffs", image: null, mvp: "imortal_boy",
    playoffsLabel: "SINGLE ELIMINATION",
    blurb: "Первый сезон Winter Cup: 6 команд, две группы по 3, полуфиналы BO3 и финал BO5. Чемпион — EGOISTCINEMA.",
    result: {first:"EGOISTCINEMA",second:"ANONYMOUS TEAM",third:"INVALIDIKI TEAM / WWWWW TEAM"},
    meta:()=>[["Команды","6"],["Группы","2"],["Приз за 1 место","25 000 ₽"],["Победитель","EGOISTCINEMA"]],
    stats:()=>[["ФОРМАТ","GROUPS <i>+</i><br>PLAYOFFS","Группы и плей-офф"],["УЧАСТНИКИ","06","Команд-участников"],["ГРУППЫ","02","По 3 команды"],["ПРИЗОВОЙ","25 000 ₽","За 1 место"]]
  },
  {
    id: "winter-cup-2026-s2",
    title: "WINTER CUP 2026",
    season: "Season 2",
    game: "Dota 2",
    status: "Завершён",
    finished: true,
    mvp: "Zong",
    format: "Double Elimination",
    playoffsLabel: "DOUBLE ELIMINATION",
    blurb: "16 команд, две группы по 8 и плей-офф. И в группах, и в плей-офф играли по системе с верхней и нижней сеткой. Чемпионом стала команда хохоряшки.",
    result: { first: "хохоряшки", second: "ШТАНЫ БЕЛЫЕ", third: "ПУЗОТРЯС TEAM" },
    meta: () => [["Команды", "16"], ["Группы", "2"], ["Приз за 1 место", PRIZE], ["Победитель", "хохоряшки"]],
    stats: () => [
      ["ФОРМАТ", "GROUPS <i>+</i><br>PLAYOFFS", "Двойная сетка (верхняя и нижняя)"],
      ["УЧАСТНИКИ", "16", "Команд-участников"],
      ["ГРУППЫ", "02", "По 8 команд"],
      ["ПРИЗОВОЙ", PRIZE, "За 1 место"]
    ]
  }
];

let data = structuredClone(defaultData);
function normalize(d) {
  ["A", "B"].forEach(g => d.groups[g].forEach(t => { if (!Array.isArray(t.players)) t.players = mkPlayers(); }));
  return d;
}
function load() {
  try { return normalize(JSON.parse(localStorage.getItem(STORE)) || structuredClone(defaultData)); }
  catch (e) { return structuredClone(defaultData); }
}
async function save() {
  try { const r = await fetch('/api/data', {method:'PUT',headers:{'Content-Type':'application/json'},body:JSON.stringify(data)}); if(!r.ok) throw Error('Нет доступа или ошибка сервера'); renderAll(); }
  catch(e) { alert('Изменения не сохранены: '+e.message); await loadShared(); }
}
async function loadShared() {try {const r=await fetch('/api/data');if(r.ok){data=normalize(await r.json());renderAll();route();}}catch(e){console.warn(e)}}
function esc(s) { return String(s).replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c])); }
function sorted(group) { return [...data.groups[group]].sort((a, b) => b.pts - a.pts || b.w - a.w || a.name.localeCompare(b.name, undefined, { numeric: true })); }
function teamCount() { return data.groups.A.length + data.groups.B.length; }
const $ = id => document.getElementById(id);

/* ---------- Отрисовка ---------- */
let current = null; // открытый сейчас турнир
const upcoming = () => tournaments.filter(t => !t.finished);
const past = () => tournaments.filter(t => t.finished);

function tourCard(t) {
  return `<article class="tour-card${t.finished ? " finished" : ""}"><div class="tour-info">
    <div class="chips"><span class="chip ${t.finished ? "done" : "soon"}">${esc(t.status)}</span><span class="chip">${esc(t.game)}</span></div>
    <h3>${esc(t.title)}</h3>
    <p class="tour-sub">${esc(t.season)} · ${esc(t.format)}</p>
    ${t.mvp ? `<div class="mvp-inline"><span>★ MVP ТУРНИРА</span><strong>${esc(t.mvp)}</strong></div>` : ""}
    <dl class="tour-meta">${t.meta().map(([k, v]) => `<div><dt>${esc(k)}</dt><dd>${esc(v)}</dd></div>`).join("")}</dl>
    <div class="tour-actions"><a class="primary-btn" href="#/tournament/${t.id}">${t.finished ? "Смотреть итоги" : "Открыть турнир"} <b>→</b></a><a class="text-btn" href="#/tournament/${t.id}/teams">Команды <span>↘</span></a></div>
  </div>${t.image ? `<img class="tour-img" src="${t.image}" alt="" loading="lazy">` : ""}</article>`;
}
function renderFeatured() { $("featuredContainer").innerHTML = tourCard(upcoming()[0] || tournaments[0]); }
function renderTournaments() {
  $("tournamentsContainer").innerHTML =
    `<h3 class="team-group-title">Ближайшие</h3>${upcoming().map(tourCard).join("")}<div class="tour-card placeholder"><div><h3>Скоро больше</h3><p class="tour-sub">Здесь появятся другие турниры.</p></div></div>` +
    (past().length ? `<h3 class="team-group-title">Прошедшие</h3>${past().map(tourCard).join("")}` : "");
}

/* --- общие данные текущего турнира --- */
const groupTeams = g => current.finished ? historic().teams.filter(t => t.g === g) : data.groups[g];
const roleLabel = p => p.role != null ? p.role : `MMR ${p.mmr}`;

function podiumHTML(r) {
  const nicks = n => historic().teams.find(t => t.name === n)?.players.map(p => esc(p.nick)).join(", ") || "";
  const card = (cls, place, name, extra = "") => `<article class="podium-card ${cls}"><span>${place}</span><strong>${esc(name)}</strong>${extra}<small>${nicks(name)}</small></article>`;
  return `<div class="results-block"><div class="section-heading"><div><div class="eyebrow">РЕЗУЛЬТАТЫ</div><h2>ИТОГИ <em>ТУРНИРА</em></h2></div></div><div class="podium">${card("gold", "1 МЕСТО", r.first, `<em class="prize">${prizeFor()}</em>`)}${card("", "2 МЕСТО", r.second)}${card("", "3 МЕСТО", r.third)}</div></div>`;
}
function renderOverview() {
  $("overviewText").textContent = current.blurb;
  $("statsContainer").innerHTML = current.stats().map(([l, v, s]) => `<article class="stat-card"><span>${l}</span><strong>${v}</strong><small>${s}</small></article>`).join("");
  $("resultsContainer").innerHTML = current.finished ? podiumHTML(current.result) + `<div class="mvp-award"><span class="mvp-star">★</span><div><small>ЛУЧШИЙ ИГРОК · MVP ТУРНИРА</small><strong>${esc(current.mvp || "Не определён")}</strong><p>${esc(current.title)} · ${esc(current.season)}</p></div></div>` : "";
}
function renderTeams() {
  $("teamsContainer").innerHTML = ["A", "B"].map(g => `<h3 class="team-group-title">Группа ${g}</h3><div class="roster-grid">${
    groupTeams(g).map(t => `<article class="roster"><div class="roster-head"><span class="team-logo">${esc(t.tag || "D2")}</span><div><strong>${esc(t.name)}</strong><small>Группа ${g}${t.avg ? ` · ср. MMR ${t.avg}` : ""}</small></div></div><ul>${
      t.players.map(p => `<li><span>${esc(roleLabel(p))}</span><b><a class="player-link" href="#/player/${encodeURIComponent(playerId(p.nick))}">${esc(p.nick)}</a></b></li>`).join("")
    }</ul></article>`).join("") || '<div class="empty-state">Команды пока не добавлены.</div>'
  }</div>`).join("");
}

/* --- сетка с верхней и нижней частью (double elimination) --- */
function deTeam(x, win, wo) {
  const score = x.v == null ? (win ? "W" : "–") : x.v;
  return `<div class="de-team${win ? " win" : ""}${wo && !win ? " out" : ""}"><i>${x.s}</i><span>${esc(x.n)}</span><b>${score}</b></div>`;
}
function deMatch(m) {
  return `<div class="de-match" data-m="${m.id}"${m.from ? ` data-from="${m.from.join(",")}"` : ""}><em class="de-id">${m.id}</em>${deTeam(m.a, m.w === "a", m.wo)}${deTeam(m.b, m.w === "b", m.wo)}</div>`;
}
const deSection = rounds => `<div class="de-section">${rounds.map(r => `<div class="de-col"><div class="de-title">${r.t}</div><div class="de-matches">${r.m.map(deMatch).join("")}</div></div>`).join("")}</div>`;
const deHTML = b => `<div class="de-wrap"><div class="de">${deSection(b.upper)}${deSection(b.lower)}<svg class="de-lines" aria-hidden="true"></svg></div></div>`;

function renderGroups() {
  const root = $("groupsContainer");
  if (current.id === "winter-cup-2025-s1") { root.className = "de-groups"; root.innerHTML = s1Standings(); $("groupsLegend").hidden = true; return; }
  if (current.finished) {
    root.className = "de-groups";
    root.innerHTML = ["A", "B"].map(g => `<h3 class="team-group-title">Группа ${g}</h3>${deHTML(S2.brackets["group" + g])}`).join("");
    $("groupsLegend").hidden = true;
    return;
  }
  $("groupsLegend").hidden = false;
  root.className = "groups-grid";
  root.innerHTML = ["A", "B"].map(g => `<article class="group-card"><div class="group-head"><strong>GROUP ${g}</strong><span>ТОП-2 → PLAYOFFS</span></div><table class="team-table"><thead><tr><th>КОМАНДА</th><th>И</th><th>В</th><th>П</th><th>ОЧКИ</th></tr></thead><tbody>${sorted(g).map(t => `<tr><td><div class="team-name"><span class="team-logo">${esc(t.tag || "D2")}</span>${esc(t.name)}</div></td><td>${t.p}</td><td>${t.w}</td><td>${t.l}</td><td>${t.pts}</td></tr>`).join("")}</tbody></table></article>`).join("");
}
function renderBracket() {
  const root = $("bracketContainer");
  $("playoffsLabel").textContent = current.playoffsLabel;
  if (current.id === "winter-cup-2025-s1") { root.className = "bracket"; root.innerHTML = s1Bracket(); return; }
  if (current.finished) { root.className = "de-groups"; root.innerHTML = deHTML(S2.brackets.playoffs); return; }
  root.className = "bracket";
  const a = sorted("A"), b = sorted("B");
  const slots = { A1: a[0]?.name || "1 место группы A", A2: a[1]?.name || "2 место группы A", B1: b[0]?.name || "1 место группы B", B2: b[1]?.name || "2 место группы B" };
  const match = (title, x, y, final = false) => `<div class="bracket-match ${final ? "final" : ""}"><div class="bracket-team"><span>${esc(x)}</span><b>—</b></div><div class="bracket-team"><span>${esc(y)}</span><b>—</b></div><div class="bracket-note">${title} · BO3</div></div>`;
  root.innerHTML = `<div class="bracket-round"><div class="round-title">ПОЛУФИНАЛЫ</div>${match("SF 1", slots.A1, slots.B2)}${match("SF 2", slots.B1, slots.A2)}</div><div class="bracket-round"><div class="round-title">ФИНАЛ</div>${match("GRAND FINAL", "Победитель SF 1", "Победитель SF 2", true)}</div><div class="bracket-round"><div class="round-title">ЧЕМПИОН</div><div class="bracket-match final"><div class="bracket-team winner"><span>WINTER CUP 2027</span><b>❄</b></div><div class="bracket-note">Место чемпиона будет заполнено после финала</div></div></div>`;
}
function s2Rows() {
  const out = [], short = t => t.replace("Раунд нижней сетки", "Нижняя").replace("Полуфиналы", "Полуфинал");
  [["Плей-офф", S2.brackets.playoffs], ["Группа A", S2.brackets.groupA], ["Группа B", S2.brackets.groupB]].forEach(([stage, b]) => {
    const list = [];
    [...b.upper, ...b.lower].forEach(r => r.m.forEach(m => list.push({ stage, round: short(r.t), m })));
    out.push(...list.sort((x, y) => y.m.id - x.m.id));
  });
  return out.map(({ stage, round, m }) => {
    const score = m.wo ? "W/O" : `${m.a.v} : ${m.b.v}`;
    return `<div class="match-row"><div class="match-meta"><b>${esc(stage)}</b>${esc(round)} · №${m.id}</div><div class="match-teams"><span class="${m.w === "a" ? "win" : ""}">${esc(m.a.n)}</span><span class="vs">VS</span><span class="${m.w === "b" ? "win" : ""}">${esc(m.b.n)}</span></div><div class="match-score">${score}<small>${m.wo ? "Тех. победа" : "Завершён"}</small></div></div>`;
  }).join("");
}
function renderMatches() {
  $("matchesLabel").textContent = current.title;
  $("matchesContainer").innerHTML = current.id === "winter-cup-2025-s1" ? S1.matches.map(m=>`<div class="match-row"><div class="match-meta"><b>${esc(m.stage)}</b>Завершён</div><div class="match-teams"><span class="${m.sa>m.sb?"win":""}">${esc(m.a)}</span><span class="vs">VS</span><span class="${m.sb>m.sa?"win":""}">${esc(m.b)}</span></div><div class="match-score">${m.sa} : ${m.sb}<small>Завершён</small></div></div>`).join("") : current.finished ? s2Rows() :
    (data.matches.map(m => `<div class="match-row"><div class="match-meta"><b>${esc(m.stage)}</b>${esc(m.date)}</div><div class="match-teams"><span>${esc(m.a)}</span><span class="vs">VS</span><span>${esc(m.b)}</span></div><div class="match-score">${esc(m.scoreA)} : ${esc(m.scoreB)}<small>${esc(m.status)}</small></div></div>`).join("") || '<div class="empty-state">Матчи пока не добавлены.</div>');
}
function renderPanes() {
  if (!current) return;
  renderOverview(); renderTeams(); renderGroups(); renderBracket(); renderMatches();
}
function renderAll() { renderFeatured(); renderTournaments(); renderPanes(); }

/* Линии сетки считаются по реальному положению карточек */
function drawLines() {
  document.querySelectorAll(".de").forEach(de => {
    if (!de.offsetParent) return; // вкладка скрыта
    const svg = de.querySelector(".de-lines"), box = de.getBoundingClientRect();
    svg.setAttribute("width", de.scrollWidth); svg.setAttribute("height", de.scrollHeight);
    let d = "";
    de.querySelectorAll(".de-match[data-from]").forEach(el => {
      const r = el.getBoundingClientRect(), x2 = r.left - box.left, y2 = r.top - box.top + r.height / 2;
      el.dataset.from.split(",").forEach(id => {
        const s = de.querySelector(`.de-match[data-m="${id}"]`); if (!s) return;
        const sr = s.getBoundingClientRect(), x1 = sr.right - box.left, y1 = sr.top - box.top + sr.height / 2, xm = (x1 + x2) / 2;
        d += `M${x1} ${y1}H${xm}V${y2}H${x2}`;
      });
    });
    svg.innerHTML = `<path d="${d}"/>`;
  });
}

/* ---------- Трансляция ---------- */
function streamHTML(withChat) {
  const ch = STREAM.channel, url = `https://www.twitch.tv/${ch}`;
  const host = location.hostname, online = /^https?:$/.test(location.protocol) && host;
  const frame = online
    ? `<iframe src="https://player.twitch.tv/?channel=${ch}&parent=${encodeURIComponent(host)}&autoplay=false&muted=true" title="Трансляция Twitch" allowfullscreen></iframe>`
    : `<div class="stream-fallback"><span class="chip soon">TWITCH</span><p>Встроенный плеер заработает после публикации сайта на домене.<br>Пока трансляцию можно смотреть на Twitch.</p><a class="primary-btn" href="${url}" target="_blank" rel="noopener">Смотреть на Twitch <b>↗</b></a></div>`;
  const chat = withChat && online
    ? `<div class="stream-chat"><iframe src="https://www.twitch.tv/embed/${ch}/chat?parent=${encodeURIComponent(host)}&darkpopout" title="Чат Twitch"></iframe></div>` : "";
  return `<div class="stream ${chat ? "with-chat" : ""}"><div class="stream-frame">${frame}</div>${chat}</div>` +
    `<div class="stream-bar"><span>twitch.tv/${ch}</span><a class="text-btn" href="${url}" target="_blank" rel="noopener">Открыть на Twitch <span>↗</span></a></div>`;
}
/* Плеер создаётся только на открытой странице, чтобы не грузиться в фоне */
function renderStreams(view, tab) {
  $("streamHome").innerHTML = view === "home" ? streamHTML(false) : "";
  $("streamTab").innerHTML = view === "tournament" && tab === "stream" ? streamHTML(true) : "";
}

/* ---------- Рейтинг игроков по результатам команд ---------- */
// Подтверждённые варианты ников: один профиль и единый рейтинг.
const PLAYER_ALIASES = {
  "dtiordomi": "ditor", "ditordomi": "ditor",
  "imortall_boy": "imortal_boy",
  "vladikvladikk": "vladikvladik"
};
const PLAYER_NAMES = {"ditor":"Ditor", "imortal_boy":"imortal_boy", "vladikvladik":"vladikvladik"};
function playerId(nick) { const id = String(nick).trim().toLocaleLowerCase("ru"); return PLAYER_ALIASES[id] || id; }
function playerName(nick) { const id=playerId(nick); return PLAYER_NAMES[id] || nick.trim(); }
function playerRanking() {
  const records = new Map();
  const results = new Map();
  function add(tournament, name, won) {
    const key = tournament + "|" + name;
    if (!results.has(key)) results.set(key, {played:0,wins:0,losses:0});
    const r = results.get(key); r.played++; if (won) r.wins++; else r.losses++;
  }
  // Season 1: групповые победы/поражения из таблиц + три матча плей-офф.
  for (const group of Object.values(S1.standings)) for (const t of group) {
    const key = "s1|" + t.n;
    results.set(key, {played:t.w+t.l,wins:t.w,losses:t.l});
  }
  for (const m of S1.matches) { add("s1",m.a,m.sa>m.sb); add("s1",m.b,m.sb>m.sa); }
  // Season 2: каждая встреча сетки учитывается ровно один раз; технические игры исключены.
  for (const section of Object.values(S2.brackets)) for (const side of Object.values(section)) for (const round of side) for (const m of round.m) {
    if (m.wo || m.a.v == null || m.b.v == null) continue;
    add("s2",m.a.n,m.a.v>m.b.v); add("s2",m.b.n,m.b.v>m.a.v);
  }
  const podium = {s1:{"EGOISTCINEMA":50,"ANONYMOUS TEAM":25},s2:{"хохоряшки":50,"ШТАНЫ БЕЛЫЕ":25,"ПУЗОТРЯС TEAM":15}};
  for (const [season, teams] of [["s1",S1.teams],["s2",S2.teams]]) for (const team of teams) {
    const r = results.get(season+"|"+team.name) || {played:0,wins:0,losses:0};
    const bonus = podium[season][team.name] || 0;
    for (const player of team.players) {
      const nick = player.nick.trim(); if (!nick) continue;
      const id = playerId(nick);
      if (!records.has(id)) records.set(id,{nick:playerName(nick),teams:new Set(),seasons:new Set(),played:0,wins:0,losses:0,bonus:0});
      const x=records.get(id); if ((season === "s1" && id === "imortal_boy") || (season === "s2" && id === "zong")) x.mvp = (x.mvp || []).concat(season === "s1" ? "2025 S1" : "2026 S2"); x.teams.add(team.name); x.seasons.add(season === "s1" ? "2025 S1" : "2026 S2");
      x.played+=r.played; x.wins+=r.wins; x.losses+=r.losses; x.bonus+=bonus;
    }
  }
  return [...records.values()].map(x=>({...x,points:x.wins*10+x.played*3+x.bonus})).sort((a,b)=>b.points-a.points||b.wins-a.wins||a.nick.localeCompare(b.nick));
}
function renderRanking() {
  const rows=playerRanking();
  $("rankingBody").innerHTML=rows.map((x,i)=>`<tr><td>${i+1}</td><td><a class="player-link" href="#/player/${encodeURIComponent(playerId(x.nick))}">${esc(playerId(x.nick)==="imortal_boy"?"imortal_boy":x.nick)}</a>${x.mvp?.length ? `<span class="ranking-mvp" title="MVP: ${esc(x.mvp.join(", "))}">★ MVP ${esc(x.mvp.join(", "))}</span>` : ""}</td><td>${esc([...x.teams].join(" / "))}</td><td>${esc([...x.seasons].join(", "))}</td><td>${x.played}</td><td class="rank-win">${x.wins}</td><td>${x.losses}</td><td class="rank-points">${x.points}</td></tr>`).join("");
  $("rankingCount").textContent=`${rows.length} игроков · 2 завершённых турнира`;
}

/* ---------- Профили игроков ---------- */
function playerHistory(id) {
  const seasons = [{id:"s1",year:2025,title:"WINTER CUP 2025 · SEASON 1",data:S1},{id:"s2",year:2026,title:"WINTER CUP 2026 · SEASON 2",data:S2}];
  const out=[];
  for (const season of seasons) for (const team of season.data.teams) {
    const player=team.players.find(p=>playerId(p.nick)===id);
    if (!player) continue;
    let place=null;
    if (season.id==="s1") place=team.name==="EGOISTCINEMA"?1:team.name==="ANONYMOUS TEAM"?2:null;
    else place=team.name==="хохоряшки"?1:team.name==="ШТАНЫ БЕЛЫЕ"?2:team.name==="ПУЗОТРЯС TEAM"?3:null;
    const matches=[];
    if (season.id==="s1") {
      const st=Object.values(S1.standings).flat().find(x=>x.n===team.name);
      if(st) matches.push({stage:"Групповой этап",opponent:"Результаты групповых игр",score:`${st.w} побед · ${st.l} поражений`,result:"summary"});
      for(const m of S1.matches) if(m.a===team.name||m.b===team.name) {
        const a=m.a===team.name; matches.push({stage:m.stage,opponent:a?m.b:m.a,score:a?`${m.sa}:${m.sb}`:`${m.sb}:${m.sa}`,result:(a?m.sa>m.sb:m.sb>m.sa)?"win":"loss"});
      }
    } else for(const [section,bracket] of Object.entries(S2.brackets)) for(const [side,rounds] of Object.entries(bracket)) for(const round of rounds) for(const m of round.m) {
      if(m.a.n!==team.name&&m.b.n!==team.name)continue;
      const a=m.a.n===team.name, own=a?m.a:m.b,other=a?m.b:m.a;
      matches.push({stage:`${section==="playoffs"?"Плей-офф":"Группа "+section.slice(-1)} · ${round.t}`,opponent:other.n,score:m.wo?"Тех. результат":own.v==null||other.v==null?"—":`${own.v}:${other.v}`,result:m.wo?"technical":m.w===(a?"a":"b")?"win":"loss"});
    }
    out.push({...season,team:team.name,place,player,matches,mvp:(season.id==="s1"&&id==="imortal_boy")||(season.id==="s2"&&id==="zong")});
  }
  return out;
}
function renderPlayer(id) {
  const history=playerHistory(id);
  const row=playerRanking().find(x=>playerId(x.nick)===id);
  const root=$("playerProfile");
  if(!history.length||!row){root.innerHTML='<div class="empty-state">Игрок не найден. <a href="#/ranking">Вернуться к рейтингу</a></div>';return;}
  const display=playerName(row.nick);
  const rank=playerRanking().findIndex(x=>playerId(x.nick)===id)+1;
  root.innerHTML=`<a class="back-link" href="#/ranking">← РЕЙТИНГ ИГРОКОВ</a>
    <div class="profile-hero"><div class="profile-avatar">${esc(display.slice(0,2).toUpperCase())}</div><div><div class="eyebrow">ПРОФИЛЬ ИГРОКА · #${rank} В РЕЙТИНГЕ</div><h1>${esc(display)}</h1><p>${esc([...row.teams].join(" · "))}</p></div></div>
    <div class="profile-stats">${[["Рейтинговые очки",row.points],["Матчи",row.played],["Победы",row.wins],["Поражения",row.losses],["Турниры",history.length]].map(([k,v])=>`<div><small>${k}</small><strong>${v}</strong></div>`).join("")}</div>
    <h2 class="profile-heading">ТРОФЕИ И НАГРАДЫ</h2><div class="profile-awards">${history.flatMap(h=>[...(h.place===1?[`🏆 Чемпион · ${h.year}`]:[]),...(h.place===2?[`🥈 2 место · ${h.year}`]:[]),...(h.place===3?[`🥉 3 место · ${h.year}`]:[]),...(h.mvp?[`★ MVP · ${h.year}`]:[])]).map(a=>`<span class="profile-award">${esc(a)}</span>`).join("")||'<p class="profile-muted">Наград пока нет</p>'}</div>
    <h2 class="profile-heading">УЧАСТИЕ В ТУРНИРАХ</h2>${history.map(h=>`<article class="profile-season"><div class="profile-season-head"><div><a href="#/tournament/winter-cup-${h.year}-s${h.year===2025?1:2}">${esc(h.title)}</a><p>${esc(h.team)}</p></div><span class="profile-place">${h.place?`${h.place} место`:"Место не подтверждено"}</span></div><h3>Матчи · ${h.matches.filter(m=>m.result!=="summary"&&m.result!=="technical").length} с известным результатом</h3><div class="profile-matches">${h.matches.map(m=>`<div class="profile-match"><span>${esc(m.stage)}</span><b>${esc(m.opponent)}</b><span>${esc(m.score)}</span><em class="${m.result}">${m.result==="win"?"Победа":m.result==="loss"?"Поражение":m.result==="summary"?"Итог группы":"Технический"}</em></div>`).join("")||'<p class="profile-muted">Матчи не опубликованы</p>'}</div></article>`).join("")}
    <p class="ranking-description">Статистика рассчитана по результатам команд. Для группового этапа 2025 известны итоги побед и поражений, но не соперники и счёт каждого матча. Места, отсутствующие в исходных результатах, не назначаются автоматически.</p>`;
}

/* ---------- Навигация (hash-роутер) ---------- */
const TABS = [["overview", "Обзор"], ["stream", "Трансляция"], ["teams", "Команды"], ["groups", "Группы"], ["playoffs", "Плей-офф"], ["matches", "Матчи"]];
const tabsFor = t => TABS.filter(([k]) => !(t.finished && k === "stream")); // у прошедших турниров нет трансляции

function route() {
  const parts = location.hash.replace(/^#\/?/, "").split("/").filter(Boolean);
  let view = "home", t = null, tab = "overview";
  if (parts[0] === "tournaments") view = "tournaments";
  else if (parts[0] === "ranking") view = "ranking";
  else if (parts[0] === "player") view = "player";
  else if (parts[0] === "tournament") {
    t = tournaments.find(x => x.id === parts[1]);
    if (t) { view = "tournament"; tab = tabsFor(t).some(x => x[0] === parts[2]) ? parts[2] : "overview"; }
  }
  current = t;
  document.querySelectorAll(".view").forEach(v => v.hidden = v.id !== "view-" + view);
  const navKey = view === "home" ? "home" : (view === "ranking" || view === "player") ? "ranking" : "tournaments";
  if (view === "ranking") renderRanking();
  if (view === "player") renderPlayer(decodeURIComponent(parts[1] || ""));
  document.querySelectorAll(".topbar nav a").forEach(a => a.classList.toggle("active", a.dataset.nav === navKey));

  if (view === "tournament") {
    $("tTitle").textContent = t.title;
    $("tChips").innerHTML = `<span class="chip">${esc(t.game)}</span><span class="chip">${esc(t.season)}</span><span class="chip ${t.finished ? "done" : "soon"}">${esc(t.status)}</span>`;
    $("subTabs").innerHTML = tabsFor(t).map(([k, label]) => `<a href="#/tournament/${t.id}/${k}" class="${k === tab ? "active" : ""}">${label}</a>`).join("");
    renderPanes();
    document.querySelectorAll(".t-pane").forEach(p => p.hidden = p.dataset.pane !== tab);
  }
  renderStreams(view, tab);
  document.title = (t ? t.title + " " + t.season + " — " : view === "ranking" ? "Рейтинг игроков — " : view === "player" ? "Профиль игрока — " : "") + "29 Championship Series";
  window.scrollTo(0, 0);
  requestAnimationFrame(drawLines);
}
window.addEventListener("hashchange", route);
window.addEventListener("resize", drawLines);
if (document.fonts && document.fonts.ready) document.fonts.ready.then(drawLines);

const nav = document.querySelector(".topbar nav");
$("mobileMenu").onclick = () => nav.classList.toggle("open");
nav.querySelectorAll("a").forEach(a => a.addEventListener("click", () => nav.classList.remove("open")));
$("toTop").addEventListener("click", e => { e.preventDefault(); window.scrollTo({ top: 0, behavior: "smooth" }); });

/* ---------- Админка ---------- */
const dialog = $("adminDialog");
$("adminOpen").onclick = () => { dialog.showModal(); showAdmin("teams"); };
document.querySelectorAll(".admin-tabs button").forEach(b => b.onclick = () => showAdmin(b.dataset.tab));

function showAdmin(tab, sel) {
  document.querySelectorAll(".admin-tabs button").forEach(b => b.classList.toggle("active", b.dataset.tab === tab));
  const root = $("adminPanel");

  if (tab === "teams") {
    root.innerHTML = `<div class="admin-form"><div class="field"><label>Группа</label><select id="teamGroup"><option>A</option><option>B</option></select></div><div class="field"><label>Название команды</label><input id="teamName" placeholder="Например, Team 1"></div><div class="field"><label>Короткий тег</label><input id="teamTag" maxlength="4" placeholder="TM1"></div></div><button class="primary-btn" id="addTeam">Добавить команду <b>+</b></button><div class="admin-list">${["A", "B"].map(g => `<h4>Группа ${g}</h4>${data.groups[g].map((t, i) => `<div class="admin-list-row"><input data-group="${g}" data-index="${i}" data-key="name" value="${esc(t.name)}"><input data-group="${g}" data-index="${i}" data-key="tag" value="${esc(t.tag)}" maxlength="4"><button class="secondary-btn" data-remove="${g}:${i}">Удалить</button></div>`).join("")}`).join("")}</div>`;
    $("addTeam").onclick = () => {
      const g = $("teamGroup").value, n = $("teamName").value.trim(), tag = $("teamTag").value.trim().toUpperCase();
      if (!n) return alert("Введите название команды");
      if (data.groups[g].length >= 4) return alert("В демо-формате в группе максимум 4 команды");
      data.groups[g].push({ name: n, tag: tag || n.slice(0, 3).toUpperCase(), p: 0, w: 0, l: 0, pts: 0, players: mkPlayers() });
      save(); showAdmin("teams");
    };
    root.querySelectorAll("[data-key]").forEach(inp => inp.onchange = () => { data.groups[inp.dataset.group][+inp.dataset.index][inp.dataset.key] = inp.value; save(); });
    root.querySelectorAll("[data-remove]").forEach(btn => btn.onclick = () => { const [g, i] = btn.dataset.remove.split(":"); if (confirm("Удалить команду?")) { data.groups[g].splice(+i, 1); save(); showAdmin("teams"); } });

  } else if (tab === "players") {
    const all = [];
    ["A", "B"].forEach(g => data.groups[g].forEach(t => all.push({ g, t })));
    if (!all.length) { root.innerHTML = '<p class="empty-state">Сначала добавьте команды.</p>'; return; }
    const cur = sel != null && sel < all.length ? sel : 0, c = all[cur];
    root.innerHTML = `<div class="admin-form"><div class="field wide"><label>Команда</label><select id="plTeam">${all.map((x, k) => `<option value="${k}" ${k === cur ? "selected" : ""}>Группа ${x.g} · ${esc(x.t.name)}</option>`).join("")}</select></div></div><div class="admin-list">${c.t.players.map((p, k) => `<div class="admin-list-row players-row"><span>${esc(p.role)}</span><input data-pl="${k}" value="${esc(p.nick)}" placeholder="Ник игрока"></div>`).join("")}</div>`;
    $("plTeam").onchange = e => showAdmin("players", +e.target.value);
    root.querySelectorAll("[data-pl]").forEach(inp => inp.onchange = () => { c.t.players[+inp.dataset.pl].nick = inp.value.trim() || `Player ${+inp.dataset.pl + 1}`; save(); });

  } else if (tab === "scores") {
    root.innerHTML = `<div class="admin-form"><div class="field"><label>Этап</label><input id="mStage" placeholder="Группа A"></div><div class="field"><label>Дата / время</label><input id="mDate" placeholder="22.01.2027 · 18:00"></div><div class="field"><label>Команда 1</label><input id="mA" placeholder="Team 1"></div><div class="field"><label>Команда 2</label><input id="mB" placeholder="Team 2"></div><div class="field"><label>Счёт команды 1</label><input id="mSA" placeholder="—"></div><div class="field"><label>Счёт команды 2</label><input id="mSB" placeholder="—"></div><div class="field"><label>Статус</label><select id="mStatus"><option>Ожидается</option><option>LIVE</option><option>Завершён</option></select></div></div><button class="primary-btn" id="addMatch">Добавить матч <b>+</b></button><div class="admin-list">${data.matches.map((m, i) => `<div class="admin-list-row"><span>${esc(m.a)} — ${esc(m.b)}</span><span>${esc(m.scoreA)}:${esc(m.scoreB)}</span><button class="secondary-btn" data-delmatch="${i}">Удалить</button></div>`).join("")}</div>`;
    $("addMatch").onclick = () => {
      const v = id => $(id).value.trim();
      if (!v("mA") || !v("mB")) return alert("Укажите обе команды");
      data.matches.push({ stage: v("mStage") || "Матч", date: v("mDate") || "Дата уточняется", a: v("mA"), b: v("mB"), scoreA: v("mSA") || "—", scoreB: v("mSB") || "—", status: v("mStatus") });
      save(); showAdmin("scores");
    };
    root.querySelectorAll("[data-delmatch]").forEach(btn => btn.onclick = () => { data.matches.splice(+btn.dataset.delmatch, 1); save(); showAdmin("scores"); });

  } else {
    root.innerHTML = `<div class="admin-form"><div class="field"><label>Название турнира</label><input value="Winter Cup 2027" disabled></div><div class="field"><label>Игра</label><input value="Dota 2" disabled></div><div class="field"><label>Формат</label><input value="Group Stage + Playoffs" disabled></div><div class="field"><label>Команд</label><input value="8 (2 группы по 4)" disabled></div></div><p class="empty-state">Это стартовая конфигурация. Даты и логотипы добавим на следующем этапе.</p>`;
  }
}
$("resetData").onclick = () => { if (confirm("Вернуть исходные демо-данные?")) { data = structuredClone(defaultData); save(); showAdmin("teams"); } };
$("saveClose").onclick = () => { save(); dialog.close(); };

$("heroPrize").textContent = PRIZE;
renderAll();
route();
loadShared();
