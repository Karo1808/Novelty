import type { Job } from "bullmq";
import { Worker } from "bullmq";
import { redisConfig } from "@novelty/message-queue/config/index";
import { logger } from "./lib/logger";
import { captureException } from "@novelty/lib/sentry";
import { processVerificationEmail } from "./email-sender.handler";

const jobProcessors: Record<string, (data: any) => Promise<void>> = {
  "send-verification-email": processVerificationEmail,
};

const emailWorker = new Worker(
  "email-queue",
  async (job: Job) => {
    const processor = jobProcessors[job.name];
    if (!processor) {
      throw new Error(`No processor defined for job type: ${job.name}`);
    }
    await processor(job.data);
  },
  {
    connection: redisConfig,
  },
);

emailWorker.on("completed", (job, result) => {
  logger.info({
    message: `Job:${job.name}] Job ${job?.id} completed.`,
    jobName: job.name,
    jobId: job.id,
    status: "completed",
    result,
  });
});

emailWorker.on("failed", (job, error) => {
  logger.error({
    message: `Job: ${job?.name} Job ${job?.id} failed: ${error.message}`,
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

emailWorker.on("error", (err) => {
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
