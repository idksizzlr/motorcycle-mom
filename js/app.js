// Por Onde Rodei — aplicativo
import { createClient } from "https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2.117.2/+esm";
import { SUPABASE_URL, SUPABASE_KEY } from "./config.js";

const sb = createClient(SUPABASE_URL, SUPABASE_KEY, {
  auth: { persistSession: true, autoRefreshToken: true, detectSessionInUrl: true },
});

/* =====================================================================
   Constantes
   ===================================================================== */
const UFN = {RO:"Rondônia",AC:"Acre",AM:"Amazonas",RR:"Roraima",PA:"Pará",AP:"Amapá",TO:"Tocantins",MA:"Maranhão",PI:"Piauí",CE:"Ceará",RN:"Rio Grande do Norte",PB:"Paraíba",PE:"Pernambuco",AL:"Alagoas",SE:"Sergipe",BA:"Bahia",MG:"Minas Gerais",ES:"Espírito Santo",RJ:"Rio de Janeiro",SP:"São Paulo",PR:"Paraná",SC:"Santa Catarina",RS:"Rio Grande do Sul",MS:"Mato Grosso do Sul",MT:"Mato Grosso",GO:"Goiás",DF:"Distrito Federal"};
const REG = {1:"Norte",2:"Nordeste",3:"Sudeste",4:"Sul",5:"Centro-Oeste"};
const CAPS = new Set(["1100205","1200401","1302603","1400100","1501402","1600303","1721000","2111300","2211001","2304400","2408102","2507507","2611606","2704302","2800308","2927408","3106200","3205309","3304557","3550308","4106902","4205407","4314902","5002704","5103403","5208707","5300108"]);
const GENERO = {mulher:"Mulher",homem:"Homem",outro:"Outro",nao_informado:"Não informado"};
const PAPEL = {piloto:"Piloto",garupa:"Garupa",os_dois:"Piloto e garupa"};
const papelDe = (r) => r?.papel === "garupa" ? "Garupa" : r?.papel === "os_dois" ? g3(r, "Pilota e garupa", "Piloto e garupa", "Piloto(a) e garupa") : g3(r, "Pilota", "Piloto", "Piloto(a)");
const ESTILO = {estrada:"Asfalto e estrada",serra:"Serra e curvas",praia:"Litoral",terra:"Terra e trilha",de_tudo:"De tudo um pouco"};
const AV_COLORS = ["#E4572E","#0B6B4C","#2F6FDE","#8B4FD6","#D9A21B","#C8352B","#1E8C93","#B8753F","#5A6BD8","#D0487F"];
const LEVELS = [
  {min:0,    f:"Novata",           m:"Novato",           x:"Iniciante"},
  {min:10,   f:"Viajante",         m:"Viajante",         x:"Viajante"},
  {min:50,   f:"Estradeira",       m:"Estradeiro",       x:"Pé na estrada"},
  {min:150,  f:"Desbravadora",     m:"Desbravador",      x:"Desbravando o Brasil"},
  {min:400,  f:"Bandeirante",      m:"Bandeirante",      x:"Bandeirante"},
  {min:1000, f:"Lenda do Asfalto", m:"Lenda do Asfalto", x:"Lenda do Asfalto"},
];
const ICONS = {
  pin:'<path d="M12 21s-7-6.3-7-12a7 7 0 0 1 14 0c0 5.7-7 12-7 12z"/><circle cx="12" cy="9" r="2.5"/>',
  flag:'<path d="M5 21V4M5 4h11l-2 4 2 4H5"/>',
  star:'<path d="M12 3l2.7 5.6 6.1.9-4.4 4.3 1 6.1L12 17l-5.4 2.9 1-6.1L3.2 9.5l6.1-.9z"/>',
  crown:'<path d="M3 8l4 4 5-7 5 7 4-4-2 11H5z"/>',
  map:'<path d="M9 4 3 6v14l6-2 6 2 6-2V4l-6 2-6-2zM9 4v14M15 6v14"/>',
  compass:'<circle cx="12" cy="12" r="9"/><path d="m15.5 8.5-2 5-5 2 2-5z"/>',
  home:'<path d="M4 11l8-7 8 7v9H4z"/><path d="M10 20v-5h4v5"/>',
  road:'<path d="M8 3 5 21M16 3l3 18M12 4v3M12 11v3M12 18v2"/>',
  book:'<path d="M5 4h11a3 3 0 0 1 3 3v13H8a3 3 0 0 1-3-3z"/><path d="M5 17a3 3 0 0 1 3-3h11"/>',
  cal:'<rect x="4" y="5" width="16" height="16" rx="2"/><path d="M4 10h16M9 3v4M15 3v4"/>',
  lock:'<rect x="5" y="11" width="14" height="10" rx="2"/><path d="M8 11V7a4 4 0 0 1 8 0v4"/>',
  leaf:'<path d="M5 19c0-8 5-14 15-15-1 10-7 15-15 15z"/><path d="M5 19l9-9"/>',
  sun:'<circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/>',
  mountain:'<path d="M3 20 9.5 8l4 7 2.5-4L21 20z"/>',
  globe:'<circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3c3 3.5 3 14.5 0 18M12 3c-3 3.5-3 14.5 0 18"/>',
  bolt:'<path d="M13 2 4 14h7l-1 8 9-12h-7z"/>',
  wave:'<path d="M2 10c2-2 4-2 6 0s4 2 6 0 4-2 6 0M2 16c2-2 4-2 6 0s4 2 6 0 4-2 6 0"/>',
};
const ico = (k, s = 22) => `<svg width="${s}" height="${s}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.1" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${ICONS[k]}</svg>`;

/* Rotas famosas: cidades pelo nome oficial do IBGE (nome|UF) */
const ROUTES = {
  oiachui:     [["Oiapoque","AP"],["Chuí","RS"]],
  rastro:      [["Lauro Müller","SC"],["Bom Jardim da Serra","SC"]],
  serraGaucha: [["Gramado","RS"],["Canela","RS"],["Bento Gonçalves","RS"]],
  estradaReal: [["Paraty","RJ"],["Ouro Preto","MG"],["Diamantina","MG"]],
  chapadas:    [["Lençóis","BA"],["Alto Paraíso de Goiás","GO"],["Chapada dos Guimarães","MT"]],
  emocoes:     [["Jijoca de Jericoacoara","CE"],["Parnaíba","PI"],["Barreirinhas","MA"]],
  transam:     [["Marabá","PA"],["Altamira","PA"],["Itaituba","PA"]],
  foz:         [["Foz do Iguaçu","PR"]],
  seixas:      [["João Pessoa","PB"]],
};
const UNITS = { longe:" km", span:" km", area:" km²", maxArea:" km²", fullPct:"%", vizPct:"%", anoDias:" dias" };

/* r:1 = lendária */
const BADGES = [
  {g:"Cidades", k:"m1",    t:"Primeira parada",       d:"Marque a primeira cidade",       m:"n", goal:1,    i:"pin"},
  {g:"Cidades", k:"m10",   t:"Pé na estrada",         d:"10 cidades",                      m:"n", goal:10,   i:"pin"},
  {g:"Cidades", k:"m50",   t:"Rodagem",               d:"50 cidades",                      m:"n", goal:50,   i:"road"},
  {g:"Cidades", k:"m100",  t:"Centenário",            d:"100 cidades",                     m:"n", goal:100,  i:"road"},
  {g:"Cidades", k:"m250",  t:"Motoviagem de verdade", d:"250 cidades",                     m:"n", goal:250,  i:"star"},
  {g:"Cidades", k:"m500",  t:"Asfalto na veia",       d:"500 cidades",                     m:"n", goal:500,  i:"star"},
  {g:"Cidades", k:"m1000", t:"Mil cidades",           d:"1.000 municípios",                m:"n", goal:1000, i:"crown"},
  {g:"Cidades", k:"m2000", t:"Duas mil cidades",      d:"2.000 municípios",                m:"n", goal:2000, i:"crown", r:1},
  {g:"Cidades", k:"m5570", t:"O Brasil inteiro, cidade por cidade", d:"Todos os 5.570 municípios", m:"n", goal:5570, i:"crown", r:1},

  {g:"Estados", k:"u3",     t:"Divisa cruzada",  d:"Passe por 3 estados",              m:"ufs",     goal:3,   i:"flag"},
  {g:"Estados", k:"u10",    t:"Dez bandeiras",   d:"10 estados",                       m:"ufs",     goal:10,  i:"flag"},
  {g:"Estados", k:"u27",    t:"Brasil inteiro",  d:"Todos os 27 estados",              m:"ufs",     goal:27,  i:"crown", r:1},
  {g:"Estados", k:"full50", t:"Meio estado",     d:"Metade das cidades de um estado",  m:"fullPct", goal:50,  i:"map"},
  {g:"Estados", k:"full",   t:"Estado fechado",  d:"Todas as cidades de um estado",    m:"fullPct", goal:100, i:"map"},

  {g:"Regiões", k:"r5",    t:"Cinco regiões",            d:"Norte, Nordeste, Centro-Oeste, Sudeste e Sul", m:"regs",  goal:5,  i:"compass"},
  {g:"Regiões", k:"ns",    t:"Do Norte ao Sul",          d:"Uma cidade no Norte e outra no Sul",           m:"ns",    goal:2,  i:"compass"},
  {g:"Regiões", k:"rN",    t:"Amazônia",                 d:"10 cidades na região Norte",                   m:"regN",  goal:10, i:"leaf"},
  {g:"Regiões", k:"rNE",   t:"Coração nordestino",       d:"20 cidades no Nordeste",                       m:"regNE", goal:20, i:"sun"},
  {g:"Regiões", k:"rCO",   t:"Cerrado adentro",          d:"10 cidades no Centro-Oeste",                   m:"regCO", goal:10, i:"sun"},
  {g:"Regiões", k:"ufS",   t:"Sul inteiro",              d:"Paraná, Santa Catarina e Rio Grande do Sul",   m:"ufS",   goal:3,  i:"flag"},
  {g:"Regiões", k:"ufSE",  t:"Sudeste completo",         d:"São Paulo, Rio, Minas e Espírito Santo",       m:"ufSE",  goal:4,  i:"flag"},
  {g:"Regiões", k:"ufCO",  t:"Centro-Oeste completo",    d:"Mato Grosso, Mato Grosso do Sul, Goiás e DF",  m:"ufCO",  goal:4,  i:"flag"},
  {g:"Regiões", k:"ufNE",  t:"Nordeste de ponta a ponta", d:"Os 9 estados do Nordeste",                   m:"ufNE",  goal:9,  i:"sun"},
  {g:"Regiões", k:"ufN",   t:"Norte completo",           d:"Os 7 estados do Norte",                        m:"ufN",   goal:7,  i:"leaf"},

  {g:"Capitais", k:"c1",  t:"Na capital",           d:"Visite uma capital",        m:"caps", goal:1,  i:"star"},
  {g:"Capitais", k:"c5",  t:"Giro pelas capitais",  d:"5 capitais",                m:"caps", goal:5,  i:"star"},
  {g:"Capitais", k:"c10", t:"Roteiro das capitais", d:"10 capitais",               m:"caps", goal:10, i:"star"},
  {g:"Capitais", k:"c27", t:"Todas as capitais",    d:"As 27 capitais do Brasil",  m:"caps", goal:27, i:"crown", r:1},

  {g:"Rotas famosas", k:"oiachui",     t:"Do Oiapoque ao Chuí",       d:"Oiapoque (AP) e Chuí (RS), as duas pontas do Brasil",               m:"rota_oiachui",     goal:2, i:"crown", r:1},
  {g:"Rotas famosas", k:"rastro",      t:"Serra do Rio do Rastro",    d:"Lauro Müller e Bom Jardim da Serra (SC)",                           m:"rota_rastro",      goal:2, i:"mountain"},
  {g:"Rotas famosas", k:"serraGaucha", t:"Serra Gaúcha",              d:"Gramado, Canela e Bento Gonçalves (RS)",                            m:"rota_serraGaucha", goal:3, i:"mountain"},
  {g:"Rotas famosas", k:"estradaReal", t:"Estrada Real",              d:"Paraty (RJ), Ouro Preto e Diamantina (MG)",                         m:"rota_estradaReal", goal:3, i:"road"},
  {g:"Rotas famosas", k:"chapadas",    t:"Três chapadas",             d:"Lençóis (BA), Alto Paraíso de Goiás (GO) e Chapada dos Guimarães (MT)", m:"rota_chapadas", goal:3, i:"mountain"},
  {g:"Rotas famosas", k:"emocoes",     t:"Rota das Emoções",          d:"Jericoacoara (CE), Parnaíba (PI) e Barreirinhas (MA)",              m:"rota_emocoes",     goal:3, i:"wave"},
  {g:"Rotas famosas", k:"transam",     t:"Transamazônica",            d:"Marabá, Altamira e Itaituba (PA)",                                  m:"rota_transam",     goal:3, i:"leaf"},
  {g:"Rotas famosas", k:"foz",         t:"Tríplice fronteira",        d:"Foz do Iguaçu (PR), onde Brasil, Argentina e Paraguai se encontram", m:"rota_foz",        goal:1, i:"globe"},
  {g:"Rotas famosas", k:"seixas",      t:"Onde o sol nasce primeiro", d:"João Pessoa (PB), a ponta mais a leste das Américas",               m:"rota_seixas",      goal:1, i:"sun"},

  {g:"Geografia", k:"equador", t:"Acima do Equador",        d:"Uma cidade no Hemisfério Norte",                           m:"norteEq", goal:1,       i:"globe"},
  {g:"Geografia", k:"tropico", t:"Cruzou o Trópico",        d:"Cidades dos dois lados do Trópico de Capricórnio",         m:"tropico", goal:2,       i:"globe"},
  {g:"Geografia", k:"span",    t:"De ponta a ponta",        d:"3.000 km entre a cidade mais ao norte e a mais ao sul",    m:"span",    goal:3000,    i:"compass"},
  {g:"Geografia", k:"gigante", t:"Terra a perder de vista", d:"Um município com mais de 50.000 km²",                      m:"maxArea", goal:50000,   i:"map"},
  {g:"Geografia", k:"bolso",   t:"Cidade de bolso",         d:"Um município com menos de 20 km²",                         m:"tiny",    goal:1,       i:"pin"},
  {g:"Geografia", k:"a100k",   t:"100 mil km²",             d:"Some 100.000 km² de municípios visitados",                 m:"area",    goal:100000,  i:"map"},
  {g:"Geografia", k:"a1M",     t:"Um milhão de km²",        d:"1.000.000 km² de Brasil percorridos",                      m:"area",    goal:1000000, i:"crown", r:1},

  {g:"Estrada", k:"natal", t:"Ponto de partida",      d:"Marque a sua cidade de partida",               m:"natal",  goal:1,    i:"home"},
  {g:"Estrada", k:"viz",   t:"Conhece a vizinhança",  d:"Todas as cidades que fazem divisa com a sua",  m:"vizPct", goal:100,  i:"home"},
  {g:"Estrada", k:"l500",  t:"Longe de casa",         d:"Uma cidade a 500 km da sua",                   m:"longe",  goal:500,  i:"road"},
  {g:"Estrada", k:"l2000", t:"Do outro lado do mapa", d:"Uma cidade a 2.000 km da sua",                 m:"longe",  goal:2000, i:"compass"},
  {g:"Estrada", k:"l3000", t:"Atravessou o Brasil",   d:"Uma cidade a 3.000 km da sua",                 m:"longe",  goal:3000, i:"crown"},

  {g:"Diário", k:"mem10",   t:"Contadora de histórias", tm:"Contador de histórias", d:"Escreva 10 lembranças", m:"notas", goal:10, i:"book"},
  {g:"Diário", k:"mem50",   t:"Livro de estrada",       d:"Escreva 50 lembranças",                        m:"notas",    goal:50,  i:"book"},
  {g:"Diário", k:"mes6",    t:"O ano todo na estrada",  d:"Viagens em 6 meses diferentes",                m:"meses",    goal:6,   i:"cal"},
  {g:"Diário", k:"estacoes",t:"Quatro estações",        d:"Viagens no verão, no outono, no inverno e na primavera", m:"estacoes", goal:4, i:"sun"},
  {g:"Diário", k:"domingo", t:"Rolê de domingo",        d:"5 cidades marcadas em domingos",               m:"domingos", goal:5,   i:"cal"},
  {g:"Diário", k:"dia10",   t:"Dia de estrada",         d:"10 cidades no mesmo dia",                      m:"sameDay",  goal:10,  i:"bolt"},
  {g:"Diário", k:"dia25",   t:"Pé na tábua",            d:"25 cidades no mesmo dia",                      m:"sameDay",  goal:25,  i:"bolt"},
  {g:"Diário", k:"ano",     t:"Um ano de estrada",      d:"Um ano entre a primeira e a última viagem",    m:"anoDias",  goal:365, i:"cal"},

  {g:"Viagens", k:"v1",   t:"Roteirista",              d:"Planeje a sua primeira viagem",   m:"viagens",   goal:1, i:"map"},
  {g:"Viagens", k:"vok1", t:"Missão cumprida",         d:"Conclua uma viagem planejada",    m:"viagensOk", goal:1, i:"flag"},
  {g:"Viagens", k:"vok5", t:"Estradeira de carteirinha", tm:"Estradeiro de carteirinha", d:"Conclua 5 viagens planejadas", m:"viagensOk", goal:5, i:"crown"},
];

/* =====================================================================
   Utilidades
   ===================================================================== */
