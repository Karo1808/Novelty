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

export function fuzzyMatch(candidate: string, query: string) {
  const c = candidate.toLowerCase();
  const q = query.toLowerCase().trim();
  if (!q) {
    return { score: 0, indices: [] as number[] };
  } // treat as match

  let ci = 0;
  const idx: number[] = [];
  let score = 0;
  let last = -2;

  for (let qi = 0; qi < q.length; qi++) {
    const ch = q[qi];
    const found = c.indexOf(ch ?? "", ci);
    if (found === -1) {
      return null;
    }
    idx.push(found);

    // scoring: adjacency + word boundary bias + shorter strings bias
    if (found === last + 1) {
      score += 3;
    } else {
      score += 1;
    }
    if (found === 0 || /\W|_/.test(c[found - 1] ?? "")) {
      score += 2;
    }

    last = found;
    ci = found + 1;
  }

  // prefer shorter candidates & earlier matches
  score += Math.max(0, 10 - (c.length - q.length));
  return { score, indices: idx };
}
