import { Blob } from "fetch-blob";
import { z } from "zod";

const MAX_PROFILE_IMAGE_SIZE_MB = 5;
const MAX_PROFILE_IMAGE_SIZE_BYTES = MAX_PROFILE_IMAGE_SIZE_MB * 1024 * 1024;
const ALLOWED_PROFILE_IMAGE_MIME_TYPES_CLIENT = [
  "image/png",
  "image/jpeg",
  "image/jpg",
  "image/gif",
  "image/webp",
];

export const imageFileSchema = z
  .instanceof(Blob)

  .refine(
    file => ALLOWED_PROFILE_IMAGE_MIME_TYPES_CLIENT.includes(file.type),
    {
      message: `Invalid client-reported file type. Allowed: ${ALLOWED_PROFILE_IMAGE_MIME_TYPES_CLIENT.join(", ")}`,
    },
  )

  .refine(file => file.size <= MAX_PROFILE_IMAGE_SIZE_BYTES, {
    message: `File size exceeds the limit of ${MAX_PROFILE_IMAGE_SIZE_MB}MB`,
  });
