import { spawn } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { createRequire } from "node:module";

const require = createRequire(import.meta.url);
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const shortsDir = path.resolve(__dirname, "../public/Shorts");

let ffmpegPath = "ffmpeg";
try {
  ffmpegPath = require("ffmpeg-static");
} catch {
  console.warn("ffmpeg-static not installed; falling back to ffmpeg on PATH");
}

const files = fs
  .readdirSync(shortsDir)
  .filter(
    (name) =>
      name.endsWith(".mp4") &&
      !name.includes(".tmp") &&
      !name.includes(".faststart")
  );

const run = (args) =>
  new Promise((resolve, reject) => {
    const child = spawn(ffmpegPath, args, { stdio: "inherit" });
    child.on("error", reject);
    child.on("close", (code) => {
      if (code === 0) resolve();
      else reject(new Error(`ffmpeg exited with code ${code}`));
    });
  });

for (const file of files) {
  const input = path.join(shortsDir, file);
  const temp = path.join(shortsDir, `${file}.faststart.tmp.mp4`);

  console.log(`\nFast-starting ${file}...`);
  await run(["-y", "-i", input, "-c", "copy", "-movflags", "+faststart", temp]);
  fs.renameSync(temp, input);
  console.log(`Done: ${file}`);
}

console.log("\nAll shorts optimized for web streaming.");