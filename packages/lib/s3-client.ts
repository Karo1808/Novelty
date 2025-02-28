/* eslint-disable node/no-process-env */
import { S3Client } from "@aws-sdk/client-s3";
import "dotenv/config";

export const s3Client = new S3Client({
  region: "auto",
  credentials: {
    accessKeyId: process.env.R2_ACCESS_KEY!,
    secretAccessKey: process.env.R2_SECRET_ACCESS_KEY!,
  },
  endpoint: process.env.R2_ENDPOINT,
  forcePathStyle: true,
});
