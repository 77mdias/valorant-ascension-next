export function formatSeconds(seconds: number) {
  if (!Number.isFinite(seconds) || seconds < 0) {
    return "00:00";
  }

  const rounded = Math.floor(seconds);
  const hours = Math.floor(rounded / 3600);
  const minutes = Math.floor((rounded % 3600) / 60);
  const secs = rounded % 60;

  if (hours > 0) {
    return `${hours}:${String(minutes).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
  }

  return `${String(minutes).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
}

export function parseTimecode(value: string) {
  if (typeof value !== "string") {
    return null;
  }

  const normalized = value.trim();
  if (!normalized) {
    return null;
  }

  const numeric = Number(normalized);
  if (!Number.isNaN(numeric) && normalized.match(/^\d+(\.\d+)?$/)) {
    return Math.floor(numeric);
  }

  const parts = normalized.split(":");
  if (parts.some((part) => part.trim() === "")) {
    return null;
  }

  let accumulator = 0;
  for (const part of parts) {
    const parsed = Number(part);
    if (!Number.isFinite(parsed) || parsed < 0) {
      return null;
    }
    accumulator = accumulator * 60 + parsed;
  }

  return Math.floor(accumulator);
}
