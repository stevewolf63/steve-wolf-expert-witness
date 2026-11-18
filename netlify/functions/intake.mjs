// POST /api/intake : called by the page for every form submission.
import { clean, sendToDashboard } from "../lib/intake.mjs";

const json = (status, data) => new Response(JSON.stringify(data), {
  status, headers: { "Content-Type": "application/json", "Cache-Control": "no-store" }
});

export default async (req) => {
  if (req.method !== "POST") return json(405, { ok: false, error: "POST only" });
  let body;
  try { body = await req.json(); } catch (e) { return json(400, { ok: false, error: "Body was not JSON" }); }
  if (body && body["bot-field"]) return json(200, { ok: true });
  const intake = clean(body);
  if (!intake.intakeId || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(intake.email || "")) {
    return json(400, { ok: false, error: "A valid email is required" });
  }
  const result = await sendToDashboard(intake);
  console.log("intake", intake.form, intake.intakeId, result.status, result.ok);
  return json(result.ok ? 200 : 502, { ok: result.ok, lead: result.body && result.body.id });
};

export const config = { path: "/api/intake" };
