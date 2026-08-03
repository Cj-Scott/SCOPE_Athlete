import assert from "node:assert/strict";
import { access, readFile } from "node:fs/promises";
import path from "node:path";
import { test } from "node:test";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(__dirname, "..");

async function readPublicFile(relativePath) {
  return readFile(path.join(repoRoot, relativePath), "utf8");
}

async function exists(relativePath) {
  await access(path.join(repoRoot, relativePath));
  return true;
}

test("public site opens on a video landing page and links to the full alpha home", async () => {
  const index = await readPublicFile("docs/index.html");
  const home = await readPublicFile("docs/home.html");
  const faq = await readPublicFile("docs/faq.html");
  const privacy = await readPublicFile("docs/privacy.html");
  const terms = await readPublicFile("docs/terms.html");
  const workflows = await Promise.all([
    readPublicFile("docs/workflows/parent-onboarding.html"),
    readPublicFile("docs/workflows/school-shortlist.html"),
    readPublicFile("docs/workflows/coach-follow-up.html")
  ]);

  assert.match(index, /Private alpha preview/i);
  assert.match(index, /Help families turn school interest into a clear next step/i);
  assert.match(index, /compare schools, organize opportunities, and understand what to do next/i);
  assert.match(index, /<video[\s\S]*?<source src="\.\/assets\/videos\/01-public-site-download-install\.webm\?v=openai-20260715-v2" type="video\/webm"/i);
  assert.match(index, /<video[\s\S]*?<source src="\.\/assets\/videos\/02-app-guided-workflow\.webm\?v=openai-20260715-v2" type="video\/webm"/i);
  assert.match(index, /href="\.\/home\.html#start"/i);
  assert.match(index, /Start Alpha Preview/i);
  assert.match(index, /href="\.\/faq\.html"/i);
  assert.match(index, /href="\.\/privacy\.html"/i);
  assert.match(index, /href="\.\/terms\.html"/i);
  assert.match(index, /Privacy at a glance/i);
  assert.match(index, /no under-13 reviewer submissions/i);
  assert.doesNotMatch(index, /href="\.\/readiness\.html"/i);
  assert.match(index, /Current alpha status/i);
  assert.match(index, /Ready for the connected reviewer path\?/i);
  assert.doesNotMatch(index, /Open full home page/i);
  assert.doesNotMatch(index, /Go to full home page/i);
  assert.match(index, /id="downloads"/i);
  assert.match(index, /01-public-site-download-install\.webm\?v=openai-20260715-v2" download>Download public-site demo/i);
  assert.match(index, /02-app-guided-workflow\.webm\?v=openai-20260715-v2" download>Download app walkthrough/i);
  assert.match(index, /Installer downloads resume August 10, 2026/i);
  assert.match(index, /Coming August 10, 2026/i);
  assert.doesNotMatch(index, /SCOPE\.Athlete_0\.1\.11_x64-setup\.exe/i);
  assert.doesNotMatch(index, /SCOPE\.Athlete_0\.1\.11_x64_en-US\.msi/i);

  assert.match(home, /Preview the school-fit journey in 20 minutes/i);
  assert.match(home, /Follow one connected reviewer path/i);
  assert.match(home, /Because downloads are paused, review this as a public-site preview/i);
  assert.match(home, /href="\.\/index\.html"/i);
  assert.match(home, /href="\.\/faq\.html"/i);
  assert.match(home, /href="\.\/privacy\.html"/i);
  assert.match(home, /href="\.\/terms\.html"/i);
  assert.match(home, /Privacy at a glance/i);
  assert.doesNotMatch(home, /href="\.\/readiness\.html"/i);
  assert.match(home, /Installer downloads are paused/i);
  assert.match(home, /Coming August 10, 2026/i);
  assert.doesNotMatch(home, /SCOPE\.Athlete_0\.1\.11_x64-setup\.exe/i);
  assert.doesNotMatch(home, /SCOPE\.Athlete_0\.1\.11_x64_en-US\.msi/i);

  assert.match(faq, /Private alpha FAQ/i);
  assert.match(faq, /What is SCOPE Athlete\?/i);
  assert.match(faq, /synthetic demo data only/i);
  assert.match(faq, /No under-13 reviewer submissions/i);
  assert.match(faq, /90-day deletion or review target/i);
  assert.match(faq, /href="\.\/privacy\.html"/i);
  assert.match(faq, /href="\.\/terms\.html"/i);
  assert.match(faq, /Windows Settings, then Apps/i);
  assert.match(faq, /Feedback goes through the linked Google Form/i);
  assert.match(faq, /review the public site, videos, walkthrough flow, and feedback questions/i);
  assert.doesNotMatch(faq, /href="\.\/readiness\.html"/i);
  assert.doesNotMatch(faq, /internal messaging guardrails|guarantees attention from schools/i);
  assert.doesNotMatch(`${index}\n${home}\n${faq}`, /Alpha readiness|Go \/ No-go|Decision: Go \/ No-go/i);

  assert.match(privacy, /local-first/i);
  assert.match(privacy, /Google Form/i);
  assert.match(privacy, /90 days/i);
  assert.match(privacy, /No under-13 reviewer submissions/i);
  assert.match(privacy, /not encrypted cloud records/i);
  assert.match(terms, /no guarantee/i);
  assert.match(terms, /No NCAA, school, league, club, or governing-body endorsement/i);
  assert.match(terms, /No legal or compliance advice/i);
  assert.match(terms, /counsel review draft/i);

  for (const workflow of workflows) {
    assert.match(workflow, /Use synthetic data only/i);
    assert.match(workflow, /under-13 reviewer responses/i);
    assert.match(workflow, /href="\.\.\/privacy\.html"/i);
    assert.match(workflow, /href="\.\.\/terms\.html"/i);
  }

  assert.equal(await exists("docs/assets/videos/01-public-site-download-install.webm"), true);
  assert.equal(await exists("docs/assets/videos/02-app-guided-workflow.webm"), true);
  assert.equal(await exists("docs/faq.html"), true);
  assert.equal(await exists("docs/privacy.html"), true);
  assert.equal(await exists("docs/terms.html"), true);
});