const $ = (id) => document.getElementById(id);
const store = {
  get(k){ try { return localStorage.getItem(k); } catch { return null; } },
  set(k,v){ try { localStorage.setItem(k,v); } catch {} },
  del(k){ try { localStorage.removeItem(k); } catch {} },
};
const norm = (s) => s.normalize("NFD").replace(/[̀-ͯ]/g,"").toLowerCase().replace(/[^a-z0-9 ]/g," ").replace(/\s+/g," ").trim();
const today = () => { const d = new Date(); return d.getFullYear()+"-"+String(d.getMonth()+1).padStart(2,"0")+"-"+String(d.getDate()).padStart(2,"0"); };
const fmtDate = (s) => { if(!s) return ""; const [y,m,d] = s.split("-"); return `${d}/${m}/${y}`; };
const fmtN = (n) => n.toLocaleString("pt-BR");
const esc = (s) => String(s ?? "").replace(/[&<>"']/g, c => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
const reduced = () => matchMedia("(prefers-reduced-motion: reduce)").matches;
const avColor = (id) => { let h = 0; for (const c of String(id)) h = (h*31 + c.charCodeAt(0)) >>> 0; return AV_COLORS[h % AV_COLORS.length]; };
const initial = (n) => (n || "?").trim().charAt(0).toUpperCase();
const avatar = (id, nome, cls = "") => `<span class="avatar ${cls}" style="background:${avColor(id)}">${esc(initial(nome))}</span>`;
const g3 = (p, f, m, x) => p?.genero === "mulher" ? f : p?.genero === "homem" ? m : x;
const ago = (iso) => {
  if (!iso) return "nunca";
  const s = (Date.now() - new Date(iso).getTime())/1000;
  if (s < 3600) return "agora há pouco";
  if (s < 86400) return `há ${Math.floor(s/3600)} h`;
  if (s < 86400*30) return `há ${Math.floor(s/86400)} dias`;
  return new Date(iso).toLocaleDateString("pt-BR");
};

let tt;
function toast(html, ms = 2600){
  const t = $("toast"); t.innerHTML = html; t.hidden = false;
  t.style.animation = "none"; void t.offsetWidth; t.style.animation = "";
  clearTimeout(tt); tt = setTimeout(() => t.hidden = true, ms);
}

function modal({ title, body = "", actions = [], onOpen }){
  const root = $("modalRoot");
  const bg = document.createElement("div");
  bg.className = "modal-bg";
  bg.innerHTML = `<div class="modal" role="dialog" aria-modal="true" aria-label="${esc(title)}"><h3>${esc(title)}</h3><div class="mbody" style="display:grid;gap:12px">${body}</div><div class="err" data-err role="alert"></div><div class="actions"></div></div>`;
  const acts = bg.querySelector(".actions");
  const close = () => { bg.remove(); document.removeEventListener("keydown", onKey); };
  const onKey = (e) => { if (e.key === "Escape") close(); };
  const api = { close, el: bg, err: (m) => bg.querySelector("[data-err]").textContent = m || "" };
  for (const a of actions){
    const b = document.createElement("button");
    b.className = "btn sm " + (a.cls || ""); b.type = "button"; b.textContent = a.label;
    b.onclick = async () => {
      if (!a.onClick) return close();
      b.disabled = true; api.err("");
      try { const keep = await a.onClick(api); if (keep !== true) close(); }
      catch (e) { api.err(e?.message || String(e)); }
      finally { b.disabled = false; }
    };
    acts.appendChild(b);
  }
  bg.addEventListener("click", (e) => { if (e.target === bg) close(); });
  document.addEventListener("keydown", onKey);
  root.appendChild(bg);
  onOpen?.(api);
  bg.querySelector("input,select,textarea,button")?.focus();
  return api;
}

function download(filename, text, type = "application/json"){
  const blob = new Blob([text], { type });
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob); a.download = filename;
  document.body.appendChild(a); a.click(); a.remove();
  setTimeout(() => URL.revokeObjectURL(a.href), 3000);
}

function authMsg(e){
  const m = (e?.message || "").toLowerCase();
  if (m.includes("invalid login")) return "E-mail ou senha incorretos.";
  if (m.includes("email not confirmed")) return "Confirme seu e-mail pelo link que enviamos (olhe também o spam).";
  if (m.includes("already registered") || m.includes("already been registered")) return "Esse e-mail já tem conta. Use a aba Entrar.";
  if (m.includes("password") && (m.includes("6") || m.includes("short") || m.includes("weak"))) return "A senha precisa ter pelo menos 6 caracteres.";
  if (m.includes("rate limit") || m.includes("too many")) return "Muitas tentativas seguidas. Espere alguns minutos e tente de novo.";
  if (m.includes("invalid") && m.includes("email")) return "Esse e-mail não parece válido.";
  if (m.includes("failed to fetch") || m.includes("network") || m.includes("load failed"))
    return navigator.onLine === false
      ? "Sem conexão com a internet. Tente de novo."
      : "O servidor do site está fora do ar agora. Tente de novo mais tarde e, se continuar, avise o administrador.";
  return e?.message || "Algo deu errado. Tente de novo.";
}

/* =====================================================================
   Dados do mapa (carregados uma vez)
   ===================================================================== */
let feats = [], byId = new Map(), ufTotal = {}, totalArea = 0, searchIdx = [], topo, topoObj;
const geoReady = (async () => {
  const r = await fetch("data/municipios.json");
  if (!r.ok) throw new Error("Não consegui carregar o mapa");
  topo = await r.json();
  topoObj = topo.objects[Object.keys(topo.objects)[0]];
  feats = topojson.feature(topo, topoObj).features;
  const R = 6371;
  for (const f of feats){
    fixWinding(f);
    const p = f.properties; f.id = p.id;
    f.area = d3.geoArea(f) * R * R; totalArea += f.area;
    f.c = d3.geoCentroid(f);
    byId.set(p.id, f); ufTotal[p.uf] = (ufTotal[p.uf] || 0) + 1;
    searchIdx.push({ f, k: norm(p.n) });
  }
})();
function fixWinding(f){
  const g = f.geometry; if (!g) return;
  const polys = g.type === "Polygon" ? [g.coordinates] : g.type === "MultiPolygon" ? g.coordinates : [];
  for (const p of polys) if (d3.geoArea({ type:"Polygon", coordinates:p }) > 2*Math.PI) p.forEach(r => r.reverse());
}
function searchCities(q, limit = 9){
  q = norm(q); if (q.length < 2) return [];
  const a = [], b = [];
  for (const x of searchIdx){ if (x.k.startsWith(q)) a.push(x.f); else if (x.k.includes(q)) b.push(x.f); }
  return a.sort((x,y) => x.properties.n.length - y.properties.n.length).concat(b).slice(0, limit);
}
const cityLabel = (id) => { const f = byId.get(id); return f ? `${f.properties.n} · ${f.properties.uf}` : ""; };

/* Campo de busca de cidade reaproveitável (cadastro e perfil) */
function cityPicker(input, list, onPick){
  let hits = [], hi = 0;
  const render = () => {
    list.innerHTML = hits.map((f,i) => `<li data-i="${i}" aria-selected="${i===hi}">${esc(f.properties.n)}<span>${f.properties.uf}</span></li>`).join("");
    list.hidden = !hits.length;
    list.querySelectorAll("li").forEach(li => li.onpointerdown = (e) => { e.preventDefault(); pick(+li.dataset.i); });
  };
  const pick = (i) => { const f = hits[i]; if (!f) return; input.value = cityLabel(f.id); input.dataset.id = f.id; list.hidden = true; onPick?.(f.id); };
  input.addEventListener("input", async () => { input.dataset.id = ""; await geoReady.catch(()=>{}); hits = searchCities(input.value, 7); hi = 0; render(); });
  input.addEventListener("keydown", (e) => {
    if (list.hidden) return;
    if (e.key === "ArrowDown" || e.key === "ArrowUp"){ e.preventDefault(); hi = (hi + (e.key === "ArrowDown" ? 1 : -1) + hits.length) % hits.length; render(); }
    else if (e.key === "Enter"){ e.preventDefault(); pick(hi); }
    else if (e.key === "Escape") list.hidden = true;
  });
  input.addEventListener("blur", () => setTimeout(() => list.hidden = true, 150));
  return { set(id){ input.dataset.id = id || ""; geoReady.then(() => input.value = id ? cityLabel(id) : ""); } };
}

/* =====================================================================
   Estado da sessão
   ===================================================================== */
let me = null;          // { id, email }
let profile = null;     // linha de public.profiles
let V = {};             // municipio_id -> { d, n }
let other = null;       // { id, nome, set:Set } quando comparando mapas
let entered = false;
let view = "mapa";

/* ---------- fila de gravação (funciona com internet ruim) ---------- */
let Q = {}, syncing = false, retryT = null;
const qKey = () => `por:${me.id}:fila`;
const vKey = () => `por:${me.id}:visitas`;
function saveLocal(){ store.set(vKey(), JSON.stringify(V)); store.set(qKey(), JSON.stringify(Q)); }
function setSync(s){
  const el = $("sync"); el.dataset.s = s;
  el.querySelector("span").textContent = s === "ok" ? "Tudo salvo" : s === "saving" ? "Salvando…" : "Sem internet — salvo no aparelho";
}
function enqueue(id){
  Q[id] = V[id] ? { op:"up", d:V[id].d || null, n:V[id].n || null } : { op:"del" };
  saveLocal(); flush();
}
async function flush(){
  if (syncing || !me) return;
  const ids = Object.keys(Q);
  if (!ids.length){ setSync("ok"); return; }
  syncing = true; setSync("saving");
  let failed = false;
  // envia em lotes (concluir uma viagem pode marcar centenas de cidades de uma vez)
  const snap = ids.map(id => [id, Q[id]]).filter(([, it]) => it);
  const ups = snap.filter(([, it]) => it.op === "up"), dels = snap.filter(([, it]) => it.op !== "up");
  const done = (pairs) => { for (const [id, it] of pairs) if (JSON.stringify(Q[id]) === JSON.stringify(it)) delete Q[id]; };
  const row = ([id, it]) => ({ user_id: me.id, municipio_id: id, data: it.d, nota: it.n });
  for (let i = 0; i < ups.length && !failed; i += 200){
    const part = ups.slice(i, i + 200);
    const { error } = await sb.from("visitas").upsert(part.map(row));
    if (error && !error.code){ failed = true; break; }            // rede: tenta depois
    if (!error){ done(part); continue; }
    for (const pair of part){                                       // lote recusado: um a um, descartando só o inválido
      const { error: e1 } = await sb.from("visitas").upsert(row(pair));
      if (e1 && !e1.code){ failed = true; break; }
      if (e1) console.warn("Descartado", pair[0], e1);
      done([pair]);
    }
  }
  for (let i = 0; i < dels.length && !failed; i += 200){
    const part = dels.slice(i, i + 200);
    const { error } = await sb.from("visitas").delete().eq("user_id", me.id).in("municipio_id", part.map(([id]) => id));
    if (error && !error.code){ failed = true; break; }
    if (error) console.warn("Descartado", error);
    done(part);
  }
  saveLocal(); syncing = false;
  if (failed){ setSync("off"); clearTimeout(retryT); retryT = setTimeout(flush, 15000); }
  else if (Object.keys(Q).length) flush();
  else setSync("ok");
}
addEventListener("online", () => flush());

/* =====================================================================
   Entrada / cadastro
   ===================================================================== */
/* Em out/2026 o banco mudou de servidor (o projeto antigo do Supabase travou).
   As contas precisam ser criadas de novo, mas as cidades guardadas no navegador podem ser trazidas. */
const OLD_REF = "oattcftnzhragczslhoq";
function oldDeviceCopies(exceptId){
  const out = [];
  try {
    for (let i = 0; i < localStorage.length; i++){
      const k = localStorage.key(i), m = /^por:(.+):visitas$/.exec(k || "");
      if (!m || m[1] === exceptId) continue;
      const v = JSON.parse(localStorage.getItem(k) || "{}"), n = Object.keys(v).length;
      if (n) out.push({ key: k, v, n });
    }
  } catch {}
  return out.sort((a, b) => b.n - a.n);
}
function showAuth(){
  $("boot").hidden = true; $("app").hidden = true; $("auth").hidden = false;
  if (location.hash) history.replaceState(null, "", location.pathname + location.search);
  document.title = "Por Onde Rodei";
  const mudou = store.get("por:mudanca:ok") == null && (store.get(`sb-${OLD_REF}-auth-token`) != null || oldDeviceCopies().length > 0);
  $("moveNote").hidden = !mudou;
  if (mudou){ $("tabLogin").setAttribute("aria-selected", false); $("tabSignup").setAttribute("aria-selected", true); $("loginForm").hidden = true; $("signupForm").hidden = false; }
  startHero();
}

$("tabLogin").onclick = () => authTab("login");
$("tabSignup").onclick = () => authTab("signup");
function authTab(t){
  $("tabLogin").setAttribute("aria-selected", t === "login");
  $("tabSignup").setAttribute("aria-selected", t === "signup");
  $("loginForm").hidden = t !== "login";
  $("signupForm").hidden = t !== "signup";
  (t === "login" ? $("liEmail") : $("suNome")).focus();
}

$("loginForm").addEventListener("submit", async (e) => {
  e.preventDefault();
  const email = $("liEmail").value.trim(), password = $("liPass").value;
  $("liErr").textContent = "";
  if (!email || !password){ $("liErr").textContent = "Preencha e-mail e senha."; return; }
  $("liBtn").disabled = true; $("liBtn").textContent = "Entrando…";
  const { data, error } = await sb.auth.signInWithPassword({ email, password });
  $("liBtn").disabled = false; $("liBtn").textContent = "Entrar";
  if (error){ $("liErr").textContent = authMsg(error); return; }
  enterApp(data.user);
});

$("forgotBtn").onclick = () => {
  modal({
    title: "Recuperar a senha",
    body: `<p class="muted" style="margin:0">Enviamos um link para você criar uma senha nova. Se o e-mail não chegar em alguns minutos, peça para o administrador do site redefinir a sua senha.</p>
           <label class="field"><span>E-mail da conta</span><input class="input" id="fgEmail" type="email" autocomplete="email" value="${esc($("liEmail").value)}"></label>`,
    actions: [
      { label: "Cancelar", cls: "ghost" },
      { label: "Enviar link", onClick: async (m) => {
        const email = $("fgEmail").value.trim();
        if (!email) throw new Error("Digite o e-mail.");
        const { error } = await sb.auth.resetPasswordForEmail(email, { redirectTo: location.origin + location.pathname });
        if (error) throw new Error(authMsg(error));
        toast("Link enviado. Confira a caixa de entrada e o spam.", 4000);
      }},
    ],
  });
};

/* cadastro em 4 paradas */
const su = { step: 0, genero: "", papel: "", estilo: "de_tudo" };
const STOPS = [4, 35, 66, 96];
function fillYears(sel){
  const y = new Date().getFullYear();
  for (let i = y; i >= 1950; i--) sel.insertAdjacentHTML("beforeend", `<option value="${i}">${i}</option>`);
}
fillYears($("suDesde")); fillYears($("pfDesde"));
const suCity = cityPicker($("suCidade"), $("suCidadeRes"));
function pressGroup(container, key, obj, multi = false){
  container.querySelectorAll("[data-v]").forEach(b => b.addEventListener("click", () => {
    container.querySelectorAll("[data-v]").forEach(x => x.setAttribute("aria-pressed", x === b));
    obj[key] = b.dataset.v;
  }));
}
pressGroup($("chGenero"), "genero", su);
pressGroup($("chPapel"), "papel", su);
pressGroup($("chEstilo"), "estilo", su);
function suGo(step){
  su.step = step;
  document.querySelectorAll("#signupForm .step").forEach(s => s.hidden = +s.dataset.step !== step);
  document.querySelectorAll("#signupForm .stop").forEach((s,i) => s.classList.toggle("done", i < step));
  $("rider").style.left = STOPS[step] + "%";
  $("suBack").hidden = step === 0;
  $("suNext").textContent = step === 3 ? "Criar minha conta" : "Continuar";
  $("suErr").textContent = "";
}
$("suBack").onclick = () => suGo(su.step - 1);
$("signupForm").addEventListener("submit", async (e) => {
  e.preventDefault();
  const err = (m) => $("suErr").textContent = m;
  if (su.step === 0){
    const nome = $("suNome").value.trim(), email = $("suEmail").value.trim(), pass = $("suPass").value;
    if (nome.length < 2) return err("Diga como quer ser chamada(o).");
    if (!/^\S+@\S+\.\S+$/.test(email)) return err("Esse e-mail não parece válido.");
    if (pass.length < 6) return err("A senha precisa ter pelo menos 6 caracteres.");
    return suGo(1);
  }
  if (su.step === 1){ if (!su.genero) return err("Escolha uma das opções."); return suGo(2); }
  if (su.step === 2){ if (!su.papel) return err("Escolha como você anda de moto."); return suGo(3); }
  $("suNext").disabled = true; $("suNext").textContent = "Criando…";
  const { data, error } = await sb.auth.signUp({
    email: $("suEmail").value.trim(),
    password: $("suPass").value,
    options: {
      emailRedirectTo: location.origin + location.pathname,
      data: {
        nome: $("suNome").value.trim(), genero: su.genero, papel: su.papel, estilo: su.estilo,
        moto: $("suMoto").value.trim(), pilota_desde: $("suDesde").value,
        cidade_id: $("suCidade").dataset.id || "", aparece_ranking: $("suRanking").checked,
      },
    },
  });
  $("suNext").disabled = false; $("suNext").textContent = "Criar minha conta";
  if (error){ if (/já tem conta/.test(authMsg(error))) suGo(0); return err(authMsg(error)); }
  if (data.session){ enterApp(data.user, true); return; }
  modal({ title: "Falta só confirmar o e-mail",
    body: `<p style="margin:0">Enviamos um link para <b>${esc($("suEmail").value.trim())}</b>. Abra o e-mail, toque no link e pronto: você já entra no mapa.</p><p class="muted" style="margin:0">Não chegou? Olhe a pasta de spam.</p>`,
    actions: [{ label: "Entendi" }] });
  authTab("login"); $("liEmail").value = $("suEmail").value.trim();
});

/* mapa animado da tela de entrada: motoviagens que nunca param */
let heroGen = 0, NB = null;
const neighbors = () => NB || (NB = topojson.neighbors(topoObj.geometries));
async function startHero(){
  try { await geoReady; } catch { return; }
  const cv = $("heroMap"); if (!cv || $("auth").hidden) return;
  const box = cv.getBoundingClientRect(), dpr = Math.min(devicePixelRatio || 1, 2);
  const W = box.width, H = box.height; if (!W || !H) return;
  const gen = ++heroGen;
  cv.width = W * dpr; cv.height = H * dpr;
  const ctx = cv.getContext("2d");
  const fc = { type: "FeatureCollection", features: feats };
  // Brasil grande, ancorado à direita, logo abaixo da placa, descendo até a base:
  // o formato do país (largo em cima, fino embaixo) contorna o texto no canto inferior esquerdo.
  const hero = cv.parentElement, hb = hero.getBoundingClientRect();
  const plateBottom = hero.querySelector(".top").getBoundingClientRect().bottom - hb.top;
  const pad = Math.max(14, Math.min(W, H) * .03);
  const area = [[W * .05, plateBottom + pad * .6], [W - 6, H - pad * .4]];
  const proj = d3.geoMercator().fitExtent(area, fc);
  const bb = d3.geoPath(proj).bounds(fc), [tx, ty] = proj.translate();
  proj.translate([tx + (area[1][0] - bb[1][0]) + W * .06, ty + (area[0][1] - bb[0][1])]);   // um tiquinho além da borda direita
  const [[mx0], [mx1]] = d3.geoPath(proj).bounds(fc), mapW = mx1 - mx0;

  // fundo fixo (divisas), desenhado uma vez só
  const base = document.createElement("canvas"); base.width = cv.width; base.height = cv.height;
  const bctx = base.getContext("2d"); bctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  const bpath = d3.geoPath(proj, bctx);
  bctx.beginPath(); bpath(topojson.mesh(topo, topoObj, (a, b) => a !== b)); bctx.strokeStyle = "rgba(255,255,255,.16)"; bctx.lineWidth = .5; bctx.stroke();
  bctx.beginPath(); bpath(topojson.mesh(topo, topoObj, (a, b) => a === b || a.properties.uf !== b.properties.uf)); bctx.strokeStyle = "rgba(255,255,255,.55)"; bctx.lineWidth = 1.1; bctx.stroke();

  const svgPath = d3.geoPath(proj), shapes = new Map(), cents = new Map();
  const shape = (i) => { let s = shapes.get(i); if (!s){ s = new Path2D(svgPath(feats[i])); shapes.set(i, s); } return s; };
  const cent = (i) => { let c = cents.get(i); if (!c){ c = proj(feats[i].c); cents.set(i, c); } return c; };
  const nb = neighbors();
  const COLORS = ["242,177,52", "255,122,69", "255,227,163"];
  const lit = new Map();            // município -> { t, c }
  const pulses = [];                // anel de chegada ao destino
  const speed = mapW / 5200;        // px por ms: atravessar o país leva uns 5 s
  const rand = (a, b) => a + Math.random() * (b - a);

  function newRider(k, now){
    const i = Math.floor(Math.random() * feats.length);
    return { k, c: COLORS[k % COLORS.length], cur: i, next: -1, t0: now, dur: 1, heading: rand(-Math.PI, Math.PI),
      trail: [cent(i)], seen: new Set([i]), hops: 0, max: Math.floor(rand(28, 75)), wait: 0 };
  }
  // segue na direção em que vinha (como numa estrada), com um pouco de acaso
  function pickNext(r){
    const [x, y] = cent(r.cur);
    let best = -1, bestScore = -Infinity;
    for (const j of nb[r.cur]){
      if (r.seen.has(j)) continue;
      const [x2, y2] = cent(j), a = Math.atan2(y2 - y, x2 - x);
      const s = Math.cos(a - r.heading) + Math.random() * .7;
      if (s > bestScore){ bestScore = s; best = j; }
    }
    return best;
  }
  function hop(r, now){
    lit.set(r.cur, { t: now, c: r.c });
    const j = r.hops < r.max ? pickNext(r) : -1;
    if (j < 0){
      pulses.push({ p: cent(r.cur), t: now, c: r.c });
      r.wait = now + rand(500, 1400); r.next = -1; return;
    }
    const [x, y] = cent(r.cur), [x2, y2] = cent(j);
    const a = Math.atan2(y2 - y, x2 - x);
    r.heading += Math.atan2(Math.sin(a - r.heading), Math.cos(a - r.heading)) * .35 + rand(-.12, .12);
    r.next = j; r.t0 = now; r.dur = Math.min(380, Math.max(70, Math.hypot(x2 - x, y2 - y) / speed));
    r.seen.add(j); r.hops++;
  }

  const riders = [];
  const nRiders = W < 520 ? 2 : 3;
  const frame = (now) => {
    if (gen !== heroGen || $("auth").hidden) return;
    while (riders.length < nRiders){ const r = newRider(riders.length, now); riders.push(r); hop(r, now); }
    ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.clearRect(0, 0, cv.width, cv.height);
    ctx.drawImage(base, 0, 0);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    // cidades acesas: acendem rápido e apagam devagar, então o mapa nunca "enche"
    for (const [i, L] of lit){
      const age = now - L.t;
      const a = age < 250 ? .8 * (age / 250) : age < 3000 ? .8 - .45 * ((age - 250) / 2750) : .35 * (1 - (age - 3000) / 6000);
      if (a <= 0){ lit.delete(i); continue; }
      ctx.fillStyle = "rgba(" + L.c + "," + a.toFixed(3) + ")"; ctx.fill(shape(i));
    }
    // motos: rastro com faixa de estrada tracejada + farol
    for (const r of riders){
      if (r.next < 0){
        if (now >= r.wait){ Object.assign(r, newRider(r.k, now)); hop(r, now); }
        else continue;
      }
      let k = Math.min(1, (now - r.t0) / r.dur);
      while (k >= 1 && r.next >= 0){
        r.cur = r.next; r.trail.push(cent(r.cur)); if (r.trail.length > 22) r.trail.shift();
        hop(r, r.t0 + r.dur);
        if (r.next < 0) break;
        k = Math.min(1, (now - r.t0) / r.dur);
      }
      const from = cent(r.cur), to = r.next >= 0 ? cent(r.next) : from;
      const e = k < .5 ? 2 * k * k : 1 - Math.pow(-2 * k + 2, 2) / 2;
      const hx = from[0] + (to[0] - from[0]) * e, hy = from[1] + (to[1] - from[1]) * e;
      const pts = r.trail.concat([[hx, hy]]);
      if (pts.length > 1){
        ctx.lineCap = "round"; ctx.lineJoin = "round";
        ctx.beginPath(); pts.forEach(([x, y], n) => n ? ctx.lineTo(x, y) : ctx.moveTo(x, y));
        ctx.setLineDash([]); ctx.strokeStyle = "rgba(" + r.c + ",.28)"; ctx.lineWidth = 5; ctx.stroke();
        ctx.setLineDash([5, 6]); ctx.lineDashOffset = -now / 40; ctx.strokeStyle = "rgba(" + r.c + ",.95)"; ctx.lineWidth = 1.6; ctx.stroke();
        ctx.setLineDash([]);
      }
      if (r.next >= 0){
        const g = ctx.createRadialGradient(hx, hy, 0, hx, hy, 14);
        g.addColorStop(0, "rgba(" + r.c + ",.9)"); g.addColorStop(1, "rgba(" + r.c + ",0)");
        ctx.fillStyle = g; ctx.beginPath(); ctx.arc(hx, hy, 14, 0, Math.PI * 2); ctx.fill();
        ctx.fillStyle = "#fff"; ctx.beginPath(); ctx.arc(hx, hy, 2.8, 0, Math.PI * 2); ctx.fill();
      }
    }
    for (let n = pulses.length - 1; n >= 0; n--){
      const P = pulses[n], age = (now - P.t) / 1100;
      if (age >= 1){ pulses.splice(n, 1); continue; }
      ctx.strokeStyle = "rgba(" + P.c + "," + (1 - age).toFixed(3) + ")"; ctx.lineWidth = 2;
      ctx.beginPath(); ctx.arc(P.p[0], P.p[1], 4 + age * 30, 0, Math.PI * 2); ctx.stroke();
    }
    requestAnimationFrame(frame);
  };

  if (reduced()){
    // quem prefere menos movimento vê uma foto parada de três viagens
    const now = performance.now();
    for (let k = 0; k < nRiders; k++){
      const r = newRider(k, now); hop(r, now);
      for (let s = 0; s < 40 && r.next >= 0; s++){ r.cur = r.next; hop(r, now); }
    }
    ctx.drawImage(base, 0, 0); ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    for (const [i, L] of lit){ ctx.fillStyle = "rgba(" + L.c + ",.6)"; ctx.fill(shape(i)); }
    return;
  }
  requestAnimationFrame(frame);
}
let heroRT; addEventListener("resize", () => { if (!$("auth").hidden){ clearTimeout(heroRT); heroRT = setTimeout(startHero, 250); } });

/* =====================================================================
   Entrar no app
   ===================================================================== */
async function enterApp(user, fresh = false){
  if (entered && me?.id === user.id) return;
  entered = true;
  me = { id: user.id, email: user.email };
  heroGen++;
  // perfil
  let { data: p } = await sb.from("profiles").select("*").eq("id", me.id).maybeSingle();
  if (!p){ await new Promise(r => setTimeout(r, 800)); ({ data: p } = await sb.from("profiles").select("*").eq("id", me.id).maybeSingle()); }
  if (!p){
    // conta excluída (ou sessão inválida): volta para a tela de entrada
    const { error: ue } = await sb.auth.getUser();
    if (ue && !/fetch|network/i.test(ue.message || "")){ entered = false; me = null; await sb.auth.signOut(); showAuth(); return; }
  }
  profile = p || { id: me.id, nome: user.email.split("@")[0], genero: "nao_informado", papel: "os_dois", estilo: "de_tudo", aparece_ranking: true, is_admin: false };
  // visitas: primeiro o que está no aparelho, depois o banco
  try { V = JSON.parse(store.get(vKey()) || "{}"); } catch { V = {}; }
  try { Q = JSON.parse(store.get(qKey()) || "{}"); } catch { Q = {}; }
  const { data: rows, error } = await sb.from("visitas").select("municipio_id,data,nota").eq("user_id", me.id);
  if (!error){
    const nv = {};
    for (const r of rows) nv[r.municipio_id] = { d: r.data || "", n: r.nota || "" };
    for (const [id, it] of Object.entries(Q)){ if (it.op === "up") nv[id] = { d: it.d || "", n: it.n || "" }; else delete nv[id]; }
    V = nv; saveLocal();
  } else setSync("off");
  store.set("por:mudanca:ok", "1"); store.del(`sb-${OLD_REF}-auth-token`);
  $("boot").hidden = true; $("auth").hidden = true; $("app").hidden = false;
  applyRole();
  renderMe();
  const want = (location.hash || "").slice(1);
  showView(VIEWS[role()].includes(want) ? want : VIEWS[role()][0]);
  try { await geoReady; initMap(); paintAll(); }
  catch (e){
    console.error(e);
    const ml = $("mapLoading"); if (ml) ml.innerHTML = "<div>O mapa não carregou. Verifique a internet e recarregue a página.</div>";
  }
  if (isAdmin()) loadAdmin(); else loadTrips();
  flush();
  if (!isAdmin() && !Object.keys(V).length && !store.get(`por:${me.id}:recuperacao`)){
    const c = oldDeviceCopies(me.id)[0];
    if (c){ offerRecovery(c); return; }
  }
  if (fresh) toast(`Bem-${g3(profile,"vinda","vindo","vindo(a)")}, <b>${esc(profile.nome)}</b>! Toque numa cidade para começar.`, 4200);
}

/* Quem usa o app e quem administra veem sites diferentes */
const VIEWS = { user: ["mapa","diario","viagens","conquistas","ranking","perfil"], admin: ["painel","usuarios","mapa","ranking","conta"] };
const isAdmin = () => !!profile?.is_admin;
const role = () => isAdmin() ? "admin" : "user";
function applyRole(){
  document.body.dataset.role = role();
  $("nav").querySelectorAll("button").forEach(b => b.hidden = !b.dataset.for.split(" ").includes(role()));
  $("quick").hidden = isAdmin();
  $("sync").hidden = isAdmin();
  $("menuProfileTxt").textContent = isAdmin() ? "Minha conta" : "Meu perfil";
  $("shield").title = isAdmin() ? "Usuários cadastrados" : "Municípios visitados";
  $("shieldLbl").textContent = isAdmin() ? "PESSOAS" : "CIDADES";
}

function renderMe(){
  $("meAv").textContent = initial(profile.nome); $("meAv").style.background = avColor(me.id);
  $("meName").textContent = profile.nome; $("menuName").textContent = profile.nome; $("menuEmail").textContent = me.email;
  if (isAdmin()){ $("meLevel").textContent = "Administrador"; return; }
  const lv = levelOf(Object.keys(V).length);
  $("meLevel").textContent = `Nível ${lv.idx+1} · ${lv.title}`;
}

/* menu do avatar */
function toggleMenu(open){
  const m = $("meMenu"); open = open ?? m.hidden;
  m.hidden = !open; $("meBtn").setAttribute("aria-expanded", open);
}
$("meBtn").onclick = (e) => { e.stopPropagation(); toggleMenu(); };
document.addEventListener("click", (e) => { if (!$("meMenu").hidden && !e.target.closest(".me-wrap")) toggleMenu(false); });
document.addEventListener("keydown", (e) => { if (e.key === "Escape") toggleMenu(false); });
$("menuProfile").onclick = () => { toggleMenu(false); showView(isAdmin() ? "conta" : "perfil"); };

sb.auth.onAuthStateChange((event, session) => {
  if (event === "PASSWORD_RECOVERY"){ setTimeout(newPasswordModal, 300); }
  if (event === "SIGNED_OUT"){ entered = false; me = null; profile = null; V = {}; Q = {}; other = null; heat = null; admRows = []; trips = []; tripSel = null; planning = null; $("planBar").hidden = true; closeCard(); $("compare").hidden = true; toggleMenu(false); showAuth(); }
  if ((event === "SIGNED_IN" || event === "INITIAL_SESSION") && session?.user && !entered) enterApp(session.user);
  if (event === "INITIAL_SESSION" && !session) showAuth();
});
function newPasswordModal(){
  modal({ title: "Crie sua senha nova",
    body: `<label class="field"><span>Nova senha (mínimo 6 caracteres)</span><input class="input" id="npPass" type="password" autocomplete="new-password"></label>`,
    actions: [{ label: "Salvar senha", onClick: async () => {
      const password = $("npPass").value;
      if (password.length < 6) throw new Error("A senha precisa ter pelo menos 6 caracteres.");
      const { error } = await sb.auth.updateUser({ password }); if (error) throw new Error(authMsg(error));
      toast("Senha trocada. Boa estrada!");
    }}] });
}

/* =====================================================================
   Navegação entre abas
   ===================================================================== */
$("nav").querySelectorAll("button").forEach(b => b.onclick = () => showView(b.dataset.v));
function showView(v){
  if (!VIEWS[role()].includes(v)) v = VIEWS[role()][0];
  view = v;
  document.querySelectorAll("#app > main.view").forEach(m => m.hidden = m.id !== "v-" + v);
  $("nav").querySelectorAll("button").forEach(b => b.dataset.v === v && !b.hidden ? b.setAttribute("aria-current","page") : b.removeAttribute("aria-current"));
  history.replaceState(null, "", "#" + v);
  if (planning && v !== "mapa"){ planning = null; $("planBar").hidden = true; $("quick").hidden = isAdmin(); resetLegend(); paintAll(); drawTripOverlay(); }
  if (v === "mapa" && mapLayout) setTimeout(mapLayout, 0);
  if (v === "diario") renderDiary();
  if (v === "viagens") renderTrips();
  if (v === "conquistas") renderBadges();
  if (v === "ranking") loadRanking();
  if (v === "perfil") fillProfile();
  if (v === "painel") renderPainel();
  if (v === "usuarios") renderUsuarios();
  if (v === "conta") renderConta();
  if (v !== "mapa") hideTip();
  toggleMenu(false);
  window.scrollTo({ top: 0 });
}

/* =====================================================================
   Mapa
   ===================================================================== */
let proj, path, zoom, W = 0, H = 0, svg, gAll, gMun, selPath, homePath, pathEl = new Map(), mapReady = false, mapLayout = null;
let quick = false, selId = null;

function initMap(){
  if (mapReady) return; mapReady = true;
  svg = d3.select("#map");
  gAll = svg.append("g");
  const grat = gAll.append("path").attr("class","grat").datum(d3.geoGraticule().step([5,5])());
  gMun = gAll.append("g");
  gMun.selectAll("path").data(feats).join("path").attr("class","mun").each(function(d){ pathEl.set(d.id, this); });
  const munb = gAll.append("path").attr("class","munb").datum(topojson.mesh(topo, topoObj, (a,b) => a !== b && a.properties.uf === b.properties.uf));
  const ufs = gAll.append("path").attr("class","ufs").datum(topojson.mesh(topo, topoObj, (a,b) => a === b || a.properties.uf !== b.properties.uf));
  homePath = gAll.append("path").attr("class","homep");
  selPath = gAll.append("path").attr("class","selp");
  const rg = gAll.append("g").attr("class","trip-route");
  routeBase = rg.append("path").attr("class","rt-base"); routeDash = rg.append("path").attr("class","rt-dash");

  zoom = d3.zoom().scaleExtent([1,160]).clickDistance(8).tapDistance(12)
    .on("zoom", (e) => { gAll.attr("transform", e.transform); curT = e.transform; placeMarks(); hideTip(); });
  svg.call(zoom).on("dblclick.zoom", null);
  gMarks = svg.append("g").attr("class","trip-marks");

  const layout = () => {
    const r = $("wrap").getBoundingClientRect();
    if (r.width < 10 || r.height < 10) return;
    if (Math.abs(r.width - W) < 1 && Math.abs(r.height - H) < 1) return;
    W = r.width; H = r.height;
    svg.attr("viewBox", [0,0,W,H]);
    const pad = Math.min(W,H) * .05;
    proj = d3.geoMercator().fitExtent([[pad, pad + (W < 600 ? 56 : 30)], [W - pad, H - pad]], { type:"FeatureCollection", features:feats });
    path = d3.geoPath(proj);
    grat.attr("d", path); gMun.selectAll("path").attr("d", path); munb.attr("d", path); ufs.attr("d", path);
    selPath.attr("d", selId ? path(byId.get(selId)) : null);
    drawHome(); drawTripOverlay();
    zoom.extent([[0,0],[W,H]]).translateExtent([[-W*.5,-H*.5],[W*1.5,H*1.5]]);
    svg.call(zoom.transform, d3.zoomIdentity);
  };
  let rt; new ResizeObserver(() => { clearTimeout(rt); rt = setTimeout(layout, 120); }).observe($("wrap"));
  addEventListener("resize", () => { clearTimeout(rt); rt = setTimeout(layout, 120); });
  mapLayout = layout;   // também chamado ao abrir a aba Mapa (não depende só do ResizeObserver)
  layout();

  gMun.on("click", (e) => {
    const f = e.target.__data__; if (!f) return;
    if (planning){ planToggle(f.id); return; }
    if (isAdmin() || (other && !quick)){ select(f.id); return; }
    if (quick) toggle(f.id, e.clientX, e.clientY); else select(f.id);
  });
  gMun.on("pointermove", (e) => {
    if (e.pointerType !== "mouse") return;
    const f = e.target.__data__; if (!f) return;
    const [x,y] = d3.pointer(e, $("wrap")), t = $("tip");
    t.textContent = `${f.properties.n} · ${f.properties.uf}`; t.style.left = x + "px"; t.style.top = y + "px"; t.hidden = false;
  }).on("pointerleave", hideTip);

  $("zin").onclick = () => svg.transition().duration(300).call(zoom.scaleBy, 1.8);
  $("zout").onclick = () => svg.transition().duration(300).call(zoom.scaleBy, 1/1.8);
  $("zall").onclick = () => svg.transition().duration(700).call(zoom.transform, d3.zoomIdentity);
  $("quick").onclick = () => {
    quick = !quick; $("quick").setAttribute("aria-pressed", quick);
    toast(quick ? "Toque rápido ligado: cada toque marca ou desmarca" : "Toque rápido desligado");
    if (quick) closeCard();
  };
  $("compareEnd").onclick = endCompare;
  $("mapLoading").remove();
  $("q").disabled = false;
}
function hideTip(){ const t = $("tip"); if (t) t.hidden = true; }
function drawHome(){ if (homePath && path) homePath.attr("d", profile?.cidade_id && byId.get(profile.cidade_id) ? path(byId.get(profile.cidade_id)) : null); }
function flyTo(feature, maxK = 40){
  if (!W || !path) return;
  const [[x0,y0],[x1,y1]] = path.bounds(feature);
  const k = Math.min(maxK, .8 / Math.max((x1-x0)/W, (y1-y0)/H));
  const t = d3.zoomIdentity.translate(W/2, H/2).scale(k).translate(-(x0+x1)/2, -(y0+y1)/2 + (selId ? H*.14/k : 0));
  svg.transition().duration(reduced() ? 0 : 900).ease(d3.easeCubicInOut).call(zoom.transform, t);
}
function flyToUf(uf){ closeCard(); flyTo({ type:"FeatureCollection", features: feats.filter(f => f.properties.uf === uf) }, 30); }

function toggle(id, x, y){
  const before = earned();
  const el = pathEl.get(id);
  if (V[id]){ delete V[id]; el?.classList.remove("pop"); }
  else {
    V[id] = { d: today(), n: "" };
    if (el){ el.classList.remove("pop"); void el.getBBox(); el.classList.add("pop"); }
    if (x != null) burst(x, y);
    const p = byId.get(id).properties, got = ufCount(p.uf);
    const nb = BADGES.find(b => earned().has(b.k) && !before.has(b.k));
    const lvBefore = levelOf(Object.keys(V).length - 1).idx, lv = levelOf(Object.keys(V).length);
    if (lv.idx > lvBefore) toast(`Subiu de nível! Agora você é <b>${esc(lv.title)}</b>`, 4200);
    else if (nb) toast(`Conquista desbloqueada: <b>${esc(badgeTitle(nb))}</b>`, 3800);
    else if (got === ufTotal[p.uf] && p.uf !== "DF") toast(`Você fechou <b>${esc(UFN[p.uf])}</b> inteiro!`, 3800);
    else if (got === 1) toast(`Primeira cidade em <b>${esc(UFN[p.uf])}</b>!`);
    else toast(`<b>${esc(p.n)}</b> marcada. Boa estrada!`);
  }
  enqueue(id); paintAll(); refreshCard();
}
const ufCount = (uf) => { let c = 0; for (const id in V){ const f = byId.get(id); if (f && f.properties.uf === uf) c++; } return c; };

function select(id){ selId = id; selPath?.attr("d", path(byId.get(id))); refreshCard(); }
function closeCard(){ selId = null; selPath?.attr("d", null); $("card").hidden = true; }
function refreshCard(){
  const c = $("card");
  if (!selId){ c.hidden = true; return; }
  const f = byId.get(selId), p = f.properties, v = V[selId];
  const theirs = other?.set.has(selId);
  if (isAdmin()){
    const h = heat?.get(selId);
    c.innerHTML = `<button class="x" id="cx" aria-label="Fechar">✕</button>
      <div><h3>${esc(p.n)}</h3><div class="meta">${esc(UFN[p.uf])} · Região ${REG[selId[0]]}${CAPS.has(selId) ? " · Capital" : ""} · ${fmtN(Math.round(f.area))} km²</div></div>
      ${other ? `<div class="meta" style="color:var(--other);font-weight:700">${theirs ? `${esc(other.nome)} passou por aqui` : `${esc(other.nome)} ainda não passou por aqui`}</div>`
        : h ? `<div><b style="font-size:18px">${h.pessoas} ${h.pessoas === 1 ? "pessoa passou" : "pessoas passaram"} por aqui</b><div class="names" style="margin-top:8px">${h.nomes.map(n => `<span>${esc(n)}</span>`).join("")}${h.pessoas > h.nomes.length ? `<span>+${h.pessoas - h.nomes.length}</span>` : ""}</div></div>`
        : `<div class="meta">Ninguém marcou esta cidade ainda.</div>`}`;
    c.hidden = false; $("cx").onclick = closeCard; return;
  }
  c.innerHTML = `
    <button class="x" id="cx" aria-label="Fechar">✕</button>
    <div><h3>${esc(p.n)}</h3><div class="meta">${esc(UFN[p.uf])} · Região ${REG[selId[0]]}${CAPS.has(selId) ? " · Capital" : ""} · ${fmtN(Math.round(f.area))} km²${selId === profile.cidade_id ? " · Sua cidade" : ""}</div>
    ${other ? `<div class="meta" style="color:var(--other);font-weight:600">${theirs ? `${esc(other.nome)} já passou por aqui` : `${esc(other.nome)} ainda não passou por aqui`}</div>` : ""}</div>
    <button class="big ${v ? "off" : ""}" id="ctog">${v ? "Desmarcar esta cidade" : `<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M20 6 9 17l-5-5"/></svg>Passei por aqui!`}</button>
    ${v ? `<div class="fields">
      <label for="cd">Quando<input type="date" id="cd" value="${esc(v.d || "")}" max="${today()}"></label>
      <label for="cn">Lembrança<textarea id="cn" maxlength="280" placeholder="Com quem, como foi, onde comeu…">${esc(v.n || "")}</textarea></label>
    </div>` : ""}`;
  c.hidden = false;
  $("cx").onclick = closeCard;
  $("ctog").onclick = (e) => { const b = e.currentTarget.getBoundingClientRect(); toggle(selId, b.left + b.width/2, b.top); };
  if (v){
    $("cd").onchange = (e) => { if (V[selId]){ V[selId].d = e.target.value; enqueue(selId); } };
    let nt; $("cn").oninput = (e) => { clearTimeout(nt); const id = selId, val = e.target.value; nt = setTimeout(() => { if (V[id]){ V[id].n = val; enqueue(id); } }, 700); };
  }
}

/* busca no mapa */
let hits = [], hi = 0;
$("q").addEventListener("input", (e) => {
  const R = $("res"); hits = searchCities(e.target.value); hi = 0;
  if (norm(e.target.value).length < 2){ R.hidden = true; return; }
  R.innerHTML = hits.length ? hits.map((f,i) => `<li role="option" data-i="${i}" aria-selected="${i===0}"><i class="dot ${V[f.id] ? "on" : ""}"></i>${esc(f.properties.n)}<span class="uf">${f.properties.uf}</span></li>`).join("") : `<li aria-disabled="true" style="color:var(--muted)">Nenhuma cidade com esse nome</li>`;
  R.hidden = false;
  R.querySelectorAll("li[data-i]").forEach(li => li.onpointerdown = (ev) => { ev.preventDefault(); pickHit(+li.dataset.i); });
});
$("q").addEventListener("keydown", (e) => {
  const R = $("res"); if (R.hidden || !hits.length) return;
  if (e.key === "ArrowDown" || e.key === "ArrowUp"){ e.preventDefault(); hi = (hi + (e.key === "ArrowDown" ? 1 : -1) + hits.length) % hits.length; R.querySelectorAll("li").forEach((li,i) => li.setAttribute("aria-selected", i === hi)); }
  else if (e.key === "Enter"){ e.preventDefault(); pickHit(hi); }
  else if (e.key === "Escape") R.hidden = true;
});
$("q").addEventListener("blur", () => setTimeout(() => $("res").hidden = true, 150));
function pickHit(i){
  const f = hits[i]; if (!f) return; $("res").hidden = true; $("q").value = ""; $("q").blur();
  if (planning){ planToggle(f.id); flyTo(f, 14); return; }
  select(f.id); flyTo(f, 25);
}

/* comparar mapas */
async function compareWith(id, nome){
  if (id === me.id){ endCompare(); showView("mapa"); return; }
  const { data, error } = await sb.rpc("mapa_publico", { p_user: id });
  if (error){ toast("Não foi possível abrir esse mapa."); return; }
  other = { id, nome, set: new Set(data.map(r => r.municipio_id)) };
  showView("mapa"); closeCard(); paintAll();
  let both = 0; for (const x of other.set) if (V[x]) both++;
  $("compareTxt").textContent = isAdmin() ? `Mapa de ${nome}: ${fmtN(other.set.size)} cidades` : `Mapa de ${nome}: ${fmtN(other.set.size)} cidades · ${fmtN(both)} em comum com você`;
  $("compare").hidden = false;
  $("legend").innerHTML = isAdmin() ? `<span><i class="sw o"></i>Cidades de ${esc(nome.split(" ")[0])}</span>` : `<span><i class="sw v"></i>Só você</span><span><i class="sw o"></i>Só ${esc(nome.split(" ")[0])}</span><span><i class="sw b"></i>Os dois</span>`;
  svg?.transition().duration(600).call(zoom.transform, d3.zoomIdentity);
}
function endCompare(){
  other = null; $("compare").hidden = true;
  resetLegend(); paintAll(); refreshCard();
}
function resetLegend(){
  $("legend").innerHTML = isAdmin()
    ? (heatMax > 1 ? `<span>1 pessoa</span><i class="heatbar"></i><span>${fmtN(heatMax)} pessoas</span>` : `<span><i class="sw" style="background:${heatColor(1)};border-color:${heatColor(1)}"></i>Alguém já passou por aqui</span>`)
    : `<span><i class="sw v"></i>Já passei</span><span><i class="sw"></i>Ainda não</span>`;
}

/* =====================================================================
   Números, níveis e conquistas
   ===================================================================== */
let routeIds = null, idxById = null;
function routeIdsOf(){
  if (routeIds) return routeIds;
  if (!feats.length) return Object.fromEntries(Object.keys(ROUTES).map(k => [k, []]));
  const idx = new Map(feats.map(f => [f.properties.n + "|" + f.properties.uf, f.id]));
  routeIds = {};
  for (const k in ROUTES) routeIds[k] = ROUTES[k].map(([n, uf]) => idx.get(n + "|" + uf)).filter(Boolean);
  return routeIds;
}
function homeNeighbors(){
  const id = profile?.cidade_id; if (!id || !topoObj) return [];
  if (!idxById) idxById = new Map(feats.map((f, i) => [f.id, i]));
  const i = idxById.get(id); if (i == null) return [];
  return neighbors()[i].map(j => feats[j].id);
}
function stats(){
  const ufs = new Set(), regs = new Set(), months = new Set(), seasons = new Set(), perUf = {}, perDay = {};
  const perReg = { 1:0, 2:0, 3:0, 4:0, 5:0 }, ufByReg = { 1:new Set(), 2:new Set(), 3:new Set(), 4:new Set(), 5:new Set() };
  let caps = 0, area = 0, n = 0, notas = 0, longe = 0, maxArea = 0, tiny = 0, domingos = 0;
  let latMin = 90, latMax = -90, dMin = "", dMax = "", norteEq = 0, trN = 0, trS = 0;
  const home = profile?.cidade_id && byId.get(profile.cidade_id);
  for (const id in V){
    const f = byId.get(id); if (!f) continue;
    const uf = f.properties.uf, r = id[0], v = V[id], lat = f.c[1];
    n++; ufs.add(uf); regs.add(r); perReg[r]++; ufByReg[r]?.add(uf);
    if (CAPS.has(id)) caps++;
    area += f.area; if (f.area > maxArea) maxArea = f.area; if (f.area < 20) tiny = 1;
    perUf[uf] = (perUf[uf] || 0) + 1;
    if (lat < latMin) latMin = lat; if (lat > latMax) latMax = lat;
    if (lat > 0) norteEq = 1;
    if (lat > -23.44) trN = 1; else trS = 1;
    if (v.n && v.n.trim()) notas++;
    if (v.d){
      months.add(v.d.slice(0,7));
      perDay[v.d] = (perDay[v.d] || 0) + 1;
      const mo = +v.d.slice(5,7);
      seasons.add(mo === 12 || mo <= 2 ? "verão" : mo <= 5 ? "outono" : mo <= 8 ? "inverno" : "primavera");
      if (new Date(v.d + "T12:00").getDay() === 0) domingos++;
      if (!dMin || v.d < dMin) dMin = v.d;
      if (!dMax || v.d > dMax) dMax = v.d;
    }
    if (home) longe = Math.max(longe, d3.geoDistance(home.c, f.c) * 6371);
  }
  let fullPct = 0;
  for (const u in perUf) if (u !== "DF") fullPct = Math.max(fullPct, perUf[u] / ufTotal[u] * 100);
  let vizPct = 0;
  if (home){ const nb = homeNeighbors(); if (nb.length) vizPct = Math.floor(nb.filter(id => V[id]).length / nb.length * 100); }
  const out = { n, ufs: ufs.size, regs: regs.size, caps, area: Math.round(area), perUf, notas, meses: months.size,
    longe: Math.round(longe), natal: home && V[profile.cidade_id] ? 1 : 0,
    ns: (regs.has("1") ? 1 : 0) + (regs.has("4") ? 1 : 0), fullPct: Math.floor(fullPct),
    regN: perReg[1], regNE: perReg[2], regCO: perReg[5],
    ufN: ufByReg[1].size, ufNE: ufByReg[2].size, ufSE: ufByReg[3].size, ufS: ufByReg[4].size, ufCO: ufByReg[5].size,
    maxArea: Math.round(maxArea), tiny, norteEq, tropico: trN + trS, span: n ? Math.round((latMax - latMin) * 111.2) : 0,
    vizPct, estacoes: seasons.size, domingos, sameDay: Math.max(0, ...Object.values(perDay)),
    anoDias: dMin && dMax ? Math.round((new Date(dMax) - new Date(dMin)) / 864e5) : 0,
    viagens: trips.filter(t => t.paradas.length).length, viagensOk: trips.filter(t => t.status === "concluida").length };
  const rid = routeIdsOf();
  for (const k in ROUTES) out["rota_" + k] = rid[k].filter(id => V[id]).length;
  return out;
}
const badgeTitle = (b) => b.tm ? g3(profile, b.t, b.tm, b.t) : b.t;
function earned(){ const s = stats(); return new Set(BADGES.filter(b => s[b.m] >= b.goal).map(b => b.k)); }
function levelOf(n){
  let idx = 0; for (let i = 0; i < LEVELS.length; i++) if (n >= LEVELS[i].min) idx = i;
  const L = LEVELS[idx], next = LEVELS[idx+1];
  return { idx, title: g3(profile, L.f, L.m, L.x), next, prog: next ? (n - L.min) / (next.min - L.min) : 1,
    nextTitle: next ? g3(profile, next.f, next.m, next.x) : null };
}

function heatColor(c){
  const t = heatMax > 1 ? Math.log(c) / Math.log(heatMax) : 1;
  return d3.interpolateRgb("#F7C9A6", "#8E2412")(.12 + .88 * t);
}
function paintAll(){
  if (isAdmin()) return paintAdminMap();
  if (mapReady){
    const pt = planning ? tripById(planning) : null;
    const ps = new Set(pt ? pt.paradas.map(x => x.id) : []), pc = new Set(pt ? pt.caminho : []);
    for (const [id, el] of pathEl){
      const on = !!V[id], o = !!other?.set.has(id), st = ps.has(id), cm = !st && pc.has(id);
      if (el.classList.contains("v") !== on) el.classList.toggle("v", on);
      if (el.classList.contains("o") !== o) el.classList.toggle("o", o);
      if (el.classList.contains("s") !== st) el.classList.toggle("s", st);
      if (el.classList.contains("c") !== cm) el.classList.toggle("c", cm);
      if (el.style.fill){ el.style.fill = ""; el.style.stroke = ""; }
    }
    drawHome();
  }
  const s = stats();
  $("sMunL").textContent = "municípios"; $("sUfL").textContent = "estados de 27"; $("sCapL").textContent = "capitais de 27";
  $("sKmL").textContent = "km² de Brasil"; $("pctL").textContent = "Brasil percorrido"; $("sideH").textContent = "Por estado";
  setShield(s.n); animNum($("sMun"), s.n);
  $("sUf").textContent = s.ufs; $("sCap").textContent = s.caps;
  $("sKm").textContent = s.area >= 1e5 ? fmtN(Math.round(s.area/1000)) + " mil" : fmtN(Math.round(s.area));
  const pct = totalArea ? s.area / totalArea * 100 : 0;
  $("pct").textContent = (pct < 1 && pct > 0 ? pct.toFixed(2) : pct.toFixed(1)).replace(".", ",") + "% do território";
  $("pctBar").style.width = Math.max(pct, s.n ? .8 : 0) + "%";
  if (planning) renderPlanSide(); else renderUfList(s);
  if (profile) renderMe();
  if (view === "diario") renderDiary();
  if (view === "conquistas") renderBadges();
}
function setShield(n){ $("shield").dataset.len = fmtN(n).length; animNum($("shieldN"), n); }
function animNum(el, to){
  const from = +el.dataset.v || 0; el.dataset.v = to;
  if (from === to || reduced()){ el.textContent = fmtN(to); return; }
  const t0 = performance.now();
  const step = (t) => { const k = Math.min(1, (t - t0) / 500); el.textContent = fmtN(Math.round(from + (to - from) * (1 - Math.pow(1-k, 3)))); if (k < 1) requestAnimationFrame(step); };
  requestAnimationFrame(step);
}
/* contorno de cada estado (feito uma vez) para a lista "Por estado" */
let ufShapes = null;
function ufShape(uf){
  if (!ufShapes){
    ufShapes = {};
    for (const u of Object.keys(UFN)){
      const f = { type: "Feature", geometry: topojson.merge(topo, topoObj.geometries.filter(g => g.properties.uf === u)) };
      fixWinding(f);
      // ilhas minúsculas e distantes (Trindade no ES, Fernando de Noronha em PE) encolheriam o desenho
      if (f.geometry.type === "MultiPolygon"){
        const areas = f.geometry.coordinates.map(c => d3.geoArea({ type: "Polygon", coordinates: c }));
        const max = Math.max(...areas);
        f.geometry = { type: "MultiPolygon", coordinates: f.geometry.coordinates.filter((c, i) => areas[i] >= max * .01) };
      }
      const pr = d3.geoMercator().fitExtent([[3, 3], [41, 41]], f), gp = d3.geoPath(pr);
      const d = gp(f);
      // quanto de área o estado tem em cada faixa horizontal (para encher pela área, não pela altura)
      const R = 4, cv = document.createElement("canvas"); cv.width = cv.height = 44 * R;
      const cx = cv.getContext("2d"); cx.scale(R, R); cx.fill(new Path2D(d));
      const px = cx.getImageData(0, 0, 44 * R, 44 * R).data, rows = new Array(44 * R).fill(0);
      for (let y = 0; y < 44 * R; y++) for (let x = 0; x < 44 * R; x++) if (px[(y * 44 * R + x) * 4 + 3] > 127) rows[y]++;
      ufShapes[u] = { d, rows, total: rows.reduce((a, b) => a + b, 0) || 1, R, c: gp.centroid(f) };
    }
  }
  return ufShapes[uf];
}
function ufIcon(u, pct){
  const sh = ufShape(u), cid = "ufclip-" + u;
  // sobe de baixo para cima até cobrir a fração certa da área do estado
  let fill = 44;
  if (pct > 0){
    const goal = sh.total * Math.min(1, Math.max(pct, .04));   // um filete visível mesmo com 1 cidade
    let acc = 0, y = sh.rows.length - 1;
    for (; y >= 0; y--){ acc += sh.rows[y]; if (acc >= goal) break; }
    fill = Math.max(0, y) / sh.R;
  }
  return `<svg class="ufi" viewBox="0 0 44 44" aria-hidden="true"><defs><clipPath id="${cid}"><path d="${sh.d}"/></clipPath></defs>
    <path class="ufi-base" d="${sh.d}"/>${pct > 0 ? `<rect class="ufi-fill" x="0" y="${fill.toFixed(2)}" width="44" height="${(44 - fill).toFixed(2)}" clip-path="url(#${cid})"/>` : ""}
    <path class="ufi-line" d="${sh.d}"/><text x="${sh.c[0].toFixed(1)}" y="${sh.c[1].toFixed(1)}">${u}</text></svg>`;
}
function renderUfList(s){
  if (!feats.length) return;
  const rows = Object.keys(UFN).map(u => ({ u, c: s.perUf[u] || 0, t: ufTotal[u] || 1 }))
    .sort((a,b) => (b.c/b.t - a.c/a.t) || (b.c - a.c) || UFN[a.u].localeCompare(UFN[b.u]));
  $("ufList").innerHTML = (s.n ? "" : `<div class="hint">Toque em qualquer cidade do mapa ou use a busca. Depois é só apertar <b>Passei por aqui!</b></div>`) +
    rows.map(r => `<button class="row" data-uf="${r.u}">${ufIcon(r.u, r.c / r.t)}<span><div class="nm">${esc(UFN[r.u])}</div><div class="mini"><i style="width:${(r.c/r.t*100).toFixed(2)}%"></i></div></span><span class="ct num">${r.c} / ${fmtN(r.t)}</span></button>`).join("");
  $("ufList").querySelectorAll(".row").forEach(b => b.onclick = () => { if (matchMedia("(max-width:900px)").matches) $("wrap").scrollIntoView({ behavior: "smooth" }); flyToUf(b.dataset.uf); });
}

/* ---------- diário ---------- */
function renderDiary(){
  const list = Object.entries(V).filter(([id]) => byId.has(id))
    .sort((a,b) => (b[1].d || "").localeCompare(a[1].d || "") || byId.get(a[0]).properties.n.localeCompare(byId.get(b[0]).properties.n));
  const notas = list.filter(x => x[1].n && x[1].n.trim()).length;
  const meses = new Set(list.filter(x => x[1].d).map(x => x[1].d.slice(0,7))).size;
  const primeira = list.filter(x => x[1].d).map(x => x[1].d).sort()[0];
  $("diarySub").textContent = list.length ? "Toque numa viagem para vê-la no mapa." : "Cada cidade marcada vira uma página.";
  $("diarySum").hidden = !list.length;
  $("diarySum").innerHTML = `
    <div><b class="num">${fmtN(list.length)}</b><span>cidades</span></div>
    <div><b class="num">${fmtN(notas)}</b><span>lembranças</span></div>
    <div><b class="num">${fmtN(meses)}</b><span>${meses === 1 ? "mês na estrada" : "meses na estrada"}</span></div>
    <div><b class="num">${primeira ? fmtDate(primeira).slice(3) : "—"}</b><span>primeira viagem</span></div>`;
  if (!list.length){ $("diary").innerHTML = `<div class="empty">Seu diário começa na primeira cidade marcada.<br>Cada lugar ganha data e uma lembrança.</div>`; return; }
  const groups = new Map();
  for (const it of list){
    const m = it[1].d ? new Date(it[1].d + "T12:00").toLocaleDateString("pt-BR", { month: "long", year: "numeric" }) : "Sem data";
    if (!groups.has(m)) groups.set(m, []); groups.get(m).push(it);
  }
  let html = "";
  for (const [m, items] of groups){
    html += `<div class="month"><span>${esc(m.charAt(0).toUpperCase() + m.slice(1))}<small>${items.length} ${items.length === 1 ? "cidade" : "cidades"}</small></span></div><div class="trips">`;
    for (const [id, v] of items.slice(0, 300)){
      const p = byId.get(id).properties;
      html += `<button class="trip" data-id="${id}"><span class="pin">${ico("pin", 20)}</span><span><b>${esc(p.n)}</b><span class="uf">${p.uf}</span>${v.n ? `<p>“${esc(v.n)}”</p>` : ""}</span><small class="num">${fmtDate(v.d) || "sem data"}</small></button>`;
    }
    html += "</div>";
  }
  $("diary").innerHTML = html;
  $("diary").querySelectorAll(".trip").forEach(b => b.onclick = () => { showView("mapa"); select(b.dataset.id); setTimeout(() => flyTo(byId.get(b.dataset.id), 25), 60); });
}

/* ---------- conquistas ---------- */
function ringSvg(p, size = 156, stroke = 12){
  const r = (size - stroke) / 2, c = 2 * Math.PI * r;
  return `<svg width="${size}" height="${size}" viewBox="0 0 ${size} ${size}" aria-hidden="true">
    <circle cx="${size/2}" cy="${size/2}" r="${r}" fill="none" stroke="rgba(255,255,255,.18)" stroke-width="${stroke}"/>
    <circle cx="${size/2}" cy="${size/2}" r="${r}" fill="none" stroke="var(--road)" stroke-width="${stroke}" stroke-linecap="round" stroke-dasharray="${c}" stroke-dashoffset="${c * (1 - Math.max(.02, p))}"/></svg>`;
}
function renderBadges(){
  const s = stats(), lv = levelOf(s.n);
  const got = BADGES.filter(b => s[b.m] >= b.goal).length;
  const unitOf = (b) => UNITS[b.m] || "";
  $("levelBox").innerHTML = `<div class="level">
    <div class="ring">${ringSvg(lv.prog)}<div class="in"><div><small>NÍVEL</small><b>${lv.idx+1}</b></div></div></div>
    <div><span class="lk">Seu título na estrada</span><h3>${esc(lv.title)}</h3>
      <p>${lv.next ? `Faltam <b>${fmtN(lv.next.min - s.n)}</b> cidades para virar <b>${esc(lv.nextTitle)}</b>.` : "Você chegou ao topo da estrada. Respeito!"}</p>
      <div class="lstats"><span><b class="num">${fmtN(s.n)}</b>cidades</span><span><b class="num">${got}/${BADGES.length}</b>conquistas</span><span><b class="num">${s.ufs}/27</b>estados</span></div></div></div>`;
  // as três mais perto de sair
  const near = BADGES.filter(b => s[b.m] < b.goal && b.goal > 1).map(b => ({ b, p: s[b.m] / b.goal })).sort((a,b) => b.p - a.p).slice(0, 3);
  $("nearBox").innerHTML = near.length ? `<section class="sec"><div class="sec-h"><h4>Quase lá</h4></div><div class="near">${near.map(({b,p}) => `
    <div class="nearc"><span class="mini-disc">${ico(b.i, 24)}</span><span><b>${esc(badgeTitle(b))}</b><span>${fmtN(s[b.m])}${unitOf(b)} de ${fmtN(b.goal)}${unitOf(b)} · ${esc(b.d)}</span><div class="bar"><i style="width:${(p*100).toFixed(1)}%"></i></div></span></div>`).join("")}</div></section>` : "";
  const groups = [...new Set(BADGES.map(b => b.g))];
  $("badgeBox").innerHTML = groups.map(g => {
    const list = BADGES.filter(b => b.g === g), n = list.filter(b => s[b.m] >= b.goal).length;
    return `<section class="sec"><div class="sec-h"><h4>${esc(g)}</h4><em>${n} de ${list.length}</em></div><div class="medals">${list.map(b => {
      const val = s[b.m], on = val >= b.goal, pr = Math.min(1, val / b.goal), unit = unitOf(b);
      return `<div class="medal ${on ? "on" : ""}"><span class="disc" style="--p:${(pr*100).toFixed(1)}%">${on ? ico(b.i, 32) : ico("lock", 24)}</span>
        ${b.r ? '<span class="rare">Lendária</span>' : ""}<b>${esc(badgeTitle(b))}</b><span>${esc(b.d)}</span>
        <span class="prog">${on ? "Conquistada" : b.goal > 1 ? `${fmtN(Math.min(val, b.goal))}${unit} / ${fmtN(b.goal)}${unit}` : "Ainda não"}</span></div>`;
    }).join("")}</div></section>`;
  }).join("") + (profile.cidade_id ? "" : `<p class="muted" style="text-align:center">Dica: escolha sua <b>cidade de partida</b> no Perfil para liberar as conquistas de distância.</p>`);
}

/* =====================================================================
   Viagens: planejar o roteiro, organizar o caminho e concluir
   Regra principal: concluir a viagem marca todas as cidades como visitadas,
   e marcar todas as paradas conclui a viagem sozinho.
   ===================================================================== */
let trips = [], tripSel = null, planning = null, curT = d3.zoomIdentity;
const tripDirty = new Set(), tripTimers = new Map();
const STATUS = { planejada: "Planejada", em_andamento: "Em andamento", concluida: "Concluída" };
const tKey = () => `por:${me.id}:viagens`;
const tripById = (id) => trips.find(t => t.id === id);
const saveTripsLocal = () => store.set(tKey(), JSON.stringify(trips));
const stopName = (id) => byId.get(id)?.properties.n || "";
const stopUf = (id) => byId.get(id)?.properties.uf || "";
const tripLine = (t) => t.rota && t.rota.length > 1 ? t.rota : t.paradas.map(p => byId.get(p.id).c);
const lineKm = (t) => Math.round(t.paradas.reduce((s, p, i) => i ? s + d3.geoDistance(byId.get(t.paradas[i-1].id).c, byId.get(p.id).c) * 6371 : 0, 0));
let UF_MESH = null;
const ufMeshGeo = () => UF_MESH || (UF_MESH = topojson.mesh(topo, topoObj, (a, b) => a === b || a.properties.uf !== b.properties.uf));

function normTrip(r){
  return { id: r.id, nome: r.nome, inicio: r.inicio, fim: r.fim, status: r.status, paradas: r.paradas || [], caminho: r.caminho || [],
    trechos: r.trechos || [], rota: r.rota || null, km: r.km, horas: r.horas != null ? +r.horas : null, notas: r.notas || "", criado_em: r.criado_em, concluida_em: r.concluida_em };
}
async function loadTrips(){
  try { trips = JSON.parse(store.get(tKey()) || "[]"); } catch { trips = []; }
  const { data, error } = await sb.from("viagens").select("*").eq("user_id", me.id).order("criado_em", { ascending: false });
  if (!error){
    const local = new Map(trips.filter(t => tripDirty.has(t.id)).map(t => [t.id, t]));
    trips = data.map(r => local.get(r.id) || normTrip(r));
    for (const [id, t] of local) if (!trips.some(x => x.id === id)) trips.unshift(t);
    saveTripsLocal();
  }
  if (view === "viagens") renderTrips();
  if (view === "conquistas") renderBadges();
}

/* gravação: cada mudança vai para o aparelho na hora e para o banco logo depois */
function touchTrip(t, rerender = true){
  tripDirty.add(t.id); saveTripsLocal();
  clearTimeout(tripTimers.get(t.id)); tripTimers.set(t.id, setTimeout(() => pushTrip(t.id), 700));
  if (rerender){ if (view === "viagens") renderTrips(); if (planning === t.id) paintPlan(); }
}
async function pushTrip(id){
  const t = tripById(id); if (!t){ tripDirty.delete(id); return; }
  const { error } = await sb.from("viagens").upsert({
    id: t.id, user_id: me.id, nome: (t.nome || "").trim() || "Nova viagem", inicio: t.inicio || null, fim: t.fim || null, status: t.status,
    paradas: t.paradas, caminho: t.caminho, trechos: t.trechos || [], rota: t.rota, km: t.km ?? null, horas: t.horas ?? null, notas: t.notas || null, concluida_em: t.concluida_em || null,
  });
  if (error && !error.code){ clearTimeout(tripTimers.get(id)); tripTimers.set(id, setTimeout(() => pushTrip(id), 15000)); return; }   // sem internet: tenta de novo
  if (error){ console.warn(error); toast("Não consegui salvar a viagem. Tente de novo."); }
  tripDirty.delete(id);
}
addEventListener("online", () => { for (const id of tripDirty) pushTrip(id); });

/* ---------- operações ---------- */
function newTrip(){
  const t = { id: crypto.randomUUID(), nome: "Nova viagem", inicio: null, fim: null, status: "planejada", paradas: [], caminho: [], trechos: [], rota: null,
    km: null, horas: null, notas: "", criado_em: new Date().toISOString(), concluida_em: null };
  trips.unshift(t); tripSel = t.id; touchTrip(t);
  setTimeout(() => { const n = $("tripNome"); if (n){ n.focus(); n.select(); } }, 60);
}
/* mudou o roteiro: o caminho pela estrada é recalculado sozinho em seguida */
function invalidateRoute(t){ t.rota = null; t.caminho = []; t.trechos = []; t.km = null; t.horas = null; scheduleRoute(t); }
function syncStatus(t){
  if (t.status === "concluida" && t.paradas.length && t.paradas.every(p => p.feito)) return;
  t.status = t.paradas.some(p => p.feito) ? "em_andamento" : "planejada"; t.concluida_em = null;
}
function addStop(t, id){
  if (t.paradas.some(p => p.id === id)){ toast(`<b>${esc(stopName(id))}</b> já está no roteiro`); return false; }
  if (t.paradas.length >= 150){ toast("Uma viagem pode ter até 150 paradas."); return false; }
  t.paradas.push({ id, feito: false, data: null, criou: false });
  invalidateRoute(t); syncStatus(t); touchTrip(t);
  return true;
}
function removeStop(t, i){ t.paradas.splice(i, 1); invalidateRoute(t); syncStatus(t); touchTrip(t); }
function moveStop(t, i, d){
  const j = i + d; if (j < 0 || j >= t.paradas.length) return;
  [t.paradas[i], t.paradas[j]] = [t.paradas[j], t.paradas[i]]; invalidateRoute(t); touchTrip(t);
}
/* Ela não voa: chegar a uma parada = ter passado por todas as cidades da estrada desde a parada anterior.
   trechos[k] é o caminho entre a parada k e a parada k+1. */
function markSegment(t, k, data){
  const seg = (t.trechos || [])[k]; if (!seg) return 0;
  let n = 0; seg.criadas = seg.criadas || [];
  for (const id of seg.ids) if (!V[id]){ V[id] = { d: data, n: "" }; enqueue(id); seg.criadas.push(id); n++; }
  return n;
}
function unmarkSegment(t, k){
  const seg = (t.trechos || [])[k]; if (!seg || !seg.criadas?.length) return;
  const manter = new Set();   // cidades que outro trecho concluído (ou uma parada concluída) também usa
  t.trechos.forEach((x, j) => { if (j !== k && t.paradas[j + 1]?.feito) x.ids.forEach(id => manter.add(id)); });
  t.paradas.forEach(p => { if (p.feito) manter.add(p.id); });
  for (const id of seg.criadas) if (!manter.has(id) && V[id]){ delete V[id]; enqueue(id); }
  seg.criadas = [];
}
function toggleStop(t, i){
  const p = t.paradas[i]; if (!p) return;
  const before = earned();
  if (!p.feito){
    p.feito = true; p.data = p.data || today();
    if (!V[p.id]){ V[p.id] = { d: p.data, n: "" }; p.criou = true; enqueue(p.id); }
    const via = i ? markSegment(t, i - 1, p.data) : 0;
    paintAll();
    if (t.paradas.every(x => x.feito)) return completeTrip(t, { auto: true, before });
    t.status = "em_andamento"; touchTrip(t);
    const nb = BADGES.find(b => earned().has(b.k) && !before.has(b.k));
    toast(nb ? `Conquista desbloqueada: <b>${esc(badgeTitle(nb))}</b>`
      : `<b>${esc(stopName(p.id))}</b> concluída${via ? `, com mais <b>${fmtN(via)}</b> ${via === 1 ? "cidade" : "cidades"} do caminho` : ""}. Boa estrada!`, 3800);
  } else {
    p.feito = false;
    if (i) unmarkSegment(t, i - 1);
    if (p.criou && V[p.id]){ delete V[p.id]; enqueue(p.id); }   // só desfaz o que esta viagem acrescentou
    p.criou = false; p.data = null;
    syncStatus(t); paintAll(); touchTrip(t);
  }
}
function finishTrip(t, data, before){
  for (const p of t.paradas){
    if (!p.feito){ p.feito = true; p.data = data; }
    if (!V[p.id]){ V[p.id] = { d: p.data || data, n: "" }; p.criou = true; enqueue(p.id); }
  }
  (t.trechos || []).forEach((_, k) => markSegment(t, k, t.paradas[k + 1]?.data || data));
  t.status = "concluida"; t.concluida_em = new Date().toISOString();
  const daViagem = t.paradas.filter(p => p.criou).length + (t.trechos || []).reduce((n, x) => n + (x.criadas?.length || 0), 0);
  paintAll(); touchTrip(t);
  burst(innerWidth / 2, innerHeight / 3);
  const nb = BADGES.filter(b => earned().has(b.k) && !before.has(b.k));
  toast(daViagem
    ? `Viagem concluída! <b>${fmtN(daViagem)}</b> ${daViagem === 1 ? "cidade nova" : "cidades novas"} no seu mapa com esta viagem${nb.length ? ` · conquista: <b>${esc(badgeTitle(nb[0]))}</b>` : ""}`
    : `Viagem concluída!${nb.length ? ` Conquista: <b>${esc(badgeTitle(nb[0]))}</b>` : " Todas as cidades já estavam no seu mapa."}`, 5200);
}
async function completeTrip(t, { auto = false, before = earned() } = {}){
  // sem o caminho pela estrada não dá para saber por onde ela passou: calcula antes de concluir
  if (t.paradas.length > 1 && !(t.trechos || []).length){
    toast("Calculando o caminho pela estrada…");
    const ok = await traceRoad(t);
    if (!ok){
      modal({ title: "Não consegui calcular o caminho",
        body: `<p style="margin:0">O serviço de rotas não respondeu agora, então ainda não sei por quais cidades a estrada passa entre as paradas.</p><p class="muted" style="margin:0">Dá para tentar de novo daqui a pouco ou concluir agora só com as paradas.</p>`,
        actions: [{ label: "Tentar depois", cls: "ghost", onClick: () => { if (auto){ t.status = "em_andamento"; touchTrip(t); } } },
                  { label: "Concluir só com as paradas", onClick: () => finishTrip(t, today(), before) }] });
      return;
    }
  }
  if (auto) return finishTrip(t, today(), before);
  const falta = t.paradas.filter(p => !p.feito).length;
  const via = (t.caminho || []).length, viaNovas = (t.caminho || []).filter(id => !V[id]).length;
  const hoje = today(), dataPadrao = t.fim && t.fim < hoje ? t.fim : hoje;
  modal({
    title: `Concluir “${t.nome}”?`,
    body: `<p style="margin:0">${falta ? `As <b>${fmtN(falta)}</b> paradas que faltam serão marcadas como concluídas.` : "Todas as paradas já estão concluídas."}
      ${via ? ` Também entram no seu mapa as <b>${fmtN(via)}</b> cidades por onde a estrada passa${viaNovas ? ` (${fmtN(viaNovas)} novas)` : ""}.` : ""}</p>
      <label class="field"><span>Data da viagem</span><input class="input" type="date" id="ctData" value="${dataPadrao}" max="${hoje}"></label>`,
    actions: [
      { label: "Cancelar", cls: "ghost" },
      { label: "Concluir viagem", onClick: () => finishTrip(t, $("ctData").value || hoje, before) },
    ],
  });
}
function reopenTrip(t){ t.status = "em_andamento"; t.concluida_em = null; touchTrip(t); toast("Viagem reaberta. As cidades continuam no seu mapa."); }
function deleteTrip(t){
  modal({ title: `Excluir “${t.nome}”?`,
    body: `<p style="margin:0">O roteiro é apagado. As cidades que já entraram no seu mapa continuam lá.</p>`,
    actions: [{ label: "Cancelar", cls: "ghost" }, { label: "Excluir viagem", cls: "danger", onClick: async () => {
      trips = trips.filter(x => x.id !== t.id); tripDirty.delete(t.id); clearTimeout(tripTimers.get(t.id)); saveTripsLocal();
      if (tripSel === t.id) tripSel = trips[0]?.id || null;
      renderTrips();
      const { error } = await sb.from("viagens").delete().eq("id", t.id);
      if (error) toast("A viagem saiu daqui, mas não consegui apagar no servidor."); else toast("Viagem excluída.");
    }}] });
}

/* "Organizar o caminho": menor percurso em linha reta, mantendo a primeira parada como partida */
function organizeRoute(t){
  const n = t.paradas.length;
  if (n < 3){ toast("Coloque pelo menos 3 paradas para organizar o caminho."); return; }
  const c = t.paradas.map(p => byId.get(p.id).c), D = (a, b) => d3.geoDistance(c[a], c[b]);
  const order = [0], left = new Set([...Array(n).keys()].slice(1));
  while (left.size){
    const last = order[order.length - 1]; let best = -1, bd = Infinity;
    for (const j of left){ const d = D(last, j); if (d < bd){ bd = d; best = j; } }
    order.push(best); left.delete(best);
  }
  let improved = true, guard = 0;
  while (improved && guard++ < 300){
    improved = false;
    for (let i = 1; i < n - 1; i++) for (let k = i + 1; k < n; k++){
      const a = order[i - 1], b = order[i], cc = order[k], dd = k + 1 < n ? order[k + 1] : null;
      const antes = D(a, b) + (dd != null ? D(cc, dd) : 0), depois = D(a, cc) + (dd != null ? D(b, dd) : 0);
      if (depois < antes - 1e-12){ order.splice(i, k - i + 1, ...order.slice(i, k + 1).reverse()); improved = true; }
    }
  }
  const kmAntes = lineKm(t);
  t.paradas = order.map(i => t.paradas[i]); invalidateRoute(t); touchTrip(t);
  const kmDepois = lineKm(t);
  toast(kmDepois < kmAntes ? `Caminho organizado: <b>${fmtN(kmDepois)} km</b> em linha reta (antes eram ${fmtN(kmAntes)} km)` : "O caminho já estava na melhor ordem.", 4200);
}

/* "Traçar pela estrada": rota real (OSRM) + cidades por onde a estrada passa */
function simplifyLine(pts, tol){
  if (pts.length < 3) return pts.slice();
  const keep = new Uint8Array(pts.length); keep[0] = keep[pts.length - 1] = 1;
  const stack = [[0, pts.length - 1]];
  while (stack.length){
    const [a, b] = stack.pop(); let idx = -1, max = tol;
    const [ax, ay] = pts[a], [bx, by] = pts[b], dx = bx - ax, dy = by - ay, L = dx * dx + dy * dy || 1e-12;
    for (let i = a + 1; i < b; i++){
      const [px, py] = pts[i]; let u = ((px - ax) * dx + (py - ay) * dy) / L; u = Math.max(0, Math.min(1, u));
      const ex = ax + u * dx - px, ey = ay + u * dy - py, d = Math.sqrt(ex * ex + ey * ey);
      if (d > max){ max = d; idx = i; }
    }
    if (idx > 0){ keep[idx] = 1; stack.push([a, idx], [idx, b]); }
  }
  return pts.filter((_, i) => keep[i]);
}
let grid = null;
function buildGrid(){
  grid = new Map();
  feats.forEach((f, i) => {
    const [[x0, y0], [x1, y1]] = d3.geoBounds(f); f.bb = [x0, y0, x1, y1];
    for (let x = Math.floor(x0); x <= Math.floor(x1); x++) for (let y = Math.floor(y0); y <= Math.floor(y1); y++){
      const k = x * 1000 + y; let a = grid.get(k); if (!a) grid.set(k, a = []); a.push(i);
    }
  });
}
function municipioEm(pt, hint){
  if (hint != null && d3.geoContains(feats[hint], pt)) return hint;
  for (const i of grid.get(Math.floor(pt[0]) * 1000 + Math.floor(pt[1])) || []){
    const b = feats[i].bb;
    if (pt[0] < b[0] || pt[0] > b[2] || pt[1] < b[1] || pt[1] > b[3]) continue;
    if (d3.geoContains(feats[i], pt)) return i;
  }
  return null;
}
function municipiosNaLinha(line){
  if (!grid) buildGrid();
  const STEP = .008, out = [], seen = new Set();   // ~1 km entre amostras
  let hint = null, acc = STEP;
  const visit = (pt) => { const i = municipioEm(pt, hint); if (i == null) return; hint = i; const id = feats[i].id; if (!seen.has(id)){ seen.add(id); out.push(id); } };
  for (let s = 0; s < line.length; s++){
    if (s === 0){ visit(line[0]); continue; }
    const [x0, y0] = line[s - 1], [x1, y1] = line[s], L = Math.hypot(x1 - x0, y1 - y0);
    if (L > STEP){ const n = Math.ceil(L / STEP); for (let k = 1; k <= n; k++) visit([x0 + (x1 - x0) * k / n, y0 + (y1 - y0) * k / n]); acc = 0; }
    else { acc += L; if (acc >= STEP){ visit(line[s]); acc = 0; } }
  }
  return out;
}
const routeTimers = new Map();
function scheduleRoute(t, delay = 900){
  clearTimeout(routeTimers.get(t.id));
  if (t.paradas.length < 2){ t._rota = null; return; }
  t._rota = "calculando";
  routeTimers.set(t.id, setTimeout(() => traceRoad(t), delay));
}
function renderIfOpen(t){ if (view === "viagens" && tripSel === t.id) renderTrips(); if (planning === t.id) paintPlan(); }
/* a linha da OSRM passa exatamente pelas paradas: corta nelas para ter um trecho entre cada par */
function splitAtWaypoints(line, wps){
  const cuts = [0]; let from = 0;
  for (let w = 1; w < wps.length - 1; w++){
    const [wx, wy] = wps[w]; let best = from, bd = Infinity;
    for (let j = from; j < line.length; j++){
      const d = Math.hypot(line[j][0] - wx, line[j][1] - wy);
      if (d < bd){ bd = d; best = j; }
      if (d < 1e-5) break;
    }
    cuts.push(best); from = best;
  }
  cuts.push(line.length - 1);
  return cuts.slice(1).map((c, i) => line.slice(cuts[i], c + 1));
}
async function traceRoad(t, { manual = false } = {}){
  clearTimeout(routeTimers.get(t.id));
  if (t.paradas.length < 2){ t._rota = null; return true; }
  if (t.paradas.length > 90){ t._rota = "erro"; t._rotaMsg = "Para calcular o caminho pela estrada, use até 90 paradas."; renderIfOpen(t); return false; }
  const sig = t.paradas.map(p => p.id).join(","), mesmo = () => sig === t.paradas.map(p => p.id).join(",");
  t._rota = "calculando"; renderIfOpen(t);
  const ctrl = new AbortController(), timer = setTimeout(() => ctrl.abort(), 20000);
  try {
    const coords = t.paradas.map(p => byId.get(p.id).c.map(v => v.toFixed(5)).join(",")).join(";");
    const r = await fetch(`https://router.project-osrm.org/route/v1/driving/${coords}?overview=full&geometries=geojson`, { signal: ctrl.signal });
    const j = await r.json();
    if (!r.ok || j.code !== "Ok" || !j.routes?.length) throw new Error(j.message || j.code || String(r.status));
    if (!mesmo()) return false;                       // o roteiro mudou durante o cálculo: vale o próximo
    const rt = j.routes[0], line = rt.geometry.coordinates;
    const legs = splitAtWaypoints(line, j.waypoints.map(w => w.location));
    const paradas = new Set(t.paradas.map(p => p.id)), antigos = t.trechos || [];
    t.trechos = legs.map((leg, k) => ({ ids: municipiosNaLinha(leg).filter(id => !paradas.has(id)), criadas: antigos[k]?.criadas || [] }));
    t.caminho = [...new Set(t.trechos.flatMap(x => x.ids))].slice(0, 3000);
    let simples = simplifyLine(line, .01); if (simples.length > 2000) simples = simplifyLine(line, .04);
    t.rota = simples.map(([x, y]) => [+x.toFixed(4), +y.toFixed(4)]);
    t.km = Math.round(rt.distance / 1000); t.horas = Math.round(rt.duration / 360) / 10;
    t._rota = "ok"; t._rotaMsg = "";
    // trechos que chegam a paradas já concluídas: ela já passou por eles
    let extra = 0;
    t.paradas.forEach((p, i) => { if (i && p.feito) extra += markSegment(t, i - 1, p.data || today()); });
    if (extra) paintAll();
    touchTrip(t);
    if (manual) toast(`Caminho recalculado: <b>${fmtN(t.km)} km</b> pela estrada, passando por <b>${fmtN(t.caminho.length)}</b> cidades`, 4200);
    return true;
  } catch (e){
    console.warn("rota", e);
    if (mesmo()){
      t._rota = "erro"; t._rotaMsg = "Não consegui calcular o caminho pela estrada agora."; renderIfOpen(t);
      if (!manual) setTimeout(() => { if (t._rota === "erro" && mesmo()) traceRoad(t); }, 30000);   // tenta de novo sozinho
    }
    return false;
  } finally { clearTimeout(timer); }
}

