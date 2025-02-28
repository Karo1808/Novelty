import { afterEach, beforeAll, describe, expect, it, vi } from "vitest";
import { testDependencies, testS3 } from "../test-setup";
import { deleteFile, uploadFile } from "../file.service";
import { DeleteObjectCommand, ListObjectsV2Command } from "@aws-sdk/client-s3";
import { R2_SIGNED_URL_EXPIRATION } from "../lib/config";
import * as utils from "../lib/utils";
import { Buffer } from "node:buffer";

// eslint-disable-next-line node/no-process-env
const bucketName = process.env.R2_BUCKET_NAME!;

describe("file service", () => {
  const testFileName = "test-file.txt";
  const testFileBuffer = Buffer.from("test content");
  const testFileType = "text/plain";

  beforeAll(async () => {
    await testS3.send(
      new DeleteObjectCommand({ Bucket: bucketName, Key: testFileName }),
    );
  });

  afterEach(async () => {
    await testS3.send(
      new DeleteObjectCommand({ Bucket: bucketName, Key: testFileName }),
    );
  });

  describe("uploadFile", () => {
    it("should successfully upload a file and return a presigned URL", async () => {
      const result = await uploadFile({
        filename: testFileName,
        fileBuffer: testFileBuffer,
        fileType: testFileType,
        bucketName,
        dependencies: {
          client: testS3,
          logger: testDependencies.logger,
          reqId: testDependencies.reqId,
        },
      });

      const objects = await testS3.send(
        new ListObjectsV2Command({ Bucket: bucketName }),
      );
      expect(objects.Contents?.some(obj => obj.Key === testFileName)).toBe(
        true,
      );

      expect(result).toMatch(
        new RegExp(
          `^http://.*/${bucketName}/${testFileName}\\?.*X-Amz-Expires=${R2_SIGNED_URL_EXPIRATION}`,
        ),
      );
    });

    it("should throw error and log when upload fails", async () => {
      const loggerErrorSpy = vi.spyOn(testDependencies.logger, "error");
      const invalidBucket = "non-existent-bucket";

      await expect(
        uploadFile({
          filename: testFileName,
          fileBuffer: testFileBuffer,
          fileType: testFileType,
          bucketName: invalidBucket,
          dependencies: testDependencies,
        }),
      ).rejects.toThrow();

      expect(loggerErrorSpy).toHaveBeenCalledWith(
        expect.objectContaining({
          message: "Failed to upload file to R2",
          source: `uploadFile, ${testFileName}`,
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
        bucketName,
        dependencies: {
          client: testS3,
          logger: testDependencies.logger,
          reqId: testDependencies.reqId,
        },
      });

      await deleteFile({
        url,
        bucketName,
        dependencies: {
          client: testS3,
          logger: testDependencies.logger,
          reqId: testDependencies.reqId,
        },
      });

      const objects = await testS3.send(
        new ListObjectsV2Command({ Bucket: bucketName }),
      );
      expect(objects.Contents?.some(obj => obj.Key === testFileName)).toBe(
        undefined,
      );
    });

    it("should throw error and log when deletion fails", async () => {
      const loggerErrorSpy = vi.spyOn(testDependencies.logger, "error");
      const invalidUrl = "http://invalid.url/non-existent-file.txt";

      await expect(
        deleteFile({
          url: invalidUrl,
          bucketName,
          dependencies: testDependencies,
        }),
      ).rejects.toThrow();

      expect(loggerErrorSpy).toHaveBeenCalledWith(
        expect.objectContaining({
          message: "Failed to delete file from R2",
          source: `deleteFile, ${invalidUrl}`,
        }),
      );
    });
  });
});
