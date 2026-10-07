import { spawn } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { createRequire } from "node:module";

const require = createRequire(import.meta.url);
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const shortsDir = path.resolve(__dirname, "../public/Shorts");
const thumbsDir = path.join(shortsDir, "thumbnails");

let ffmpegPath = "ffmpeg";
try {
  ffmpegPath = require("ffmpeg-static");
} catch {
  console.warn("ffmpeg-static not installed; falling back to ffmpeg on PATH");
}

if (!fs.existsSync(thumbsDir)) {
  fs.mkdirSync(thumbsDir, { recursive: true });
}

const run = (args) =>
  new Promise((resolve, reject) => {
    const child = spawn(ffmpegPath, args, { stdio: "inherit" });
    child.on("error", reject);
    child.on("close", (code) => {
      if (code === 0) resolve();
      else reject(new Error(`ffmpeg exited with code ${code}`));
    });
  });

const files = fs
  .readdirSync(shortsDir)
  .filter(
    (name) =>
      name.endsWith(".mp4") &&
      !name.includes(".tmp") &&
      !name.includes(".faststart")
  );

for (const file of files) {
  const slug = file.replace(/\.mp4$/i, "");
  const input = path.join(shortsDir, file);
  const output = path.join(thumbsDir, `${slug}.jpg`);

  console.log(`\nThumbnail: ${slug}.jpg`);
  await run([
    "-y",
    "-ss",
    "2",
    "-i",
    input,
    "-frames:v",
    "1",
    "-update",
    "1",
    "-vf",
    "scale=360:-2:flags=lanczos",
    "-q:v",
    "2",
    output,
  ]);

  const bytes = fs.readFileSync(output);
  const isJpeg = bytes[0] === 0xff && bytes[1] === 0xd8;
  if (!isJpeg || bytes.length < 1024) {
    throw new Error(`Invalid thumbnail generated for ${slug}`);
  }
}

console.log("\nAll short thumbnails generated in public/Shorts/thumbnails/");