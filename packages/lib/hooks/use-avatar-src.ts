import { useEffect, useState } from "react";

export function useAvatarSrc(value: unknown) {
  const [src, setSrc] = useState<string | null>(null);

  useEffect(() => {
    let objectUrl: string | null = null;

    // If it's already a string URL/data URL, use it directly
    if (typeof value === "string" && value.trim()) {
      setSrc(value);
      return () => {};
    }

    // Try to extract a File from common shapes
    let file: File | undefined;
    if (value instanceof File) {
      file = value;
    } else if (Array.isArray(value) && value[0] instanceof File) {
      file = value[0];
    } else if (value && typeof value === "object" && "0" in (value as any)) {
      const first = (value as any)[0];
      if (first instanceof File) {
        file = first;
      }
    }

    // Create an object URL for the File
    if (file && typeof window !== "undefined") {
      objectUrl = URL.createObjectURL(file);
      setSrc(objectUrl);
      return () => {
        if (objectUrl) {
          URL.revokeObjectURL(objectUrl);
        }
      };
    }

    // Nothing usable
    setSrc(null);
    return () => {};
  }, [value]);

  return src;
}
