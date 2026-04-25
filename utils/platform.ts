export function isMacOS(): boolean {
  if (typeof navigator === "undefined") return false;
  return /Mac/.test(navigator.userAgent) && navigator.maxTouchPoints === 0;
}
