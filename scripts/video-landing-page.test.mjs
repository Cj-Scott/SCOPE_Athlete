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

  assert.match(index, /Demo video center/i);
  assert.match(index, /<video[\s\S]*?<source src="\.\/assets\/videos\/01-public-site-download-install\.webm\?v=openai-20260715" type="video\/webm"/i);
  assert.match(index, /<video[\s\S]*?<source src="\.\/assets\/videos\/02-app-guided-workflow\.webm\?v=openai-20260715" type="video\/webm"/i);
  assert.match(index, /href="\.\/home\.html"/i);
  assert.match(index, /Continue to Alpha Hub/i);
  assert.match(index, /Ready to explore the full alpha\?/i);
  assert.doesNotMatch(index, /Open full home page/i);
  assert.doesNotMatch(index, /Go to full home page/i);
  assert.match(index, /id="downloads"/i);
  assert.match(index, /01-public-site-download-install\.webm\?v=openai-20260715" download>Download public-site demo/i);
  assert.match(index, /02-app-guided-workflow\.webm\?v=openai-20260715" download>Download app walkthrough/i);
  assert.match(index, /Download EXE/i);
  assert.match(index, /Download MSI/i);

  assert.match(home, /Test the school-fit workflow in 20 minutes/i);
  assert.match(home, /href="\.\/index\.html"/i);

  assert.equal(await exists("docs/assets/videos/01-public-site-download-install.webm"), true);
  assert.equal(await exists("docs/assets/videos/02-app-guided-workflow.webm"), true);
});
