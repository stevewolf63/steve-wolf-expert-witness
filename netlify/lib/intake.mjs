// Hands one website form submission to the Dashboard so it becomes a Leads card.
// The Dashboard key lives only in this site's environment (DASHBOARD_SYNC_KEY),
// never in the page.
const DASH = "https://sw-expert-dashboard.netlify.app/api/sync";
const FIELDS = ["form", "intakeId", "name", "email", "phone", "casetype", "jurisdiction", "timeline", "details", "page"];

export function clean(input) {
  const out = {};
  for (const k of FIELDS) {
    const v = input && input[k];
    if (typeof v === "string" && v.trim()) out[k] = v.trim().slice(0, k === "details" ? 4000 : 300);
  }
  return out;
}

export async function sendToDashboard(intake) {
  const key = process.env.DASHBOARD_SYNC_KEY;
  if (!key) return { ok: false, status: 0, error: "DASHBOARD_SYNC_KEY is not set" };
  let last = { ok: false, status: 0 };
  for (let attempt = 0; attempt < 4; attempt++) {
    try {
      const r = await fetch(DASH, {
        method: "POST",
        headers: { "Content-Type": "application/json", "x-dashboard-key": key },
        body: JSON.stringify({ key, action: "websiteIntake", intake })
      });
      const body = await r.json().catch(() => ({}));
      last = { ok: r.ok && body.ok === true, status: r.status, body };
      if (last.ok || (r.status >= 400 && r.status < 500 && r.status !== 409)) return last;
    } catch (e) {
      last = { ok: false, status: 0, error: String(e) };
    }
    await new Promise(res => setTimeout(res, 800 * (attempt + 1)));
  }
  return last;
}
