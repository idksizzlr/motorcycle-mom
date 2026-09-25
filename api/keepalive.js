// Chamado uma vez por dia pelo cron da Vercel (vercel.json).
// Faz uma consulta leve no Supabase para o projeto grátis não ser pausado por inatividade.
import { SUPABASE_URL, SUPABASE_KEY } from "../js/config.js";

export default async function handler(req, res) {
  try {
    const r = await fetch(`${SUPABASE_URL}/rest/v1/rpc/ping`, {
      method: "POST",
      headers: { apikey: SUPABASE_KEY, "Content-Type": "application/json" },
      body: "{}",
    });
    res.status(r.ok ? 200 : 502).json({ ok: r.ok, supabase: r.status, em: new Date().toISOString() });
  } catch (e) {
    res.status(500).json({ ok: false, erro: String(e) });
  }
}
