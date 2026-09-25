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
};
const ico = (k, s = 22) => `<svg width="${s}" height="${s}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.1" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${ICONS[k]}</svg>`;
const BADGES = [
  {g:"Cidades", k:"m1",    t:"Primeira parada",       d:"Marque a primeira cidade",           m:"n",     goal:1,    i:"pin"},
  {g:"Cidades", k:"m10",   t:"Pé na estrada",         d:"10 cidades",                          m:"n",     goal:10,   i:"pin"},
  {g:"Cidades", k:"m50",   t:"Rodagem",               d:"50 cidades",                          m:"n",     goal:50,   i:"road"},
  {g:"Cidades", k:"m100",  t:"Centenário",            d:"100 cidades",                         m:"n",     goal:100,  i:"road"},
  {g:"Cidades", k:"m250",  t:"Motoviagem de verdade", d:"250 cidades",                         m:"n",     goal:250,  i:"star"},
  {g:"Cidades", k:"m500",  t:"Lenda do asfalto",      d:"500 cidades",                         m:"n",     goal:500,  i:"star"},
  {g:"Cidades", k:"m1000", t:"Mil cidades",           d:"1.000 municípios",                    m:"n",     goal:1000, i:"crown"},
  {g:"Estados e regiões", k:"u3",   t:"Divisa cruzada",   d:"Passe por 3 estados",              m:"ufs",   goal:3,  i:"flag"},
  {g:"Estados e regiões", k:"u10",  t:"Dez bandeiras",    d:"10 estados",                       m:"ufs",   goal:10, i:"flag"},
  {g:"Estados e regiões", k:"u27",  t:"Brasil inteiro",   d:"Todos os 27 estados",              m:"ufs",   goal:27, i:"crown"},
  {g:"Estados e regiões", k:"r5",   t:"Cinco regiões",    d:"Norte, Nordeste, Centro-Oeste, Sudeste e Sul", m:"regs", goal:5, i:"compass"},
  {g:"Estados e regiões", k:"ns",   t:"Do Norte ao Sul",  d:"Uma cidade no Norte e outra no Sul", m:"ns",  goal:2,  i:"compass"},
  {g:"Estados e regiões", k:"full", t:"Estado fechado",   d:"Todas as cidades de um estado",   m:"fullPct", goal:100, i:"map"},
  {g:"Capitais", k:"c1",  t:"Na capital",            d:"Visite uma capital",                   m:"caps",  goal:1,  i:"star"},
  {g:"Capitais", k:"c10", t:"Roteiro das capitais",  d:"10 capitais",                          m:"caps",  goal:10, i:"star"},
  {g:"Capitais", k:"c27", t:"Todas as capitais",     d:"As 27 capitais do Brasil",             m:"caps",  goal:27, i:"crown"},
  {g:"Estrada", k:"natal",  t:"Ponto de partida",    d:"Marque a sua cidade de partida",       m:"natal", goal:1,    i:"home"},
  {g:"Estrada", k:"l500",   t:"Longe de casa",       d:"Uma cidade a 500 km da sua",           m:"longe", goal:500,  i:"road"},
  {g:"Estrada", k:"l2000",  t:"Do outro lado do mapa", d:"Uma cidade a 2.000 km da sua",       m:"longe", goal:2000, i:"compass"},
  {g:"Estrada", k:"mem10",  t:"Contadora de histórias", d:"Escreva 10 lembranças",             m:"notas", goal:10,   i:"book", tm:"Contador de histórias"},
  {g:"Estrada", k:"mes6",   t:"O ano todo na estrada", d:"Viagens em 6 meses diferentes",      m:"meses", goal:6,    i:"cal"},
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
  if (m.includes("failed to fetch") || m.includes("network")) return "Sem conexão com a internet. Tente de novo.";
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
  for (const id of ids){
    const it = Q[id]; if (!it) continue;
    let error;
    if (it.op === "up") ({ error } = await sb.from("visitas").upsert({ user_id: me.id, municipio_id: id, data: it.d, nota: it.n }));
    else ({ error } = await sb.from("visitas").delete().eq("user_id", me.id).eq("municipio_id", id));
    if (error && !error.code){ failed = true; break; }           // rede: tenta depois
    if (error) console.warn("Descartado", id, error);             // dado inválido: descarta
    if (JSON.stringify(Q[id]) === JSON.stringify(it)) delete Q[id];
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
function showAuth(){
  $("boot").hidden = true; $("app").hidden = true; $("auth").hidden = false;
  if (location.hash) history.replaceState(null, "", location.pathname + location.search);
  document.title = "Por Onde Rodei";
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

/* mapa animado da tela de entrada */
let heroRaf = 0;
async function startHero(){
  try { await geoReady; } catch { return; }
  const cv = $("heroMap"); if (!cv || $("auth").hidden) return;
  const box = cv.getBoundingClientRect(), dpr = Math.min(devicePixelRatio || 1, 2);
  const W = box.width, H = box.height; if (!W || !H) return;
  cv.width = W*dpr; cv.height = H*dpr;
  const ctx = cv.getContext("2d"); ctx.setTransform(dpr,0,0,dpr,0,0);
  const fc = { type:"FeatureCollection", features:feats };
  // Brasil grande, ancorado à direita, logo abaixo da placa, descendo até a base:
  // o formato do país (largo em cima, fino embaixo) contorna o texto no canto inferior esquerdo.
  const hero = cv.parentElement, hb = hero.getBoundingClientRect();
  const plateBottom = hero.querySelector(".top").getBoundingClientRect().bottom - hb.top;
  const pad = Math.max(14, Math.min(W, H) * .03);
  const area = [[W * .05, plateBottom + pad * .6], [W - 6, H - pad * .4]];
  const proj = d3.geoMercator().fitExtent(area, fc);
  const bb = d3.geoPath(proj).bounds(fc), [tx, ty] = proj.translate();
  proj.translate([tx + (area[1][0] - bb[1][0])+ W * .06, ty + (area[0][1] - bb[0][1])]);   // um tiquinho além da borda direita
  const path = d3.geoPath(proj, ctx);
  ctx.clearRect(0,0,W,H);
  ctx.beginPath(); path(topojson.mesh(topo, topoObj, (a,b) => a !== b)); ctx.strokeStyle = "rgba(255,255,255,.16)"; ctx.lineWidth = .5; ctx.stroke();
  ctx.beginPath(); path(topojson.mesh(topo, topoObj, (a,b) => a === b || a.properties.uf !== b.properties.uf)); ctx.strokeStyle = "rgba(255,255,255,.55)"; ctx.lineWidth = 1.1; ctx.stroke();
  // uma "viagem" que acende municípios vizinhos, um por vez
  const nb = topojson.neighbors(topoObj.geometries);
  const lit = new Set();
  let cur = Math.floor(Math.random()*feats.length), steps = 0;
  cancelAnimationFrame(heroRaf);
  const paint = (i, color) => { ctx.beginPath(); path(feats[i]); ctx.fillStyle = color; ctx.fill(); };
  const step = () => {
    if ($("auth").hidden) return;
    for (let k = 0; k < 2; k++){
      lit.add(cur); paint(cur, steps % 9 === 0 ? "#F2B134" : "rgba(242,177,52,.55)");
      const opts = nb[cur].filter(j => !lit.has(j));
      cur = opts.length ? opts[Math.floor(Math.random()*opts.length)] : [...lit][Math.floor(Math.random()*lit.size)];
      steps++;
    }
    if (steps < 900) heroRaf = requestAnimationFrame(() => setTimeout(step, 40));
  };
  if (reduced()){ for (let i = 0; i < 160; i++){ lit.add(cur); paint(cur, "rgba(242,177,52,.6)"); const o = nb[cur].filter(j => !lit.has(j)); cur = o.length ? o[0] : cur; } }
  else step();
}
let heroRT; addEventListener("resize", () => { if (!$("auth").hidden){ clearTimeout(heroRT); heroRT = setTimeout(startHero, 250); } });

/* =====================================================================
   Entrar no app
   ===================================================================== */
async function enterApp(user, fresh = false){
  if (entered && me?.id === user.id) return;
  entered = true;
  me = { id: user.id, email: user.email };
  cancelAnimationFrame(heroRaf);
  // perfil
  let { data: p } = await sb.from("profiles").select("*").eq("id", me.id).maybeSingle();
  if (!p){ await new Promise(r => setTimeout(r, 800)); ({ data: p } = await sb.from("profiles").select("*").eq("id", me.id).maybeSingle()); }
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
  $("boot").hidden = true; $("auth").hidden = true; $("app").hidden = false;
  applyRole();
  renderMe();
  const want = (location.hash || "").slice(1);
  showView(VIEWS[role()].includes(want) ? want : VIEWS[role()][0]);
  try { await geoReady; initMap(); paintAll(); } catch (e){ $("mapLoading").innerHTML = "<div>O mapa não carregou. Verifique a internet e recarregue a página.</div>"; }
  if (isAdmin()) loadAdmin();
  flush();
  if (fresh) toast(`Bem-${g3(profile,"vinda","vindo","vindo(a)")}, <b>${esc(profile.nome)}</b>! Toque numa cidade para começar.`, 4200);
}

/* Quem usa o app e quem administra veem sites diferentes */
const VIEWS = { user: ["mapa","diario","conquistas","ranking","perfil"], admin: ["painel","usuarios","mapa","ranking","conta"] };
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
  if (event === "SIGNED_OUT"){ entered = false; me = null; profile = null; V = {}; Q = {}; other = null; heat = null; admRows = []; closeCard(); $("compare").hidden = true; toggleMenu(false); showAuth(); }
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
  if (v === "diario") renderDiary();
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
let proj, path, zoom, W = 0, H = 0, svg, gAll, gMun, selPath, homePath, pathEl = new Map(), mapReady = false;
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

  zoom = d3.zoom().scaleExtent([1,160]).clickDistance(8).tapDistance(12)
    .on("zoom", (e) => { gAll.attr("transform", e.transform); hideTip(); });
  svg.call(zoom).on("dblclick.zoom", null);

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
    drawHome();
    zoom.extent([[0,0],[W,H]]).translateExtent([[-W*.5,-H*.5],[W*1.5,H*1.5]]);
    svg.call(zoom.transform, d3.zoomIdentity);
  };
  let rt; new ResizeObserver(() => { clearTimeout(rt); rt = setTimeout(layout, 120); }).observe($("wrap"));
  layout();

  gMun.on("click", (e) => {
    const f = e.target.__data__; if (!f) return;
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
function pickHit(i){ const f = hits[i]; if (!f) return; $("res").hidden = true; $("q").value = ""; $("q").blur(); select(f.id); flyTo(f, 25); }

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
function stats(){
  const ufs = new Set(), regs = new Set(), months = new Set(), perUf = {};
  let caps = 0, area = 0, n = 0, notas = 0, longe = 0;
  const home = profile?.cidade_id && byId.get(profile.cidade_id);
  for (const id in V){
    const f = byId.get(id); if (!f) continue;
    n++; const uf = f.properties.uf;
    ufs.add(uf); regs.add(id[0]); if (CAPS.has(id)) caps++; area += f.area;
    perUf[uf] = (perUf[uf] || 0) + 1;
    if (V[id].n && V[id].n.trim()) notas++;
    if (V[id].d) months.add(V[id].d.slice(0,7));
    if (home) longe = Math.max(longe, d3.geoDistance(home.c, f.c) * 6371);
  }
  let fullPct = 0;
  for (const u in perUf) if (u !== "DF") fullPct = Math.max(fullPct, perUf[u] / ufTotal[u] * 100);
  return { n, ufs: ufs.size, regs: regs.size, caps, area, perUf, notas, meses: months.size,
    longe: Math.round(longe), natal: home && V[profile.cidade_id] ? 1 : 0,
    ns: (regs.has("1") ? 1 : 0) + (regs.has("4") ? 1 : 0), fullPct: Math.floor(fullPct) };
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
    for (const [id, el] of pathEl){
      const on = !!V[id], o = !!other?.set.has(id);
      if (el.classList.contains("v") !== on) el.classList.toggle("v", on);
      if (el.classList.contains("o") !== o) el.classList.toggle("o", o);
      if (el.style.fill){ el.style.fill = ""; el.style.stroke = ""; }
    }
    drawHome();
  }
  const s = stats();
  $("sMunL").textContent = "municípios"; $("sUfL").textContent = "estados de 27"; $("sCapL").textContent = "capitais de 27";
  $("sKmL").textContent = "km² de Brasil"; $("pctL").textContent = "Brasil percorrido"; $("sideH").textContent = "Por estado";
  animNum($("shieldN"), s.n); animNum($("sMun"), s.n);
  $("sUf").textContent = s.ufs; $("sCap").textContent = s.caps;
  $("sKm").textContent = s.area >= 1e5 ? fmtN(Math.round(s.area/1000)) + " mil" : fmtN(Math.round(s.area));
  const pct = totalArea ? s.area / totalArea * 100 : 0;
  $("pct").textContent = (pct < 1 && pct > 0 ? pct.toFixed(2) : pct.toFixed(1)).replace(".", ",") + "% do território";
  $("pctBar").style.width = Math.max(pct, s.n ? .8 : 0) + "%";
  renderUfList(s);
  if (profile) renderMe();
  if (view === "diario") renderDiary();
  if (view === "conquistas") renderBadges();
}
function animNum(el, to){
  const from = +el.dataset.v || 0; el.dataset.v = to;
  if (from === to || reduced()){ el.textContent = fmtN(to); return; }
  const t0 = performance.now();
  const step = (t) => { const k = Math.min(1, (t - t0) / 500); el.textContent = fmtN(Math.round(from + (to - from) * (1 - Math.pow(1-k, 3)))); if (k < 1) requestAnimationFrame(step); };
  requestAnimationFrame(step);
}
function renderUfList(s){
  if (!feats.length) return;
  const rows = Object.keys(UFN).map(u => ({ u, c: s.perUf[u] || 0, t: ufTotal[u] || 1 }))
    .sort((a,b) => (b.c/b.t - a.c/a.t) || (b.c - a.c) || UFN[a.u].localeCompare(UFN[b.u]));
  $("ufList").innerHTML = (s.n ? "" : `<div class="hint">Toque em qualquer cidade do mapa ou use a busca. Depois é só apertar <b>Passei por aqui!</b></div>`) +
    rows.map(r => `<button class="row" data-uf="${r.u}"><span class="sg">${r.u}</span><span><div class="nm">${esc(UFN[r.u])}</div><div class="mini"><i style="width:${(r.c/r.t*100).toFixed(2)}%"></i></div></span><span class="ct num">${r.c} / ${fmtN(r.t)}</span></button>`).join("");
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
  const unitOf = (b) => b.m === "longe" ? " km" : b.m === "fullPct" ? "%" : "";
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
        <b>${esc(badgeTitle(b))}</b><span>${esc(b.d)}</span>
        <span class="prog">${on ? "Conquistada" : b.goal > 1 ? `${fmtN(Math.min(val, b.goal))}${unit} / ${fmtN(b.goal)}${unit}` : "Ainda não"}</span></div>`;
    }).join("")}</div></section>`;
  }).join("") + (profile.cidade_id ? "" : `<p class="muted" style="text-align:center">Dica: escolha sua <b>cidade de partida</b> no Perfil para liberar as conquistas de distância.</p>`);
}

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
$("impFile").onchange = async (e) => {
  const file = e.target.files[0]; if (!file) return;
  try {
    const d = JSON.parse(await file.text()); const src = d?.v;
    if (!src || typeof src !== "object") throw 0;
    let added = 0;
    for (const [id, val] of Object.entries(src)){
      if (!byId.has(id) || V[id]) continue;
      V[id] = { d: /^\d{4}-\d{2}-\d{2}$/.test(val?.d || "") ? val.d : "", n: String(val?.n || "").slice(0, 280) };
      Q[id] = { op: "up", d: V[id].d || null, n: V[id].n || null }; added++;
    }
    saveLocal(); flush(); paintAll();
    toast(`Cópia importada: <b>${added}</b> cidades novas na sua conta`, 4000);
  } catch { toast("Esse arquivo não é uma cópia do Por Onde Rodei", 3500); }
  e.target.value = "";
};
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
  animNum($("shieldN"), admRows.filter(r => !r.is_admin).length);
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
