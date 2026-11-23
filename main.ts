// make.fun entry: post-x-the-agent-builds-a-game-from-20261122-1709.
//
// The entry is an X post, so this program's only job is to hand the post's
// address to the grader: it copies POST.json to the output directory.
// Standard library only, no network, deterministic.
import { copyFileSync, existsSync, mkdirSync, readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const HERE = dirname(fileURLToPath(import.meta.url));
const SOURCE = join(HERE, "POST.json");

function fail(message: string): never {
  console.error(`error: ${message}`);
  process.exit(1);
}

function main(): void {
  if (!existsSync(SOURCE)) fail(`POST.json not found at ${SOURCE}`);

  const raw = readFileSync(SOURCE, "utf8");
  let data: unknown;
  try {
    data = JSON.parse(raw);
  } catch {
    fail("POST.json is not valid JSON");
  }
  const url = (data as { url?: unknown }).url;
  if (typeof url !== "string" || !url.startsWith("https://")) {
    fail("POST.json must hold an object with an https URL");
  }
  try {
    // The address must parse as a URL; the site checks it is a real post.
    new URL(url);
  } catch {
    fail(`POST.json holds a malformed URL: ${url}`);
  }

  const outDir = process.env.MAKEFUN_OUTPUT_DIR || "/output";
  mkdirSync(outDir, { recursive: true });
  const target = join(outDir, "POST.json");
  copyFileSync(SOURCE, target);
  console.log(`Copied POST.json to ${target}`);
}

main();
