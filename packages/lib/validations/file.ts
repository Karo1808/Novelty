import { z } from "zod";
import { Blob } from "fetch-blob";

export const imageFileSchema = z
  .instanceof(Blob)
  .refine(
    file =>
      [
        "image/png",
        "image/jpeg",
        "image/jpg",
        "image/svg+xml",
        "image/gif",
      ].includes(file.type),
    { message: "Invalid image file type" },
  );
