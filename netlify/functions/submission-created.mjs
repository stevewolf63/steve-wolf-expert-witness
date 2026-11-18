// Netlify runs this on every verified Netlify Forms submission. It is the
// second path to the Dashboard: if the page's own call to /api/intake never
// arrived, the stored form submission still becomes a Leads card. The
// Dashboard ignores a submission it already has (same intakeId).
import { clean, sendToDashboard } from "../lib/intake.mjs";

export default async (req) => {
  let payload = {};
  try { payload = ((await req.json()) || {}).payload || {}; } catch (e) {}
  const data = payload.data || {};
  if (data["bot-field"]) return new Response("ok");
  const intake = clean({ ...data, form: data.form || payload.form_name, intakeId: data.intakeId || ("nf-" + (payload.id || Date.now())) });
  if (!intake.email) return new Response("no email");
  const result = await sendToDashboard(intake);
  console.log("submission-created", payload.form_name, intake.intakeId, result.status, result.ok);
  return new Response(result.ok ? "ok" : "dashboard failed", { status: result.ok ? 200 : 500 });
};
