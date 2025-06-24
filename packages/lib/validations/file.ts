import { Blob } from "fetch-blob";
import { z } from "zod/v4";

const MAX_MB = 5;
const MAX_BYTES = MAX_MB * 1024 * 1024;
const ALLOWED_TYPES = [
  "image/png",
  "image/jpeg",
  "image/jpg",
  "image/gif",
  "image/webp",
] as const;

export const imageFileSchema = z.any().refine(
  (file): file is Blob =>
    file instanceof Blob &&
    // @ts-ignore
    ALLOWED_TYPES.includes(file.type) &&
    file.size <= MAX_BYTES,
  {
    message: `File must be PNG/JPEG/GIF/WebP and ≤ ${MAX_MB} MB.`,
  },
);
