export const toMMSS = (seconds: number): string => {
  const mm = Math.floor(seconds / 60);
  const ss = seconds % 60;

  const mmStr = mm.toString().padStart(2, "0");
  const ssStr = ss.toString().padStart(2, "0");

  return `${mmStr}:${ssStr}`;
}