/* ---------- tela "Viagens" ---------- */
const ICON_ROUTE = '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="6" cy="19" r="2"/><circle cx="18" cy="5" r="2"/><path d="M8 19h7.5a3.5 3.5 0 0 0 0-7h-7a3.5 3.5 0 0 1 0-7H16"/></svg>';
function tripMeta(t){
  const n = t.paradas.length, bits = [`${n} ${n === 1 ? "parada" : "paradas"}`];
  if (t.km) bits.push(`${fmtN(t.km)} km`); else if (n > 1) bits.push(`${fmtN(lineKm(t))} km em linha reta`);
  if (t.inicio) bits.push(fmtDate(t.inicio).slice(0, 5) + (t.fim ? " a " + fmtDate(t.fim).slice(0, 5) : ""));
  return bits.join(" · ");
}
function renderTrips(){
  if (!feats.length){ geoReady.then(renderTrips).catch(() => {}); return; }
  const cards = $("tripCards");
  if (!trips.length){
    cards.innerHTML = "";
    $("tripDetail").innerHTML = `<div class="empty trip-empty">${ICON_ROUTE}<b>Planeje sua próxima viagem</b><span>Escolha as cidades, organize o caminho e, quando voltar, marque tudo de uma vez.</span><button class="btn" type="button" id="tripNew2">+ Criar minha primeira viagem</button></div>`;
    $("tripNew2").onclick = newTrip;
    return;
  }
  if (!tripById(tripSel)) tripSel = trips[0].id;
  cards.innerHTML = trips.map(t => {
    const n = t.paradas.length, done = t.paradas.filter(p => p.feito).length;
    return `<button class="tcard ${t.id === tripSel ? "on" : ""}" data-id="${t.id}" type="button">
      <span class="tstatus s-${t.status}">${STATUS[t.status]}</span><b>${esc(t.nome)}</b><small>${esc(tripMeta(t))}</small>
      <span class="bar"><i style="width:${n ? (done / n * 100).toFixed(1) : 0}%"></i></span></button>`;
  }).join("");
  cards.querySelectorAll(".tcard").forEach(b => b.onclick = () => {
    tripSel = b.dataset.id; renderTrips();
    if (matchMedia("(max-width:900px)").matches) $("tripDetail").scrollIntoView({ behavior: "smooth", block: "start" });
  });
  renderTripDetail(tripById(tripSel));
}
function renderTripDetail(t){
  // o caminho pode terminar de ser calculado enquanto ela digita: guarda o que está sendo digitado e o cursor
  const ae = document.activeElement, focoId = ae && ["tripNome", "tripNotas", "tripAdd"].includes(ae.id) ? ae.id : null;
  const cursor = focoId ? [ae.selectionStart, ae.selectionEnd] : null, digitando = $("tripAdd")?.value || "";
  const n = t.paradas.length, done = t.paradas.filter(p => p.feito).length;
  const novas = t.paradas.filter(p => !V[p.id]).length + t.caminho.filter(id => !V[id]).length;
  const km = n < 2 ? ""
    : t._rota === "erro" ? `<span class="warn">${esc(t._rotaMsg || "Caminho pela estrada não calculado.")} <button type="button" class="linkbtn" id="tripRetry">Tentar de novo</button></span>`
    : (t.trechos || []).length && t.km ? `<span><b>${fmtN(t.km)} km</b> pela estrada${t.horas ? ` · ≈ ${String(t.horas).replace(".", ",")} h` : ""}</span>`
    : `<span class="busy">Calculando o caminho pela estrada…</span>`;
  const prevKm = (i) => i ? Math.round(d3.geoDistance(byId.get(t.paradas[i - 1].id).c, byId.get(t.paradas[i].id).c) * 6371) : 0;
  $("tripDetail").innerHTML = `
    <div class="tdet-h">
      <input class="tname" id="tripNome" maxlength="60" value="${esc(t.nome)}" aria-label="Nome da viagem">
      <span class="tstatus s-${t.status}">${STATUS[t.status]}</span>
    </div>
    <div class="grid2">
      <label class="field"><span>Saída</span><input class="input" type="date" id="tripIni" value="${esc(t.inicio || "")}"></label>
      <label class="field"><span>Volta</span><input class="input" type="date" id="tripFim" value="${esc(t.fim || "")}"></label>
    </div>
    <div class="tprev"><canvas id="tripCanvas" aria-label="Prévia do roteiro"></canvas>
      <button class="pill" type="button" id="tripMapBtn">${ico("map", 16)} Escolher cidades no mapa</button></div>
    <div class="tsum">
      <span><b>${n}</b> ${n === 1 ? "parada" : "paradas"}</span>${km}
      ${t.caminho.length ? `<span><b>+${fmtN(t.caminho.length)}</b> no caminho</span>` : ""}
      ${novas ? `<span class="hot"><b>${fmtN(novas)}</b> ${novas === 1 ? "cidade nova" : "cidades novas"} para o mapa</span>` : ""}
    </div>
    <div class="tadd citypick"><input class="input" id="tripAdd" autocomplete="off" placeholder="Adicionar parada: digite o nome da cidade"><ul id="tripAddRes" hidden></ul></div>
    <div class="btnrow tools">
      <button class="btn ghost sm" type="button" id="tripOrg" ${n < 3 ? "disabled" : ""}>Organizar o caminho</button>
      <button class="btn ghost sm" type="button" id="tripRoad" ${n < 2 ? "disabled" : ""}>Recalcular caminho</button>
    </div>
    ${n ? `<ol class="stops">${t.paradas.map((p, i) => `
      <li class="tstop ${p.feito ? "done" : ""}">
        <button type="button" class="chk" data-a="tog" data-i="${i}" aria-pressed="${p.feito}" aria-label="${p.feito ? "Desmarcar" : "Marcar"} ${esc(stopName(p.id))} como concluída"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6 9 17l-5-5"/></svg></button>
        <span class="sn">${i + 1}</span>
        <span class="sname"><b>${esc(stopName(p.id))}</b><span class="uf">${stopUf(p.id)}</span>
          <small>${i ? `+${fmtN(prevKm(i))} km${(t.trechos || [])[i - 1]?.ids.length ? ` · ${fmtN(t.trechos[i - 1].ids.length)} cidades no caminho` : ""}` : "Partida"}${p.feito && p.data ? ` · concluída em ${fmtDate(p.data)}` : !p.feito && V[p.id] ? " · você já passou aqui" : ""}</small></span>
        <span class="sacts">
          <button type="button" data-a="up" data-i="${i}" ${i ? "" : "disabled"} aria-label="Subir">↑</button>
          <button type="button" data-a="down" data-i="${i}" ${i < n - 1 ? "" : "disabled"} aria-label="Descer">↓</button>
          <button type="button" data-a="del" data-i="${i}" aria-label="Tirar do roteiro">✕</button>
        </span>
      </li>`).join("")}</ol>`
    : `<div class="hint">Comece adicionando a cidade de partida. Dá para buscar pelo nome aqui em cima ou tocar no mapa.</div>`}
    ${t.caminho.length ? `<details class="via"><summary>${fmtN(t.caminho.length)} cidades no caminho pela estrada</summary>
      <div class="via-list">${t.caminho.map(id => `<span class="${V[id] ? "seen" : ""}">${esc(stopName(id))} <i>${stopUf(id)}</i></span>`).join("")}</div></details>` : ""}
    <label class="field"><span>Anotações da viagem</span><textarea class="input" id="tripNotas" rows="3" maxlength="1000" placeholder="Hotéis, postos, amigos para visitar…">${esc(t.notas || "")}</textarea></label>
    <div class="tfoot">
      ${t.status === "concluida"
        ? `<button class="btn ghost" type="button" id="tripReopen">Reabrir viagem</button>`
        : `<button class="btn" type="button" id="tripDone" ${n ? "" : "disabled"}>${done && done < n ? `Concluir viagem (${done}/${n})` : "Concluir viagem"}</button>`}
      <button class="btn ghost danger-text" type="button" id="tripDel">Excluir</button>
    </div>`;
  // campos que não redesenham a tela (para não perder o foco ao digitar)
  const cardOf = () => $("tripCards").querySelector(`.tcard[data-id="${t.id}"]`);
  $("tripNome").oninput = (e) => { t.nome = e.target.value.slice(0, 60); const c = cardOf(); if (c) c.querySelector("b").textContent = t.nome || "Nova viagem"; touchTrip(t, false); };
  $("tripNotas").oninput = (e) => { t.notas = e.target.value.slice(0, 1000); touchTrip(t, false); };
  $("tripIni").onchange = (e) => { t.inicio = e.target.value || null; touchTrip(t); };
  $("tripFim").onchange = (e) => { t.fim = e.target.value || null; touchTrip(t); };
  cityPicker($("tripAdd"), $("tripAddRes"), (id) => {
    const el = $("tripAdd"); if (el) el.value = "";
    if (addStop(t, id)) toast(`<b>${esc(stopName(id))}</b> entrou como parada ${t.paradas.length}`);
    setTimeout(() => $("tripAdd")?.focus(), 30);
  });
  if (digitando) $("tripAdd").value = digitando;
  if (focoId){
    const el = $(focoId); el.focus();
    try { if (cursor && cursor[0] != null) el.setSelectionRange(cursor[0], cursor[1]); } catch {}
    if (focoId === "tripAdd" && digitando) el.dispatchEvent(new Event("input"));   // reabre a lista de sugestões
  }
  $("tripMapBtn").onclick = () => startPlanning(t.id);
  $("tripCanvas").onclick = () => startPlanning(t.id);
  $("tripOrg").onclick = () => organizeRoute(t);
  $("tripRoad").onclick = () => traceRoad(t, { manual: true });
  $("tripRetry")?.addEventListener("click", () => traceRoad(t, { manual: true }));
  if (n >= 2 && !(t.trechos || []).length && !t._rota) scheduleRoute(t, 300);   // viagem salva sem caminho: calcula agora
  $("tripDone")?.addEventListener("click", () => completeTrip(t));
  $("tripReopen")?.addEventListener("click", () => reopenTrip(t));
  $("tripDel").onclick = () => deleteTrip(t);
  $("tripDetail").querySelectorAll(".stops [data-a]").forEach(b => b.onclick = () => {
    const i = +b.dataset.i;
    if (b.dataset.a === "tog") toggleStop(t, i);
    if (b.dataset.a === "up") moveStop(t, i, -1);
    if (b.dataset.a === "down") moveStop(t, i, 1);
    if (b.dataset.a === "del") removeStop(t, i);
  });
  requestAnimationFrame(() => drawTripPreview(t, $("tripCanvas")));
}
/* prévia: estados, cidades do caminho, rota e paradas numeradas */
function drawTripPreview(t, cv){
  if (!cv) return;
  const box = cv.getBoundingClientRect(), dpr = Math.min(devicePixelRatio || 1, 2), W = box.width, H = box.height;
  if (!W || !H) return;
  cv.width = W * dpr; cv.height = H * dpr;
  const ctx = cv.getContext("2d"); ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  const css = getComputedStyle(document.documentElement), cor = (v) => css.getPropertyValue(v).trim();
  ctx.fillStyle = cor("--sea"); ctx.fillRect(0, 0, W, H);
  const line = t.paradas.length ? tripLine(t) : null;
  let foco = { type: "FeatureCollection", features: feats };
  if (line){
    const xs = line.map(p => p[0]), ys = line.map(p => p[1]);
    const padX = Math.max(1.2, (Math.max(...xs) - Math.min(...xs)) * .25), padY = Math.max(1.2, (Math.max(...ys) - Math.min(...ys)) * .25);
    foco = { type: "LineString", coordinates: [[Math.min(...xs) - padX, Math.min(...ys) - padY], [Math.max(...xs) + padX, Math.max(...ys) + padY]] };
  }
  const pr = d3.geoMercator().fitExtent([[14, 14], [W - 14, H - 14]], foco), gp = d3.geoPath(pr, ctx);
  ctx.fillStyle = cor("--land"); ctx.beginPath(); gp({ type: "FeatureCollection", features: feats }); ctx.fill();
  ctx.fillStyle = cor("--accent"); ctx.globalAlpha = .55;
  for (const id in V){ const f = byId.get(id); if (f){ ctx.beginPath(); gp(f); ctx.fill(); } }
  ctx.globalAlpha = 1;
  ctx.fillStyle = cor("--road"); ctx.globalAlpha = .45;
  for (const id of t.caminho){ ctx.beginPath(); gp(byId.get(id)); ctx.fill(); }
  ctx.globalAlpha = 1;
  ctx.strokeStyle = cor("--uf-stroke"); ctx.lineWidth = 1; ctx.beginPath(); gp(ufMeshGeo()); ctx.stroke();
  if (!line) return;
  if (line.length > 1){
    ctx.lineCap = "round"; ctx.lineJoin = "round";
    ctx.strokeStyle = "rgba(20,30,26,.35)"; ctx.lineWidth = 6; ctx.beginPath(); gp({ type: "LineString", coordinates: line }); ctx.stroke();
    ctx.strokeStyle = cor("--road"); ctx.lineWidth = 2.5; ctx.setLineDash(t.rota ? [7, 6] : [2, 6]); ctx.beginPath(); gp({ type: "LineString", coordinates: line }); ctx.stroke(); ctx.setLineDash([]);
  }
  ctx.font = '800 11px "Barlow Condensed", sans-serif'; ctx.textAlign = "center"; ctx.textBaseline = "middle";
  t.paradas.forEach((p, i) => {
    const [x, y] = pr(byId.get(p.id).c);
    ctx.beginPath(); ctx.arc(x, y, 9, 0, Math.PI * 2); ctx.fillStyle = p.feito ? cor("--good") : cor("--road"); ctx.fill();
    ctx.lineWidth = 2; ctx.strokeStyle = "#fff"; ctx.stroke();
    ctx.fillStyle = p.feito ? "#fff" : "#1B2521"; ctx.fillText(String(i + 1), x, y + .5);
  });
}

