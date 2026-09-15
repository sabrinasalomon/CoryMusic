// Builds the static documentation site into _site/ for GitHub Pages.
import { cpSync, mkdirSync, rmSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const out = join(root, "_site");

rmSync(out, { recursive: true, force: true });
mkdirSync(out, { recursive: true });

const copy = [
  ["site/index.html", "index.html"],
  ["README.md", "README.md"],
  ["BRAND.md", "BRAND.md"],
  ["LICENSE", "LICENSE"],
  ["docs", "docs"],
  ["design", "design"],
  ["playlists", "playlists"]
];

for (const [from, to] of copy) {
  cpSync(join(root, from), join(out, to), { recursive: true });
}

writeFileSync(join(out, ".nojekyll"), "");
console.log("Site built in _site/");
