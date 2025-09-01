// src/lib/read-array.ts

// Accept anything that has a getAll(name: string): unknown[] method
type MultiValueReader = Pick<FormData | URLSearchParams, "getAll">;

export function readArray(form: MultiValueReader, ...keys: string[]): string[] {
  // prefer repeated fields
  const vals = keys.flatMap((k) => form.getAll(k) as unknown[]);

  // if nothing under those keys, return []
  if (vals.length === 0) {
    return [];
  }

  // if exactly one string and it looks like JSON array, parse it
  if (vals.length === 1 && typeof vals[0] === "string") {
    const s = (vals[0] as string).trim();
    if (s.startsWith("[") && s.endsWith("]")) {
      try {
        const j = JSON.parse(s);
        if (Array.isArray(j)) {
          return j.map(String);
        }
      } catch {
        /* fall through to normal handling */
      }
    }
  }

  // normal case: repeated fields
  return vals
    .filter((v): v is string => typeof v === "string")
    .map((v) => v.trim())
    .filter(Boolean);
}

// Optional convenience: read directly from a Fetch Request
export async function readArrayFromRequest(req: Request, ...keys: string[]) {
  const form = await req.formData();
  return readArray(form, ...keys);
}