/* ---------- modo planejamento no mapa principal ---------- */
function startPlanning(id){
  const t = tripById(id); if (!t) return;
  if (other) endCompare();
  closeCard(); quick = false; $("quick").setAttribute("aria-pressed", false);
  planning = id; showView("mapa");
  $("planBar").hidden = false; $("quick").hidden = true;
  $("legend").innerHTML = `<span><i class="sw s"></i>Parada</span><span><i class="sw c"></i>No caminho</span><span><i class="sw v"></i>Já passei</span>`;
  $("planTxt").innerHTML = `Planejando <b>${esc(t.nome)}</b>: toque nas cidades para incluir ou tirar do roteiro`;
  paintPlan();
  afterLayout(() => {
    drawTripOverlay();
    if (t.paradas.length){ const l = tripLine(t); flyTo({ type: "LineString", coordinates: l.length > 1 ? l : [l[0], l[0]] }, 12); }
  });
}
function endPlanning(goBack = true){
  const id = planning; planning = null; $("planBar").hidden = true; $("quick").hidden = isAdmin(); resetLegend();
  paintAll(); drawTripOverlay();
  if (goBack && id){ tripSel = id; showView("viagens"); }
}
function planToggle(id){
  const t = tripById(planning); if (!t) return;
  const i = t.paradas.findIndex(p => p.id === id);
  if (i >= 0){ removeStop(t, i); toast(`<b>${esc(stopName(id))}</b> saiu do roteiro`); }
  else if (addStop(t, id)) toast(`<b>${esc(stopName(id))}</b> entrou como parada ${t.paradas.length}`);
}
function paintPlan(){ paintAll(); drawTripOverlay(); }
function renderPlanSide(){
  const t = tripById(planning); if (!t) return;
  $("sideH").textContent = `Paradas da viagem · ${t.paradas.length}`;
  $("ufList").innerHTML = (t.paradas.length ? "" : `<div class="hint">Toque numa cidade do mapa para ela entrar no roteiro. Toque de novo para tirar.</div>`) +
    t.paradas.map((p, i) => `<div class="row plan-row"><span class="sn">${i + 1}</span><span><div class="nm">${esc(stopName(p.id))}</div><small class="muted">${stopUf(p.id)}${i ? ` · +${fmtN(Math.round(d3.geoDistance(byId.get(t.paradas[i - 1].id).c, byId.get(p.id).c) * 6371))} km` : " · partida"}</small></span>
      <button class="x-btn" type="button" data-i="${i}" aria-label="Tirar ${esc(stopName(p.id))} do roteiro">✕</button></div>`).join("");
  $("ufList").querySelectorAll(".x-btn").forEach(b => b.onclick = () => removeStop(t, +b.dataset.i));
}
let routeBase, routeDash, gMarks;
/* o mapa só ganha tamanho quando fica visível; espera a medida antes de desenhar */
function afterLayout(fn, tries = 30){
  if (W && typeof path === "function") return fn();
  if (mapLayout) mapLayout();
  if (W && typeof path === "function") return fn();
  if (tries > 0) setTimeout(() => afterLayout(fn, tries - 1), 100);
}
function drawTripOverlay(){
  if (!mapReady || !routeBase || typeof path !== "function" || typeof proj !== "function") return;
  const t = planning ? tripById(planning) : null;
  if (!t || !t.paradas.length){ routeBase.attr("d", null); routeDash.attr("d", null); gMarks.selectAll("*").remove(); return; }
  const d = t.paradas.length > 1 ? path({ type: "LineString", coordinates: tripLine(t) }) : null;
  routeBase.attr("d", d); routeDash.attr("d", d).classed("reta", !t.rota);
  const sel = gMarks.selectAll("g.mk").data(t.paradas.map((p, i) => ({ p, i, xy: proj(byId.get(p.id).c) })), d => d.p.id);
  sel.exit().remove();
  const ent = sel.enter().append("g").attr("class", "mk");
  ent.append("circle").attr("r", 11); ent.append("text");
  sel.merge(ent).classed("feito", d => d.p.feito).each(function(d){ d3.select(this).select("text").text(d.i + 1); });
  placeMarks();
}
function placeMarks(){
  if (!gMarks) return;
  gMarks.selectAll("g.mk").attr("transform", d => { const [x, y] = curT.apply(d.xy); return `translate(${x},${y})`; });
}
$("tripNew").onclick = newTrip;
$("planDone").onclick = () => endPlanning(true);

