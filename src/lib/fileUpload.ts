import { promises as fs } from "node:fs";
import path from "node:path";
import crypto from "node:crypto";

const SUBTITLE_DIR = path.join(process.cwd(), "public", "uploads", "subtitles");
const MAX_SUBTITLE_SIZE_BYTES = 2 * 1024 * 1024; // 2MB
const VALID_SUBTITLE_MIME_TYPES = ["text/vtt", "text/plain"];

const isVttFile = (file: File) => {
  const extension = path.extname(file.name || "").toLowerCase();
  const isMimeValid = VALID_SUBTITLE_MIME_TYPES.includes(file.type);
  return extension === ".vtt" || isMimeValid;
};

export async function saveSubtitleFile(file: File) {
  // AIDEV-CRITICAL: validação de upload para evitar gravação de arquivos indevidos
  if (!isVttFile(file)) {
    throw new Error("Apenas arquivos .vtt são aceitos");
  }

  const buffer = Buffer.from(await file.arrayBuffer());
  if (buffer.byteLength > MAX_SUBTITLE_SIZE_BYTES) {
    throw new Error("Arquivo de legenda excede o limite de 2MB");
  }

  await fs.mkdir(SUBTITLE_DIR, { recursive: true });
  const filename = `${crypto.randomUUID()}.vtt`;
  const destination = path.join(SUBTITLE_DIR, filename);

  await fs.writeFile(destination, buffer);
  return `/uploads/subtitles/${filename}`;
}
