import assert from "node:assert/strict";
import { mkdtemp, mkdir, readFile, rm, writeFile } from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import { test } from "node:test";

import { verifyPublicAlphaRelease } from "./verify-public-alpha-release.mjs";

test("public alpha verifier rejects stale website download links", async () => {
  const root = await makeFixture({
    siteVersion: "0.1.5",
    updateVersion: "0.1.6",
    dataPackAppVersion: "0.1.6"
  });

  try {
    const result = await verifyPublicAlphaRelease({
      repoRoot: root,
      version: "0.1.6",
      checkGithubRelease: false,
      checkLiveSite: false
    });

    assert.equal(result.ok, false);
    assert.match(result.errors.join("\n"), /docs\/index\.html/i);
    assert.match(result.errors.join("\n"), /alpha-v0\.1\.6/i);
  } finally {
    await rm(root, { recursive: true, force: true });
  }
});

test("public alpha verifier accepts matching public release references", async () => {
  const root = await makeFixture({
    siteVersion: "0.1.6",
    updateVersion: "0.1.6",
    dataPackAppVersion: "0.1.6"
  });

  try {
    const result = await verifyPublicAlphaRelease({
      repoRoot: root,
      version: "0.1.6",
      checkGithubRelease: false,
      checkLiveSite: false
    });

    assert.equal(result.ok, true);
    assert.deepEqual(result.errors, []);
  } finally {
    await rm(root, { recursive: true, force: true });
  }
});

async function makeFixture({ siteVersion, updateVersion, dataPackAppVersion }) {
  const root = await mkdtemp(path.join(os.tmpdir(), "scope-athlete-public-release-"));
  await mkdir(path.join(root, "docs", "app-updates", "windows"), { recursive: true });
  await mkdir(path.join(root, "docs", "data-packs", "latest"), { recursive: true });

  await writeFile(path.join(root, "README.md"), `# SCOPE Athlete\n\nhttps://github.com/Cj-Scott/SCOPE_Athlete/releases/tag/alpha-v${siteVersion}\n`);
  await writeFile(path.join(root, "docs", "index.html"), `
    <a href="https://github.com/Cj-Scott/SCOPE_Athlete/releases/download/alpha-v${siteVersion}/SCOPE.Athlete_${siteVersion}_x64-setup.exe">Download EXE</a>
    <a href="https://github.com/Cj-Scott/SCOPE_Athlete/releases/download/alpha-v${siteVersion}/SCOPE.Athlete_${siteVersion}_x64_en-US.msi">Download MSI</a>
    <a href="https://github.com/Cj-Scott/SCOPE_Athlete/releases/download/alpha-v${siteVersion}/SHA256SUMS.txt">Checksums</a>
    <a href="https://github.com/Cj-Scott/SCOPE_Athlete/releases/download/alpha-v${siteVersion}/UNSIGNED-ALPHA-NOTICE.md">Notice</a>
  `);
  await writeFile(path.join(root, "docs", "app-updates", "windows", "latest.json"), JSON.stringify({
    version: updateVersion,
    platforms: {
      "windows-x86_64": {
        signature: "test-signature",
        url: `https://github.com/Cj-Scott/SCOPE_Athlete/releases/download/alpha-v${updateVersion}/SCOPE.Athlete_${updateVersion}_x64-setup.exe`
      }
    }
  }, null, 2));
  await writeFile(path.join(root, "docs", "data-packs", "latest", "recruiting-os-data-manifest.v1.json"), JSON.stringify({
    latestAppVersion: dataPackAppVersion
  }, null, 2));

  assert.equal(await readFile(path.join(root, "docs", "index.html"), "utf8").then((value) => value.includes(siteVersion)), true);
  return root;
}