/* ---------- ranking ---------- */
const rf = { genero: "", periodo: "" };
pressGroup($("rGenero"), "genero", rf); pressGroup($("rPeriodo"), "periodo", rf);
$("rGenero").addEventListener("click", (e) => { if (e.target.closest("[data-v]")) loadRanking(); });
$("rPeriodo").addEventListener("click", (e) => { if (e.target.closest("[data-v]")) loadRanking(); });
async function loadRanking(){
  const box = $("rankBox");
  box.innerHTML = `<div class="loading" style="position:static;padding:40px">Carregando o ranking…<div class="road-anim"></div></div>`;
  let desde = null; const d = new Date();
  if (rf.periodo === "ano") desde = `${d.getFullYear()}-01-01`;
  if (rf.periodo === "mes") desde = `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,"0")}-01`;
  await flush();
  const { data, error } = await sb.rpc("ranking", { p_genero: rf.genero || null, p_desde: desde });
  if (error){ box.innerHTML = `<div class="empty">Não consegui carregar o ranking. Verifique a internet.</div>`; return; }
  if (!data.length){ box.innerHTML = `<div class="empty">Ninguém marcou cidades nesse período ainda.<br>Que tal ser a primeira pessoa?</div>`; return; }
  const top = data.slice(0, 3), rest = data.slice(3);
  const sub = (r) => `${r.estados} ${r.estados === 1 ? "estado" : "estados"} · ${r.capitais} ${r.capitais === 1 ? "capital" : "capitais"}`;
  const pod = (r, i) => r ? `<button class="pod p${i} ${r.eh_voce ? "me" : ""}" data-id="${r.user_id}" data-nome="${esc(r.nome)}" style="border:0;background:none">
      ${avatar(r.user_id, r.nome)}<span class="nm">${esc(r.nome)}${r.eh_voce ? " (você)" : ""}</span><span class="ct">${fmtN(r.cidades)} cidades</span><span class="step">${r.posicao}º</span></button>` : "<span></span>";
  box.innerHTML = `<div class="podium">${pod(top[1],2)}${pod(top[0],1)}${pod(top[2],3)}</div>
    <div class="rlist">${rest.map(r => `<button class="ritem ${r.eh_voce ? "me" : ""}" data-id="${r.user_id}" data-nome="${esc(r.nome)}">
      <span class="pos">${r.posicao}º</span>${avatar(r.user_id, r.nome)}
      <span><b>${esc(r.nome)}${r.eh_voce ? " (você)" : ""}</b><small>${esc(papelDe(r))}${r.moto ? " · " + esc(r.moto) : ""} · ${sub(r)}</small></span>
      <span class="sc num">${fmtN(r.cidades)}<small>cidades</small></span></button>`).join("")}</div>
    ${isAdmin() || data.some(r => r.eh_voce) ? "" : `<p class="muted" style="text-align:center;margin-top:16px">Você ainda não aparece aqui${profile.aparece_ranking ? ": marque cidades para entrar no ranking." : " porque escolheu ficar fora do ranking (dá para mudar no Perfil)."}</p>`}`;
  box.querySelectorAll("[data-id]").forEach(b => b.onclick = () => compareWith(b.dataset.id, b.dataset.nome));
}

