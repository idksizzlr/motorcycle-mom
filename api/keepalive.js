// Chamado uma vez por dia pelo cron da Vercel (vercel.json) e também pelo GitHub Actions
// (.github/workflows/keepalive.yml). Faz consultas leves no Supabase para o projeto grátis
// não ser pausado por inatividade (o Supabase pausa depois de 7 dias sem uso).
import { SUPABASE_URL, SUPABASE_KEY } from "../js/config.js";

const headers = { apikey: SUPABASE_KEY, "Content-Type": "application/json" };

export default async function handler(req, res) {
  try {
    // 1) função simples no banco  2) leitura de uma tabela de verdade
    const [ping, tabela] = await Promise.all([
      fetch(`${SUPABASE_URL}/rest/v1/rpc/ping`, { method: "POST", headers, body: "{}" }),
      fetch(`${SUPABASE_URL}/rest/v1/profiles?select=id&limit=1`, { headers }),
    ]);
    const ok = ping.ok && tabela.ok;
    res.status(ok ? 200 : 502).json({ ok, ping: ping.status, tabela: tabela.status, em: new Date().toISOString() });
  } catch (e) {
    // banco fora do ar (ex.: projeto pausado): o endereço do Supabase nem responde
    res.status(503).json({ ok: false, erro: String(e?.cause?.code || e), em: new Date().toISOString() });
  }
}
