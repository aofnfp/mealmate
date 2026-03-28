export function formatDuration(ms: number): string {
  const totalSeconds = Math.floor(ms / 1000);
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  if (hours > 0) {
    return `${hours.toString().padStart(2, '0')}:${minutes
      .toString()
      .padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  }
  return `${minutes.toString().padStart(2, '0')}:${seconds
    .toString()
    .padStart(2, '0')}`;
}

export function formatDurationLong(ms: number): string {
  const totalSeconds = Math.floor(ms / 1000);
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  const parts = [];
  if (hours > 0) parts.push(`${hours}h`);
  if (minutes > 0) parts.push(`${minutes}m`);
  if (seconds > 0 || parts.length === 0) parts.push(`${seconds}s`);

  return parts.join(' ');
}

export function msFromParts(hours: number, minutes: number, seconds: number): number {
  return (hours * 3600 + minutes * 60 + seconds) * 1000;
}

export function partsFromMs(ms: number): { hours: number; minutes: number; seconds: number } {
  const totalSeconds = Math.floor(ms / 1000);
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;
  return { hours, minutes, seconds };
}

export function calculateRemaining(
  durationMs: number,
  startEpochMs: number | null,
  pausedAt: number | null,
  elapsedMs: number,
  now: number
): number {
  if (!startEpochMs) return durationMs;
  
  if (pausedAt) {
    return Math.max(0, durationMs - elapsedMs);
  }
  
  const elapsed = elapsedMs + (now - startEpochMs);
  return Math.max(0, durationMs - elapsed);
}

export function calculateElapsed(
  startEpochMs: number | null,
  pausedAt: number | null,
  elapsedMs: number,
  now: number
): number {
  if (!startEpochMs) return elapsedMs;
  
  if (pausedAt) {
    return elapsedMs;
  }
  
  return elapsedMs + (now - startEpochMs);
}