/* ---------- perfil ---------- */
const pfCity = cityPicker($("pfCidade"), $("pfCidadeRes"));
function fillProfile(){
  $("pfNome").value = profile.nome; $("pfGenero").value = profile.genero; $("pfPapel").value = profile.papel;
  $("pfEstilo").value = profile.estilo; $("pfMoto").value = profile.moto || ""; $("pfDesde").value = profile.pilota_desde || "";
  $("pfRanking").checked = profile.aparece_ranking; pfCity.set(profile.cidade_id);
  $("pfErr").textContent = ""; $("pwErr").textContent = "";
  const c = store.get(`por:${me.id}:recuperacao`) === "feito" ? null : oldDeviceCopies(me.id)[0];
  $("recBtn").hidden = !c;
  if (c) $("recBtn").textContent = `Trazer ${fmtN(c.n)} cidades guardadas neste aparelho`;
  renderPassport();
}
function renderPassport(){
  const s = stats(), lv = levelOf(s.n), got = BADGES.filter(b => s[b.m] >= b.goal).length;
  const facts = [papelDe(profile), profile.moto, ESTILO[profile.estilo], profile.pilota_desde ? `Na estrada desde ${profile.pilota_desde}` : "", profile.cidade_id ? `Parte de ${cityLabel(profile.cidade_id)}` : ""].filter(Boolean);
  $("passport").innerHTML = `${avatar(me.id, profile.nome)}
    <div><span class="kicker">Nível ${lv.idx+1} · ${esc(lv.title)}</span><h2>${esc(profile.nome)}</h2>
      <div class="meta">${esc(me.email)} · na estrada com a gente desde ${new Date(profile.criado_em || Date.now()).toLocaleDateString("pt-BR")}</div>
      <div class="facts">${facts.map(f => `<span>${esc(f)}</span>`).join("")}</div></div>
    <div class="nums"><div><b class="num">${fmtN(s.n)}</b><span>cidades</span></div><div><b class="num">${s.ufs}</b><span>estados</span></div><div><b class="num">${got}</b><span>conquistas</span></div></div>`;
}
$("profForm").addEventListener("submit", async (e) => {
  e.preventDefault();
  const upd = {
    nome: $("pfNome").value.trim(), genero: $("pfGenero").value, papel: $("pfPapel").value, estilo: $("pfEstilo").value,
    moto: $("pfMoto").value.trim() || null, pilota_desde: $("pfDesde").value ? +$("pfDesde").value : null,
    cidade_id: $("pfCidade").value.trim() ? ($("pfCidade").dataset.id || profile.cidade_id || null) : null,
    aparece_ranking: $("pfRanking").checked,
  };
  if (upd.nome.length < 2){ $("pfErr").textContent = "O nome precisa ter pelo menos 2 letras."; return; }
  const { data, error } = await sb.from("profiles").update(upd).eq("id", me.id).select().single();
  if (error){ $("pfErr").textContent = authMsg(error); return; }
  profile = data; renderMe(); paintAll(); renderPassport(); toast("Perfil salvo.");
});
$("pwForm").addEventListener("submit", async (e) => {
  e.preventDefault();
  const password = $("pwNew").value;
  if (password.length < 6){ $("pwErr").textContent = "A senha precisa ter pelo menos 6 caracteres."; return; }
  const { error } = await sb.auth.updateUser({ password });
  if (error){ $("pwErr").textContent = authMsg(error); return; }
  $("pwNew").value = ""; $("pwErr").textContent = ""; toast("Senha trocada.");
});
$("logoutBtn").onclick = async () => { await flush(); await sb.auth.signOut(); };
$("delMeBtn").onclick = () => modal({
  title: "Excluir sua conta?",
  body: `<p style="margin:0">Isso apaga <b>para sempre</b> sua conta e as ${fmtN(Object.keys(V).length)} cidades marcadas. Não dá para desfazer.</p>
         <label class="field"><span>Para confirmar, digite EXCLUIR</span><input class="input" id="delConf" autocomplete="off"></label>`,
  actions: [{ label: "Cancelar", cls: "ghost" }, { label: "Excluir para sempre", cls: "danger", onClick: async () => {
    if ($("delConf").value.trim().toUpperCase() !== "EXCLUIR") throw new Error("Digite EXCLUIR para confirmar.");
    const { error } = await sb.rpc("excluir_minha_conta"); if (error) throw new Error(authMsg(error));
    store.del(vKey()); store.del(qKey()); await sb.auth.signOut();
  }}],
});
function mergeCopy(src){
  let added = 0;
  for (const [id, val] of Object.entries(src)){
    if (!byId.has(id) || V[id]) continue;
    V[id] = { d: /^\d{4}-\d{2}-\d{2}$/.test(val?.d || "") ? val.d : "", n: String(val?.n || "").slice(0, 280) };
    Q[id] = { op: "up", d: V[id].d || null, n: V[id].n || null }; added++;
  }
  saveLocal(); flush(); paintAll();
  return added;
}
$("impFile").onchange = async (e) => {
  const file = e.target.files[0]; if (!file) return;
  try {
    const d = JSON.parse(await file.text()); const src = d?.v;
    if (!src || typeof src !== "object") throw 0;
    toast(`Cópia importada: <b>${mergeCopy(src)}</b> cidades novas na sua conta`, 4000);
  } catch { toast("Esse arquivo não é uma cópia do Por Onde Rodei", 3500); }
  e.target.value = "";
};
/* cidades que ficaram guardadas neste navegador antes da mudança de servidor */
async function recoverFromDevice(c){
  await geoReady.catch(() => {});
  const added = mergeCopy(c.v);
  store.set(`por:${me.id}:recuperacao`, "feito");
  if (view === "perfil") fillProfile();
  burst(innerWidth / 2, innerHeight / 3);
  toast(`Pronto! <b>${fmtN(added)}</b> cidades de volta na sua conta`, 4500);
}
function offerRecovery(c){
  modal({ title: "Achamos suas cidades!",
    body: `<p style="margin:0">Este navegador guardou <b>${fmtN(c.n)} cidades</b> que você marcou antes da mudança de servidor do site. Quer trazer todas para esta conta?</p>
           <p class="muted" style="margin:0">As datas e as lembranças vêm junto.</p>`,
    actions: [
      { label: "Agora não", cls: "ghost", onClick: () => { store.set(`por:${me.id}:recuperacao`, "depois"); } },
      { label: `Trazer ${fmtN(c.n)} cidades`, onClick: () => recoverFromDevice(c) },
    ] });
}
$("recBtn").onclick = () => { const c = oldDeviceCopies(me.id)[0]; if (c) offerRecovery(c); };
$("expBtn").onclick = () => download(`por-onde-rodei-${today()}.json`, JSON.stringify({ app: "por-onde-rodei", salvoEm: new Date().toISOString(), v: V }, null, 1));

