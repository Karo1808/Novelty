import { z } from "zod";

export const imageFileSchema = z
  .instanceof(File)
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
