/**
 * Production build for Render / CI.
 * Raises heap for tsc + vite so starter instances do not OOM mid-build.
 * Does NOT start the server — that is `npm start` / `node server/index.js`.
 */
import { spawnSync } from "node:child_process";
import process from "node:process";

const heapMb = process.env.BUILD_HEAP_MB || "4096";
const nodeOptions = [process.env.NODE_OPTIONS, `--max-old-space-size=${heapMb}`]
  .filter(Boolean)
  .join(" ")
  .trim();

function run(command, args) {
  console.log(`> ${command} ${args.join(" ")}`);
  const result = spawnSync(command, args, {
    stdio: "inherit",
    env: { ...process.env, NODE_OPTIONS: nodeOptions },
    shell: process.platform === "win32",
  });
  if (result.status !== 0) {
    process.exit(result.status ?? 1);
  }
}

const npm = process.platform === "win32" ? "npm.cmd" : "npm";
const npx = process.platform === "win32" ? "npx.cmd" : "npx";

run(npx, ["tsc", "--noEmit"]);
run(npx, ["vite", "build"]);
run(npm, ["run", "generate:sitemap"]);
run(npm, ["run", "postbuild"]);