/* ---------- administração ---------- */
let admRows = [], heat = null, heatMax = 1;
$("admReload").onclick = () => loadAdmin(true);
$("admQ").addEventListener("input", () => renderUsuarios());
async function loadAdmin(show = false){
  if (!isAdmin()) return;
  const [u, m] = await Promise.all([sb.rpc("admin_usuarios"), sb.rpc("admin_mapa_geral")]);
  if (u.error){ toast("Não consegui carregar os dados do painel."); return; }
  admRows = u.data || [];
  heat = new Map((m.data || []).map(r => [r.municipio_id, { pessoas: r.pessoas, nomes: r.nomes || [] }]));
  heatMax = Math.max(1, ...[...heat.values()].map(h => h.pessoas));
  setShield(admRows.filter(r => !r.is_admin).length);
  resetLegend(); paintAll();
  if (view === "painel") renderPainel();
  if (view === "usuarios") renderUsuarios();
  if (show) toast("Dados atualizados.");
}

/* mapa geral: quantas pessoas passaram por cada cidade */
function paintAdminMap(){
  if (mapReady){
    for (const [id, el] of pathEl){
      el.classList.remove("v");
      const o = !!other?.set.has(id);
      if (el.classList.contains("o") !== o) el.classList.toggle("o", o);
      const h = !other && heat?.get(id);
      const col = h ? heatColor(h.pessoas) : "";
      if (el.style.fill !== col){ el.style.fill = col; el.style.stroke = col; }
    }
    homePath?.attr("d", null);
  }
  const ids = heat ? [...heat.keys()].filter(id => byId.has(id)) : [];
  const ufs = new Set(ids.map(id => byId.get(id).properties.uf));
  const area = ids.reduce((a, id) => a + byId.get(id).area, 0);
  const marcas = heat ? [...heat.values()].reduce((a, h) => a + h.pessoas, 0) : 0;
  $("sMun").textContent = fmtN(ids.length); $("sMunL").textContent = "cidades com visitas";
  $("sUf").textContent = ufs.size; $("sUfL").textContent = "estados de 27";
  $("sCap").textContent = ids.filter(id => CAPS.has(id)).length; $("sCapL").textContent = "capitais de 27";
  $("sKm").textContent = fmtN(marcas); $("sKmL").textContent = "marcações no total";
  const pct = totalArea ? area / totalArea * 100 : 0;
  $("pctL").textContent = "Brasil coberto pela turma";
  $("pct").textContent = (pct < 1 && pct > 0 ? pct.toFixed(2) : pct.toFixed(1)).replace(".", ",") + "%";
  $("pctBar").style.width = Math.max(pct, ids.length ? .8 : 0) + "%";
  $("sideH").textContent = "Cidades mais visitadas";
  const top = ids.sort((a,b) => heat.get(b).pessoas - heat.get(a).pessoas || byId.get(a).properties.n.localeCompare(byId.get(b).properties.n)).slice(0, 40);
  $("ufList").innerHTML = top.length ? top.map((id, i) => { const p = byId.get(id).properties, h = heat.get(id);
    return `<button class="row" data-id="${id}"><span class="sg">${p.uf}</span><span><div class="nm">${esc(p.n)}</div><div class="mini"><i style="width:${(h.pessoas/heatMax*100).toFixed(1)}%;background:${heatColor(h.pessoas)}"></i></div></span><span class="ct num">${h.pessoas} ${h.pessoas === 1 ? "pessoa" : "pessoas"}</span></button>`; }).join("")
    : `<div class="hint">Assim que alguém marcar uma cidade, ela aparece aqui.</div>`;
  $("ufList").querySelectorAll(".row").forEach(b => b.onclick = () => { if (matchMedia("(max-width:900px)").matches) $("wrap").scrollIntoView({ behavior: "smooth" }); select(b.dataset.id); flyTo(byId.get(b.dataset.id), 25); });
}

