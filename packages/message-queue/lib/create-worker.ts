import type { Job } from "bullmq";
import { MetricsTime, Worker } from "bullmq";
import { logger } from "./logger";
import { captureException } from "@novelty/lib/sentry";
import { redisConfig } from "../config/index";
import type { MarkKeysAsPartial } from "@novelty/lib/types";

export const createWorker = (
  queueName: string,
  jobProcessors: Record<string, (data: any) => Promise<void>>,
  connection: MarkKeysAsPartial<
    typeof redisConfig,
    "retryStrategy"
  > = redisConfig,
): Worker => {
  const worker = new Worker(
    queueName,
    async (job: Job) => {
      try {
        const processor = jobProcessors[job.name];
        if (!processor) {
          throw new Error(`No processor defined for job type: ${job.name}`);
        }
        await processor(job.data);
      }
      catch (error) {
        logger.error({
          message: `Error processing job: ${job.name}`,
          jobName: job.name,
          jobId: job.id,
          status: "failure",
          error,
        });
        captureException({
          error: error as Error,
          tags: [{ name: "jobId", value: job?.id }],
          breadcrumb: {
            category: "worker process",
            message: (error as Error).message,
            level: "error",
          },
          contextName: job?.name,
          context: { jobName: job?.name },
        });
        throw error;
      }
    },
    {
      connection,
      metrics: {
        maxDataPoints: MetricsTime.ONE_WEEK * 2,
      },
    },
  );

  worker.on("completed", (job, result) => {
    logger.info({
      message: `Job: ${job.name} completed.`,
      jobName: job.name,
      jobId: job.id,
      status: "completed",
      result,
    });
  });

  worker.on("failed", (job, error) => {
    logger.error({
      message: `Job: ${job?.name} failed: ${error.message}`,
      jobName: job?.name,
      jobId: job?.id,
      status: "failure",
      error,
    });

    captureException({
      error,
      tags: [{ name: "jobId", value: job?.id }],
      breadcrumb: {
        category: "worker process",
        message: error.message,
        level: "error",
      },
      contextName: job?.name,
      context: { jobName: job?.name },
    });
  });

  worker.on("error", (err) => {
    logger.error({
      message: "Unexpected worker error",
      status: "error",
      error: err,
    });

    captureException({
      error: err,
      breadcrumb: {
        category: "worker process",
        message: err.message,
        level: "error",
      },
    });
  });

  return worker;
};
