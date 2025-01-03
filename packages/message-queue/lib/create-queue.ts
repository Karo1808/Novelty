import { Queue, QueueEvents } from "bullmq";
import { redisConfig } from "../config/index";
import { logger } from "./logger";
import { captureException } from "@novelty/lib/sentry";

export const createQueue = (queueName: string) => {
  const queue = new Queue(queueName, {
    connection: redisConfig,
  });
  const events = new QueueEvents(queueName, {
    connection: redisConfig,
  });

  events.on("completed", ({ jobId, returnvalue }) => {
    logger.info({
      message: `Queue:${queueName}] Job ${jobId} completed.`,
      queueName,
      jobId,
      status: "completed",
      returnvalue,
    });

    events.on("failed", ({ jobId, failedReason }) => {
      logger.error({
        message: `Queue:${queueName}] Job ${jobId} failed: ${failedReason}`,
        queueName,
        jobId,
        status: "failure",
        failedReason,
      });

      captureException({
        error: new Error(failedReason),
        tags: [{ name: "jobId", value: jobId }],
        breadcrumb: {
          category: "queue execution",
          message: failedReason,
          level: "error",
        },
        contextName: queueName,
        context: { queueName },
      });
    });
  });

  const shutdown = async () => {
    try {
      await queue.close();
      await events.close();
      logger.info({
        message: `Queue:${queueName}] Gracefully shut down.`,
        queueName,
      });
    }
    catch (error) {
      logger.error({
        message: `Queue:${queueName}] Shutdown error: ${error.message}`,
        queueName,
        error: error.message,
      });
    }
  };

  process.on("SIGINT", shutdown);
  process.on("SIGTERM", shutdown);

  return queue;
};
