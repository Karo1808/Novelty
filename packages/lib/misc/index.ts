export function getCookieValue(
  setCookie: string | string[] | null | undefined,
  name: string,
): string | null {
  if (!setCookie) {
    return null;
  }

  const lines: string[] = Array.isArray(setCookie) ? setCookie : [setCookie];

  for (const line of lines) {
    const [kv] = line.split(";", 1);
    const eq = kv?.indexOf("=") ?? -1;
    if (eq === -1) {
      continue;
    }
    const key = kv?.slice(0, eq).trim();
    if (key === name) {
      return kv?.slice(eq + 1) ?? "";
    }
  }
  return null;
}