/* visão geral */
function renderPainel(){
  const day = 864e5, now = Date.now();
  const users = admRows.filter(r => !r.is_admin), admins = admRows.length - users.length;
  const tot = users.length, marks = users.reduce((a,r) => a + r.cidades, 0);
  const novos = users.filter(r => now - new Date(r.criado_em) < 7*day).length;
  const ativos = users.filter(r => r.ultimo_acesso && now - new Date(r.ultimo_acesso) < 7*day).length;
  const usam = users.filter(r => r.cidades > 0).length;
  $("admKpis").innerHTML = `
    <div class="kpi"><b class="num">${fmtN(tot)}</b><span>${tot === 1 ? "usuário" : "usuários"}</span>${novos ? `<em>+${novos} nesta semana</em>` : `<em style="color:var(--muted)">${admins} ${admins === 1 ? "administrador" : "administradores"}</em>`}</div>
    <div class="kpi"><b class="num">${fmtN(ativos)}</b><span>entraram nos últimos 7 dias</span></div>
    <div class="kpi"><b class="num">${fmtN(marks)}</b><span>cidades marcadas</span></div>
    <div class="kpi"><b class="num">${tot ? Math.round(usam / tot * 100) : 0}%</b><span>já marcaram alguma cidade</span></div>`;
  // cadastros nos últimos 30 dias
  const days = [...Array(30)].map((_, i) => { const d = new Date(now - (29 - i) * day); return d.toISOString().slice(0,10); });
  const perDay = Object.fromEntries(days.map(d => [d, 0]));
  users.forEach(r => { const d = String(r.criado_em).slice(0,10); if (d in perDay) perDay[d]++; });
  const maxD = Math.max(1, ...Object.values(perDay)), CW = 600, CH = 170, bw = CW / 30;
  const chart = `<svg viewBox="0 0 ${CW} ${CH + 22}" role="img" aria-label="Contas novas por dia nos últimos 30 dias">
    <line x1="0" x2="${CW}" y1="${CH}" y2="${CH}" stroke="var(--line)"/>
    ${[.25,.5,.75,1].map(t => `<line x1="0" x2="${CW}" y1="${CH - t*(CH-16)}" y2="${CH - t*(CH-16)}" stroke="var(--line)" stroke-dasharray="3 5"/>`).join("")}
    ${days.map((d, i) => { const h = perDay[d] / maxD * (CH - 16); return perDay[d] === 0 ? `<rect x="${i*bw + 3}" y="${CH - 3}" width="${bw - 6}" height="3" rx="1.5" fill="var(--line)"><title>${fmtDate(d)}: 0</title></rect>` : `<rect x="${i*bw + 3}" y="${CH - h}" width="${bw - 6}" height="${Math.max(h, 2)}" rx="3" fill="var(--accent)"><title>${fmtDate(d)}: ${perDay[d]}</title></rect>${perDay[d] ? `<text x="${i*bw + bw/2}" y="${CH - h - 4}" text-anchor="middle">${perDay[d]}</text>` : ""}`; }).join("")}
    <text x="0" y="${CH + 16}">${fmtDate(days[0]).slice(0,5)}</text><text x="${CW}" y="${CH + 16}" text-anchor="end">hoje</text></svg>`;
  const split = (key, labels, colors) => {
    const c = {}; users.forEach(r => c[r[key]] = (c[r[key]] || 0) + 1);
    const ks = Object.keys(labels).filter(k => c[k]);
    return `<div class="split"><div class="gbar">${ks.map(k => `<i style="width:${c[k]/Math.max(tot,1)*100}%;background:${colors[k]}" title="${labels[k]}: ${c[k]}"></i>`).join("")}</div>
      <div class="lbls">${ks.map(k => `<span><i class="dot" style="background:${colors[k]};border-color:${colors[k]}"></i>${labels[k]} <b>${c[k]}</b></span>`).join("") || '<span class="muted">Sem dados ainda</span>'}</div></div>`;
  };
  const gcol = { mulher:"var(--accent)", homem:"var(--other)", outro:"var(--both)", nao_informado:"var(--silver)" };
  const pcol = { piloto:"var(--sign)", garupa:"var(--road)", os_dois:"var(--both)" };
  const topUsers = [...users].sort((a,b) => b.cidades - a.cidades).slice(0, 6);
  const topCities = heat ? [...heat.entries()].filter(([id]) => byId.has(id)).sort((a,b) => b[1].pessoas - a[1].pessoas).slice(0, 6) : [];
  const recentes = [...users].sort((a,b) => new Date(b.criado_em) - new Date(a.criado_em)).slice(0, 6);
  $("dash").innerHTML = `
    <div class="panel wide chart"><div class="panel-h"><h3>Contas novas</h3><p class="muted">Últimos 30 dias</p></div>${chart}</div>
    <div class="panel narrow"><div class="panel-h"><h3>Quem usa</h3></div>
      <div class="stack"><div><div class="field"><span>Gênero</span></div>${split("genero", GENERO, gcol)}</div>
      <div><div class="field"><span>Na moto</span></div>${split("papel", { piloto:"Pilotam", garupa:"Garupa", os_dois:"Os dois" }, pcol)}</div></div></div>
    <div class="panel narrow"><div class="panel-h"><h3>Quem mais roda</h3></div>
      <ol class="toplist">${topUsers.map((r,i) => `<li data-uid="${r.id}"><span class="n">${i+1}</span><span><b>${esc(r.nome)}</b><br><small>${esc(papelDe(r))}${r.moto ? " · " + esc(r.moto) : ""}</small></span><span class="v num">${fmtN(r.cidades)}</span></li>`).join("") || '<li class="muted">Ninguém ainda</li>'}</ol></div>
    <div class="panel narrow"><div class="panel-h"><h3>Cidades favoritas</h3></div>
      <ol class="toplist">${topCities.map(([id,h],i) => `<li data-cid="${id}"><span class="n">${i+1}</span><span><b>${esc(byId.get(id).properties.n)}</b><br><small>${esc(UFN[byId.get(id).properties.uf])}</small></span><span class="v num">${h.pessoas}</span></li>`).join("") || '<li class="muted">Nenhuma cidade marcada ainda</li>'}</ol></div>
    <div class="panel narrow"><div class="panel-h"><h3>Chegaram agora</h3></div>
      <ol class="toplist">${recentes.map(r => `<li data-uid="${r.id}"><span>${avatar(r.id, r.nome)}</span><span><b>${esc(r.nome)}</b><br><small>${ago(r.criado_em).replace("agora há pouco","hoje")}</small></span><span class="v num">${fmtN(r.cidades)}</span></li>`).join("") || '<li class="muted">Ninguém ainda</li>'}</ol></div>`;
  $("dash").querySelectorAll("[data-uid]").forEach(li => li.onclick = () => { const r = admRows.find(x => x.id === li.dataset.uid); if (r) compareWith(r.id, r.nome); });
  $("dash").querySelectorAll("[data-cid]").forEach(li => li.onclick = () => { showView("mapa"); select(li.dataset.cid); setTimeout(() => flyTo(byId.get(li.dataset.cid), 25), 60); });
}

/* lista de usuários */
function renderUsuarios(){
  const q = norm($("admQ").value || "");
  const rows = admRows.filter(r => !q || norm(r.nome).includes(q) || norm(r.email || "").includes(q));
  $("admRows").innerHTML = rows.map(r => `<tr>
    <td><div class="who">${avatar(r.id, r.nome)}<span><b>${esc(r.nome)}${r.is_admin ? ' <span class="tag adm">admin</span>' : !r.aparece_ranking ? ' <span class="tag hid">fora do ranking</span>' : ""}</b><small>${esc(r.email)}</small></span></div></td>
    <td class="perf">${r.is_admin ? '<span class="muted">Administra o site</span>' : `${esc(GENERO[r.genero])} · ${esc(papelDe(r))}${r.moto ? `<small>${esc(r.moto)}</small>` : ""}`}</td>
    <td class="num"><b>${fmtN(r.cidades)}</b></td>
    <td class="num">${r.ultima_visita ? fmtDate(r.ultima_visita) : "—"}</td>
    <td>${esc(ago(r.ultimo_acesso))}</td>
    <td class="num">${new Date(r.criado_em).toLocaleDateString("pt-BR")}</td>
    <td><div class="acts" data-id="${r.id}">
      <button data-a="map">Ver mapa</button><button data-a="edit">Editar</button><button data-a="pw">Senha</button>
      ${r.id === me.id ? "" : `<button data-a="adm">${r.is_admin ? "Tirar admin" : "Tornar admin"}</button><button data-a="del" class="del">Excluir</button>`}
    </div></td></tr>`).join("") || `<tr><td colspan="7" class="muted" style="text-align:center;padding:32px">${admRows.length ? "Ninguém encontrado." : "Nenhuma conta ainda."}</td></tr>`;
  $("admRows").querySelectorAll(".acts button").forEach(b => b.onclick = () => admAction(b.dataset.a, admRows.find(r => r.id === b.parentElement.dataset.id)));
}
function admAction(a, r){
  if (!r) return;
  if (a === "map") return compareWith(r.id, r.nome);
  if (a === "pw") return modal({ title: `Nova senha para ${r.nome}`,
    body: `<p class="muted" style="margin:0">Use quando a pessoa esquecer a senha. Depois passe a senha nova para ela.</p><label class="field"><span>Nova senha</span><input class="input" id="admPw" type="text" autocomplete="off" value="${Math.random().toString(36).slice(2,8)}"></label>`,
    actions: [{ label: "Cancelar", cls: "ghost" }, { label: "Definir senha", onClick: async () => {
      const { error } = await sb.rpc("admin_definir_senha", { p_user: r.id, p_senha: $("admPw").value }); if (error) throw new Error(error.message);
      toast(`Senha de <b>${esc(r.nome)}</b> atualizada`, 3500);
    }}] });
  if (a === "adm") return modal({ title: r.is_admin ? `Tirar admin de ${r.nome}?` : `Tornar ${r.nome} admin?`,
    body: `<p style="margin:0">${r.is_admin ? "A pessoa volta a usar o site normalmente e perde o acesso à administração." : "A pessoa deixa de usar o mapa e passa a ver o console de administração, com os dados de todo mundo."}</p>`,
    actions: [{ label: "Cancelar", cls: "ghost" }, { label: "Confirmar", onClick: async () => {
      const { error } = await sb.from("profiles").update({ is_admin: !r.is_admin }).eq("id", r.id); if (error) throw new Error(error.message);
      await loadAdmin();
    }}] });
  if (a === "del") return modal({ title: `Excluir a conta de ${r.nome}?`,
    body: `<p style="margin:0">Apaga para sempre a conta <b>${esc(r.email)}</b> e as ${fmtN(r.cidades)} cidades marcadas.</p><label class="field"><span>Para confirmar, digite EXCLUIR</span><input class="input" id="admDel" autocomplete="off"></label>`,
    actions: [{ label: "Cancelar", cls: "ghost" }, { label: "Excluir para sempre", cls: "danger", onClick: async () => {
      if ($("admDel").value.trim().toUpperCase() !== "EXCLUIR") throw new Error("Digite EXCLUIR para confirmar.");
      const { error } = await sb.rpc("admin_excluir_usuario", { p_user: r.id }); if (error) throw new Error(error.message);
      toast("Conta excluída."); await loadAdmin();
    }}] });
  if (a === "edit") return modal({ title: `Editar ${r.nome}`,
    body: `<label class="field"><span>Nome</span><input class="input" id="aeNome" maxlength="40" value="${esc(r.nome)}"></label>
      <div class="grid2">
        <label class="field"><span>Gênero</span><select class="input" id="aeGen">${Object.entries(GENERO).map(([k,v]) => `<option value="${k}" ${k === r.genero ? "selected" : ""}>${v}</option>`).join("")}</select></label>
        <label class="field"><span>Na moto</span><select class="input" id="aePap">${Object.entries(PAPEL).map(([k,v]) => `<option value="${k}" ${k === r.papel ? "selected" : ""}>${v}</option>`).join("")}</select></label>
      </div>
      <label class="field"><span>Moto</span><input class="input" id="aeMoto" maxlength="60" value="${esc(r.moto || "")}"></label>
      <label class="switch"><input type="checkbox" id="aeRank" ${r.aparece_ranking ? "checked" : ""}> Aparece no ranking</label>
      <button type="button" class="btn ghost sm" id="aeWipe" style="justify-self:start">Apagar todas as cidades desta pessoa</button>`,
    onOpen: (m) => { $("aeWipe").onclick = async () => {
      if ($("aeWipe").dataset.sure !== "1"){ $("aeWipe").dataset.sure = "1"; $("aeWipe").textContent = "Clique de novo para confirmar"; return; }
      const { error } = await sb.from("visitas").delete().eq("user_id", r.id);
      if (error) return m.err(error.message);
      toast("Cidades apagadas."); m.close(); loadAdmin();
    }; },
    actions: [{ label: "Cancelar", cls: "ghost" }, { label: "Salvar", onClick: async () => {
      const nome = $("aeNome").value.trim(); if (nome.length < 2) throw new Error("Nome muito curto.");
      const { error } = await sb.from("profiles").update({ nome, genero: $("aeGen").value, papel: $("aePap").value, moto: $("aeMoto").value.trim() || null, aparece_ranking: $("aeRank").checked }).eq("id", r.id);
      if (error) throw new Error(error.message);
      if (r.id === me.id){ profile = { ...profile, nome }; renderMe(); }
      toast("Dados salvos."); await loadAdmin();
    }}] });
}
$("admCsv").onclick = () => {
  const cols = ["nome","email","genero","papel","moto","pilota_desde","estilo","cidade","cidades","ultima_visita","ultimo_acesso","criado_em","aparece_ranking","is_admin"];
  const q = (v) => `"${String(v ?? "").replace(/"/g, '""')}"`;
  const lines = [cols.join(";")].concat(admRows.map(r => [r.nome, r.email, GENERO[r.genero], papelDe(r), r.moto, r.pilota_desde, ESTILO[r.estilo], cityLabel(r.cidade_id), r.cidades, r.ultima_visita, r.ultimo_acesso, r.criado_em, r.aparece_ranking ? "sim" : "não", r.is_admin ? "sim" : "não"].map(q).join(";")));
  download(`por-onde-rodei-usuarios-${today()}.csv`, "﻿" + lines.join("\n"), "text/csv;charset=utf-8");
};

/* conta do administrador */
function renderConta(){
  $("adminCard").innerHTML = `${avatar(me.id, profile.nome)}
    <div><span class="kicker">Administrador</span><h2>${esc(profile.nome)}</h2><div class="meta">${esc(me.email)}</div>
      <div class="facts"><span>Gerencia ${fmtN(admRows.filter(r => !r.is_admin).length)} ${admRows.filter(r => !r.is_admin).length === 1 ? "usuário" : "usuários"}</span><span>Desde ${new Date(profile.criado_em || Date.now()).toLocaleDateString("pt-BR")}</span></div></div>`;
  $("acNome").value = profile.nome; $("acPw").value = ""; $("acErr").textContent = "";
}
$("acForm").addEventListener("submit", async (e) => {
  e.preventDefault();
  const nome = $("acNome").value.trim(), pw = $("acPw").value;
  if (nome.length < 2){ $("acErr").textContent = "O nome precisa ter pelo menos 2 letras."; return; }
  if (pw && pw.length < 6){ $("acErr").textContent = "A senha precisa ter pelo menos 6 caracteres."; return; }
  if (nome !== profile.nome){
    const { data, error } = await sb.from("profiles").update({ nome }).eq("id", me.id).select().single();
    if (error){ $("acErr").textContent = authMsg(error); return; }
    profile = data;
  }
  if (pw){ const { error } = await sb.auth.updateUser({ password: pw }); if (error){ $("acErr").textContent = authMsg(error); return; } }
  renderMe(); renderConta(); toast("Conta atualizada.");
});

/* =====================================================================
   Confete
   ===================================================================== */
const fx = $("fx"), fctx = fx.getContext("2d"); let parts = [], raf = 0;
function sizeFx(){ const d = Math.min(devicePixelRatio || 1, 2); fx.width = innerWidth * d; fx.height = innerHeight * d; }
sizeFx(); addEventListener("resize", sizeFx);
function burst(x, y){
  if (reduced()) return;
  const cs = getComputedStyle(document.documentElement);
  const cols = ["--accent","--road","--sign"].map(v => cs.getPropertyValue(v).trim()).concat("#ffffff");
  for (let i = 0; i < 70; i++){
    const a = Math.random()*Math.PI*2, sp = 2 + Math.random()*6;
    parts.push({ x, y, vx: Math.cos(a)*sp, vy: Math.sin(a)*sp - 4, r: 3 + Math.random()*4, c: cols[i % 4], rot: Math.random()*6, vr: (Math.random()-.5)*.4, life: 1 });
  }
  if (!raf) raf = requestAnimationFrame(tick);
}
function tick(){
  const d = Math.min(devicePixelRatio || 1, 2); fctx.setTransform(d,0,0,d,0,0); fctx.clearRect(0,0,innerWidth,innerHeight);
  parts = parts.filter(p => p.life > 0);
  for (const p of parts){
    p.vy += .25; p.vx *= .98; p.x += p.vx; p.y += p.vy; p.rot += p.vr; p.life -= .012;
    fctx.save(); fctx.globalAlpha = Math.max(0, p.life); fctx.translate(p.x, p.y); fctx.rotate(p.rot); fctx.fillStyle = p.c; fctx.fillRect(-p.r, -p.r/2, p.r*2, p.r); fctx.restore();
  }
  raf = parts.length ? requestAnimationFrame(tick) : 0;
}

/* =====================================================================
   Partida
   ===================================================================== */
geoReady.catch(() => {});
(async () => {
  const { data: { session } } = await sb.auth.getSession();
  if (session?.user) enterApp(session.user); else showAuth();
})();
