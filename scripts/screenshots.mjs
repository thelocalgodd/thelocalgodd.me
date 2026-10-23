// Takes a 1280x800 screenshot of each live project site with headless Chrome.
// Output: src/assets/projects/<id>.png. Astro turns them into WebP at build time.
// Usage: npm run screenshots [-- <id> ...]   (no ids = every project)
// Set CHROME_PATH to use another Chrome or Chromium binary.
import { execFile } from "node:child_process"
import { mkdtemp, readFile, rm, stat } from "node:fs/promises"
import { tmpdir } from "node:os"
import { join } from "node:path"
import { promisify } from "node:util"

const run = promisify(execFile)

const CHROME = process.env.CHROME_PATH ?? "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"
const OUT_DIR = "src/assets/projects"
// Time Chrome lets the page run before it takes the shot, so maps and fonts can load.
const LOAD_BUDGET_MS = 10000
// Pages to capture instead of the project URL. Lucy's home page opens a welcome pop-up over everything.
const PAGE_OVERRIDES = {
  "lucys-perfumery": "https://lucysperfumery.com/products",
}

const projects = JSON.parse(await readFile("src/content/projects/projects.json", "utf8"))
const wanted = process.argv.slice(2)
const unknown = wanted.filter((id) => !projects.some((p) => p.id === id))
if (unknown.length > 0) throw new Error(`Unknown project id: ${unknown.join(", ")}`)

const profile = await mkdtemp(join(tmpdir(), "screenshots-"))
try {
  for (const { id, url } of projects) {
    if (wanted.length > 0 && !wanted.includes(id)) continue
    const out = join(OUT_DIR, `${id}.png`)
    await run(CHROME, [
      "--headless=new",
      "--disable-gpu",
      "--hide-scrollbars",
      "--no-first-run",
      `--user-data-dir=${profile}`,
      "--window-size=1280,800",
      `--virtual-time-budget=${LOAD_BUDGET_MS}`,
      `--screenshot=${out}`,
      PAGE_OVERRIDES[id] ?? url,
    ])
    const { size } = await stat(out)
    console.log(`${id}: ${out} (${Math.round(size / 1024)} KB)`)
  }
} finally {
  await rm(profile, { recursive: true, force: true })
}
