// Capture de l'administration (vérification visuelle). Usage : MDP=... node tests/qa/capture-admin.mjs <base> <sortie>
import { chromium } from "playwright";
const [base, sortie] = process.argv.slice(2);
const b = await chromium.launch();
for (const l of [390, 1280]) {
  const p = await (await b.newContext({ viewport: { width: l, height: 900 } })).newPage();
  await p.goto(base + "/admin");
  await p.fill("#mdp", process.env.MDP);
  await p.click("button[type=submit]");
  await p.waitForURL(base + "/admin");
  await p.screenshot({ path: `${sortie}/admin-liste-${l}.png`, fullPage: true });
  await p.click("table a");
  await p.screenshot({ path: `${sortie}/admin-detail-${l}.png`, fullPage: true });
}
await b.close();
