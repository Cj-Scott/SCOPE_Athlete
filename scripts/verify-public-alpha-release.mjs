import { execFile } from "node:child_process";
import { readFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { promisify } from "node:util";

const execFileAsync = promisify(execFile);
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const defaultRepoRoot = path.resolve(__dirname, "..");
const releaseRepo = "Cj-Scott/SCOPE_Athlete";
const pagesBaseUrl = "https://cj-scott.github.io/SCOPE_Athlete";

export async function verifyPublicAlphaRelease({
  repoRoot = defaultRepoRoot,
  version,
  checkGithubRelease = false,
  checkLiveSite = false
} = {}) {
  if (!version || !/^\d+\.\d+\.\d+$/.test(version)) {
    return { ok: false, errors: ["Version is required in semver form, for example 0.1.6."] };
  }

  const errors = [];
  const expected = expectedReleaseReferences(version);

  await checkFileContains(errors, repoRoot, "docs/index.html", [
    expected.tag,
    expected.exeName,
    expected.msiName,
    expected.checksumsUrl,
    expected.unsignedNoticeUrl
  ]);
  await checkFileExcludes(errors, repoRoot, "docs/index.html", staleReleasePatterns(version));
  await checkFileContains(errors, repoRoot, "README.md", [expected.releaseUrl]);

  await checkJson(errors, repoRoot, "docs/app-updates/windows/latest.json", (json) => {
    if (json.version !== version) {
      errors.push(`docs/app-updates/windows/latest.json version is ${json.version}, expected ${version}.`);
    }
    const platform = json.platforms?.["windows-x86_64"];
    if (!platform?.signature) {
      errors.push("docs/app-updates/windows/latest.json is missing windows-x86_64.signature.");
    }
    if (platform?.url !== expected.exeUrl) {
      errors.push(`docs/app-updates/windows/latest.json URL is ${platform?.url ?? "missing"}, expected ${expected.exeUrl}.`);
    }
  });

  await checkJson(errors, repoRoot, "docs/data-packs/latest/recruiting-os-data-manifest.v1.json", (json) => {
    if (json.latestAppVersion !== version) {
      errors.push(`docs/data-packs/latest/recruiting-os-data-manifest.v1.json latestAppVersion is ${json.latestAppVersion}, expected ${version}.`);
    }
  });

  if (checkGithubRelease) {
    await checkGithubReleaseAssets(errors, version, expected);
  }

  if (checkLiveSite) {
    await checkLivePages(errors, version, expected);
  }

  return { ok: errors.length === 0, errors };
}

function expectedReleaseReferences(version) {
  const tag = `alpha-v${version}`;
  const releaseUrl = `https://github.com/${releaseRepo}/releases/tag/${tag}`;
  const downloadBase = `https://github.com/${releaseRepo}/releases/download/${tag}`;
  const exeName = `SCOPE.Athlete_${version}_x64-setup.exe`;
  const msiName = `SCOPE.Athlete_${version}_x64_en-US.msi`;
  return {
    tag,
    releaseUrl,
    downloadBase,
    exeName,
    msiName,
    exeUrl: `${downloadBase}/${exeName}`,
    msiUrl: `${downloadBase}/${msiName}`,
    checksumsUrl: `${downloadBase}/SHA256SUMS.txt`,
    unsignedNoticeUrl: `${downloadBase}/UNSIGNED-ALPHA-NOTICE.md`
  };
}

function staleReleasePatterns(version) {
  const [major, minor, patch] = version.split(".").map(Number);
  const patterns = [];
  for (let candidatePatch = 0; candidatePatch < patch; candidatePatch += 1) {
    patterns.push(`alpha-v${major}.${minor}.${candidatePatch}`);
    patterns.push(`SCOPE.Athlete_${major}.${minor}.${candidatePatch}`);
  }
  return patterns;
}

async function checkFileContains(errors, repoRoot, relativePath, requiredValues) {
  const content = await readText(errors, repoRoot, relativePath);
  if (content === undefined) return;
  for (const value of requiredValues) {
    if (!content.includes(value)) {
      errors.push(`${relativePath} does not contain expected release reference: ${value}`);
    }
  }
}

async function checkFileExcludes(errors, repoRoot, relativePath, disallowedValues) {
  const content = await readText(errors, repoRoot, relativePath);
  if (content === undefined) return;
  for (const value of disallowedValues) {
    if (content.includes(value)) {
      errors.push(`${relativePath} contains stale release reference: ${value}`);
    }
  }
}

async function checkJson(errors, repoRoot, relativePath, validate) {
  const content = await readText(errors, repoRoot, relativePath);
  if (content === undefined) return;
  try {
    validate(JSON.parse(content));
  } catch (error) {
    errors.push(`${relativePath} is not valid JSON: ${error.message}`);
  }
}

async function readText(errors, repoRoot, relativePath) {
  try {
    return await readFile(path.join(repoRoot, relativePath), "utf8");
  } catch (error) {
    errors.push(`Unable to read ${relativePath}: ${error.message}`);
    return undefined;
  }
}

async function checkGithubReleaseAssets(errors, version, expected) {
  let release;
  try {
    const { stdout } = await execFileAsync("gh", [
      "release",
      "view",
      expected.tag,
      "--repo",
      releaseRepo,
      "--json",
      "assets,tagName"
    ], { windowsHide: true, timeout: 30_000 });
    release = JSON.parse(stdout);
  } catch (error) {
    errors.push(`Unable to inspect GitHub release ${expected.tag}: ${error.stderr || error.message}`);
    return;
  }

  const assetNames = new Set((release.assets ?? []).map((asset) => asset.name));
  for (const assetName of [
    expected.exeName,
    `${expected.exeName}.sig`,
    expected.msiName,
    `${expected.msiName}.sig`,
    "latest.json",
    "SHA256SUMS.txt",
    "UNSIGNED-ALPHA-NOTICE.md"
  ]) {
    if (!assetNames.has(assetName)) {
      errors.push(`GitHub release ${expected.tag} is missing asset: ${assetName}`);
    }
  }

  if (release.tagName !== expected.tag) {
    errors.push(`GitHub release tag is ${release.tagName}, expected ${expected.tag}.`);
  }
}

async function checkLivePages(errors, version, expected) {
  const cacheBust = `cb=${Date.now()}`;
  const [html, appManifest, dataManifest] = await Promise.all([
    fetchText(`${pagesBaseUrl}/?${cacheBust}`, errors, "GitHub Pages HTML"),
    fetchJson(`${pagesBaseUrl}/app-updates/windows/latest.json?${cacheBust}`, errors, "live app update manifest"),
    fetchJson(`${pagesBaseUrl}/data-packs/latest/recruiting-os-data-manifest.v1.json?${cacheBust}`, errors, "live data-pack manifest")
  ]);

  if (html) {
    for (const value of [expected.tag, expected.exeName, expected.msiName]) {
      if (!html.includes(value)) {
        errors.push(`Live GitHub Pages HTML does not contain expected reference: ${value}`);
      }
    }
    for (const value of staleReleasePatterns(version)) {
      if (html.includes(value)) {
        errors.push(`Live GitHub Pages HTML contains stale release reference: ${value}`);
      }
    }
  }

  if (appManifest) {
    if (appManifest.version !== version) {
      errors.push(`Live app update manifest version is ${appManifest.version}, expected ${version}.`);
    }
    if (appManifest.platforms?.["windows-x86_64"]?.url !== expected.exeUrl) {
      errors.push("Live app update manifest does not point at the expected EXE URL.");
    }
  }

  if (dataManifest?.latestAppVersion !== version) {
    errors.push(`Live data-pack manifest latestAppVersion is ${dataManifest?.latestAppVersion ?? "missing"}, expected ${version}.`);
  }
}

async function fetchText(url, errors, label) {
  try {
    const response = await fetch(url, { signal: AbortSignal.timeout(10_000) });
    if (!response.ok) throw new Error(`${response.status} ${response.statusText}`);
    return await response.text();
  } catch (error) {
    errors.push(`Unable to fetch ${label}: ${error.message}`);
    return undefined;
  }
}

async function fetchJson(url, errors, label) {
  const text = await fetchText(url, errors, label);
  if (!text) return undefined;
  try {
    return JSON.parse(text);
  } catch (error) {
    errors.push(`${label} is not valid JSON: ${error.message}`);
    return undefined;
  }
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const args = process.argv.slice(2);
  const version = args.find((arg) => /^\d+\.\d+\.\d+$/.test(arg));
  const result = await verifyPublicAlphaRelease({
    version,
    checkGithubRelease: args.includes("--github"),
    checkLiveSite: args.includes("--live")
  });

  if (!result.ok) {
    console.error(`Public alpha release verification failed for ${version ?? "unknown version"}:`);
    for (const error of result.errors) console.error(`- ${error}`);
    process.exit(1);
  }

  console.log(`Public alpha release verification passed for ${version}.`);
}
