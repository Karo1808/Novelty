import { z } from "zod";

const MAX_MB = 5;
const MAX_BYTES = MAX_MB * 1024 * 1024;
const ALLOWED_TYPES = [
  "image/png",
  "image/jpeg",
  "image/jpg",
  "image/gif",
  "image/webp",
] as const;

type AnyUpload = {
  size?: number;
  type?: string; // Web File
  name?: string;
  arrayBuffer?: () => Promise<ArrayBuffer>;
  mimetype?: string; // Multer/Busboy
  originalname?: string;
  buffer?: unknown;
  filepath?: string; // Formidable
};

const hasData = (f: AnyUpload) =>
  typeof f?.arrayBuffer === "function" ||
  !!f?.buffer ||
  typeof f?.filepath === "string";

const getMime = (f: AnyUpload) => f?.type ?? f?.mimetype ?? "";
const getSize = (f: AnyUpload) => (typeof f?.size === "number" ? f.size : 0);

export const imageFileSchema = z
  .any()
  .refine((v): v is AnyUpload => !!v && typeof v === "object", {
    message: "Expected an image file",
  })
  .refine((f) => hasData(f), { message: "Invalid file data" })
  .refine((f) => (ALLOWED_TYPES as readonly string[]).includes(getMime(f)), {
    message: "Unsupported image type",
  })
  .refine((f) => getSize(f) <= MAX_BYTES, {
    message: `File must be ≤ ${MAX_MB} MB`,
  });
