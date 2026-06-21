import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const SHORTS_DIR = path.join(__dirname, "..", "public", "Shorts");

function readBoxHeader(buf, offset) {
  if (offset + 8 > buf.length) return null;
  let size = buf.readUInt32BE(offset);
  const type = buf.toString("ascii", offset + 4, offset + 8);
  let headerSize = 8;
  if (size === 1) {
    if (offset + 16 > buf.length) return null;
    size = Number(buf.readBigUInt64BE(offset + 8));
    headerSize = 16;
  } else if (size === 0) {
    size = buf.length - offset;
  }
  return { size, type, headerSize, dataStart: offset + headerSize, end: offset + size };
}

function findMvhd(buf, offset = 0, end = buf.length) {
  while (offset < end) {
    const box = readBoxHeader(buf, offset);
    if (!box || box.size < box.headerSize) break;
    if (box.type === "mvhd") return box;
    const child = findMvhd(buf, box.dataStart, box.end);
    if (child) return child;
    offset = box.end;
  }
  return null;
}

function parseMvhd(buf, box) {
  const start = box.dataStart;
  const version = buf.readUInt8(start);
  const timescaleOffset = version === 0 ? start + 12 : start + 20;
  const durationOffset = version === 0 ? start + 16 : start + 24;
  const timescale = buf.readUInt32BE(timescaleOffset);
  const duration =
    version === 0
      ? buf.readUInt32BE(durationOffset)
      : Number(buf.readBigUInt64BE(durationOffset));
  const seconds = duration / timescale;
  return { version, timescale, duration, seconds };
}

function formatDuration(seconds) {
  const mins = Math.floor(seconds / 60);
  const secs = Math.round((seconds % 60) * 10) / 10;
  if (mins > 0) return `${mins}m ${secs.toFixed(1)}s (${seconds.toFixed(2)}s)`;
  return `${secs.toFixed(2)}s`;
}

const files = fs.readdirSync(SHORTS_DIR).filter((f) => f.endsWith(".mp4")).sort();
console.log("=== MP4 Duration (mvhd box) ===");
for (const file of files) {
  const filePath = path.join(SHORTS_DIR, file);
  const buf = fs.readFileSync(filePath);
  const mvhd = findMvhd(buf);
  if (!mvhd) {
    console.log(`${file}: mvhd not found`);
    continue;
  }
  const info = parseMvhd(buf, mvhd);
  console.log(
    `${file}: ${formatDuration(info.seconds)} [timescale=${info.timescale}, duration=${info.duration}]`
  );
}