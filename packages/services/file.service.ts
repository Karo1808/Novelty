import { s3Client } from "@novelty/lib/r2-client";
import type { Logger } from "@novelty/lib/types";
import { R2_SIGNED_URL_EXPIRATION } from "./lib/config";
import type { Buffer } from "node:buffer";
import {
  DeleteObjectCommand,
  GetObjectCommand,
  PutObjectCommand,
} from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

export const uploadFile = async (
  filename: string,
  fileBuffer: Buffer,
  fileType: string,
  bucketName: string,
  logger: Logger,
  reqId: string,
) => {
  try {
    await s3Client.send(
      new PutObjectCommand({
        Bucket: bucketName,
        Key: filename,
        Body: fileBuffer,
        ContentType: fileType,
        ACL: "private",
      }),
    );

    const presignedUrl = await getSignedUrl(
      s3Client,
      new GetObjectCommand({
        Bucket: bucketName,
        Key: filename,
      }),
      { expiresIn: R2_SIGNED_URL_EXPIRATION },
    );

    return presignedUrl;
  }
  catch (error: unknown) {
    logger.error({
      message: "Failed to upload file to R2",
      source: `uploadFile, ${filename}`,
      error: (error as Error).message,
      stackTrace: (error as Error).stack,
      reqId,
    });

    throw error;
  }
};

export const deleteFile = async (
  url: string,
  bucketName: string,
  logger: Logger,
  reqId: string,
) => {
  try {
    const oldKey = url.split(".r2.cloudflarestorage.com/")[1];

    await s3Client.send(
      new DeleteObjectCommand({
        Bucket: bucketName,
        Key: oldKey!,
      }),
    );
  }
  catch (error: unknown) {
    logger.error({
      message: "Failed to delete file from R2",
      source: `deleteFile, ${url}`,
      error: (error as Error).message,
      stackTrace: (error as Error).stack,
      reqId,
    });

    throw error;
  }
};
