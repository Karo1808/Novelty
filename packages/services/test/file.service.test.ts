import { Buffer } from "node:buffer";
import { DeleteObjectCommand, ListObjectsV2Command } from "@aws-sdk/client-s3";
import { afterEach, beforeAll, describe, expect, it, vi } from "vitest";
import { deleteFile, uploadFile } from "../file.service";
import { R2_SIGNED_URL_EXPIRATION } from "../lib/config";
import * as utils from "../lib/utils";
import { testDependencies, testS3 } from "../test-setup";

describe("file service", () => {
  const testFileName = "test-file.txt";
  const testFileBuffer = Buffer.from("test content");
  const testFileType = "text/plain";

  beforeAll(async () => {
    await testS3.send(
      new DeleteObjectCommand({
        Bucket: testDependencies.bucketName,
        Key: testFileName,
      }),
    );
  });

  afterEach(async () => {
    vi.resetAllMocks();
    await testS3.send(
      new DeleteObjectCommand({
        Bucket: testDependencies.bucketName,
        Key: testFileName,
      }),
    );
  });

  describe("uploadFile", () => {
    it("should successfully upload a file and return a presigned URL", async () => {
      const result = await uploadFile({
        filename: testFileName,
        fileBuffer: testFileBuffer,
        fileType: testFileType,
        dependencies: {
          client: testS3,
          logger: testDependencies.logger,
          reqId: testDependencies.reqId,
          bucketName: testDependencies.bucketName!,
        },
      });

      const objects = await testS3.send(
        new ListObjectsV2Command({ Bucket: testDependencies.bucketName }),
      );
      expect(objects.Contents?.some(obj => obj.Key === testFileName)).toBe(
        true,
      );

      expect(result).toMatch(
        new RegExp(
          `^http://.*/${testDependencies.bucketName}/${testFileName}\\?.*X-Amz-Expires=${R2_SIGNED_URL_EXPIRATION}`,
        ),
      );
    });

    it("should throw error and log when upload fails", async () => {
      const loggerErrorSpy = vi.spyOn(testDependencies.logger, "error");
      const s3Error = new Error("Simulated S3 Error (e.g., NoSuchBucket)");
      vi.spyOn(testS3, "send").mockRejectedValueOnce(s3Error);
      const invalidBucket = "non-existent-bucket";

      await expect(
        uploadFile({
          filename: testFileName,
          fileBuffer: testFileBuffer,
          fileType: testFileType,
          dependencies: {
            client: testS3,
            logger: testDependencies.logger,
            reqId: testDependencies.reqId,
            bucketName: invalidBucket,
          },
        }),
      ).rejects.toThrow(s3Error);

      expect(loggerErrorSpy).toHaveBeenCalledWith(
        expect.objectContaining({
          message: "Failed to upload file to R2",
          source: `uploadFile, ${testFileName}`,
          error: s3Error.message,
        }),
      );
    });
  });

  describe("deleteFile", () => {
    it("should successfully delete an existing file", async () => {
      vi.spyOn(utils, "getOldKey").mockReturnValue(testFileName);
      const url = await uploadFile({
        filename: testFileName,
        fileBuffer: testFileBuffer,
        fileType: testFileType,
        dependencies: {
          client: testS3,
          logger: testDependencies.logger,
          reqId: testDependencies.reqId,
          bucketName: testDependencies.bucketName!,
        },
      });

      await deleteFile({
        url,
        dependencies: {
          client: testS3,
          logger: testDependencies.logger,
          reqId: testDependencies.reqId,
          bucketName: testDependencies.bucketName!,
        },
      });

      const objects = await testS3.send(
        new ListObjectsV2Command({ Bucket: testDependencies.bucketName }),
      );
      expect(objects.Contents?.some(obj => obj.Key === testFileName)).toBe(
        undefined,
      );
    });

    it("should log when deletion fails (mocking SDK error)", async () => {
      const loggerErrorSpy = vi.spyOn(testDependencies.logger, "error");
      const s3DeleteError = new Error("Simulated S3 Delete Error");
      const invalidUrl = "http://invalid.url/non-existent-file.txt";
      vi.spyOn(utils, "getOldKey").mockReturnValue("non-existent-file.txt");
      vi.spyOn(testS3, "send").mockRejectedValueOnce(s3DeleteError);

      await expect(
        deleteFile({
          url: invalidUrl,
          dependencies: {
            client: testS3,
            logger: testDependencies.logger,
            reqId: testDependencies.reqId,
            bucketName: testDependencies.bucketName!,
          },
        }),
      ).rejects.toThrow(s3DeleteError);

      expect(loggerErrorSpy).toHaveBeenCalledWith(
        expect.objectContaining({
          message: "Failed to delete file from R2",
          source: `deleteFile, ${invalidUrl}`,
          error: s3DeleteError.message,
        }),
      );
    });
  });
});
