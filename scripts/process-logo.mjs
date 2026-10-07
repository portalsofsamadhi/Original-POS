import sharp from "sharp";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, "..");
const input = path.join(root, "public", "samadhi-productions-logo.jpg");

function removeWhiteBackground(data, channels) {
  for (let i = 0; i < data.length; i += channels) {
    const r = data[i];
    const g = data[i + 1];
    const b = data[i + 2];
    const brightness = (r + g + b) / 3;

    if (brightness >= 248) {
      data[i + 3] = 0;
    } else if (brightness >= 215) {
      const fade = Math.round(((248 - brightness) / 33) * 255);
      data[i + 3] = Math.min(data[i + 3] ?? 255, fade);
    } else if (brightness >= 190 && r > 180 && g > 180 && b > 180) {
      const fade = Math.round(((215 - brightness) / 25) * 180);
      data[i + 3] = Math.min(data[i + 3] ?? 255, fade);
    }
  }
  return data;
}

const image = sharp(input);
const { data, info } = await image
  .ensureAlpha()
  .raw()
  .toBuffer({ resolveWithObject: true });

const processed = removeWhiteBackground(Buffer.from(data), info.channels);

const raw = sharp(processed, {
  raw: { width: info.width, height: info.height, channels: 4 },
});

await raw.clone().png({ compressionLevel: 9 }).toFile(path.join(root, "public", "samadhi-productions-logo.png"));
await raw.clone().webp({ quality: 92, alphaQuality: 100 }).toFile(path.join(root, "public", "samadhi-productions-logo.webp"));

console.log("Created transparent logo: samadhi-productions-logo.png + .webp");