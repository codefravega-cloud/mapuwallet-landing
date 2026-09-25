const allowedPlans = new Set(["Wallet", "CRM + SMS", "Growth"]);

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).json({ error: "Método no permitido" });
  const lead = req.body || {};
  if (lead.website) return res.status(204).end();
  if (!lead.nombre || !lead.comercio || !lead.correo || !lead.whatsapp || !allowedPlans.has(lead.plan)) {
    return res.status(400).json({ error: "Completa los campos requeridos" });
  }
  if (!process.env.HUBSPOT_PORTAL_ID || !process.env.HUBSPOT_FORM_GUID) {
    return res.status(503).json({ error: "Captación en configuración" });
  }
  const fields = [
    ["firstname", lead.nombre], ["email", lead.correo], ["phone", lead.whatsapp],
    ["company", lead.comercio],
  ].map(([name, value]) => ({ name, value: String(value).slice(0, 2000) }));
  const response = await fetch(`https://api.hsforms.com/submissions/v3/integration/submit/${process.env.HUBSPOT_PORTAL_ID}/${process.env.HUBSPOT_FORM_GUID}`, {
    method: "POST", headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ fields, context: { pageUri: "https://mapuwallet-landing.vercel.app/", pageName: "MapuWallet" } }),
  });
  if (!response.ok) return res.status(502).json({ error: "No fue posible registrar el lead" });
  return res.status(201).json({ ok: true });
}
