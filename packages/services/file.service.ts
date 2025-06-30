import type { S3Client } from "@aws-sdk/client-s3";
import {
  DeleteObjectCommand,
  GetObjectCommand,
  PutObjectCommand,
} from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import type { Logger } from "@novelty/lib/types";
import type { Buffer } from "node:buffer";
import { R2_SIGNED_URL_EXPIRATION } from "./lib/config";
import { getOldKey } from "./lib/utils";

interface FileDependenciesParams {
  client: S3Client;
  logger: Logger;
  reqId: string;
  bucketName: string;
}

interface UploadFileParams {
  filename: string;
  fileBuffer: Buffer;
  fileType: string;
  dependencies: FileDependenciesParams;
}

export const uploadFile = async ({
  filename,
  fileBuffer,
  fileType,
  dependencies,
}: UploadFileParams) => {
  try {
    await dependencies.client.send(
      new PutObjectCommand({
        Bucket: dependencies.bucketName,
        Key: filename,
        Body: fileBuffer,
        ContentType: fileType,
        ACL: "private",
      }),
    );

    const presignedUrl = await getSignedUrl(
      // @ts-ignore
      dependencies.client,
      new GetObjectCommand({
        Bucket: dependencies.bucketName,
        Key: filename,
      }),
      { expiresIn: R2_SIGNED_URL_EXPIRATION },
    );

    return presignedUrl;
  } catch (error: unknown) {
    dependencies.logger.error({
      message: "Failed to upload file to R2",
      source: `uploadFile, ${filename}`,
      error: (error as Error).message,
      stackTrace: (error as Error).stack,
      reqId: dependencies.reqId,
    });

    throw error;
  }
};

interface DeleteFileParams {
  url: string;
  dependencies: FileDependenciesParams;
}

export const deleteFile = async ({ url, dependencies }: DeleteFileParams) => {
  try {
    const oldKey = getOldKey(url);
    if (!oldKey) {
      dependencies.logger.warn({
        message: "Could not extract key from URL to delete file",
        url,
        reqId: dependencies.reqId,
      });
      return;
    }

    await dependencies.client.send(
      new DeleteObjectCommand({
        Bucket: dependencies.bucketName,
        Key: oldKey!,
      }),
    );
  } catch (error: unknown) {
    dependencies.logger.error({
      message: "Failed to delete file from R2",
      source: `deleteFile, ${url}`,
      error: (error as Error).message,
      stackTrace: (error as Error).stack,
      reqId: dependencies.reqId,
    });

    throw error;
  }
};
