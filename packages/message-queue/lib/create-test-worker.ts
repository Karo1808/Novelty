import type { Job, RedisClient } from "bullmq";
import { Worker } from "bullmq";

export const createTestWorker = (
  queueName: string,
  jobProcessors: Record<string, (data: any) => Promise<void>>,
  connection: RedisClient,
): Worker => {
  const worker = new Worker(
    queueName,
    async (job: Job) => {
      const processor = jobProcessors[job.name];
      if (!processor) {
        throw new Error(`No processor defined for job type: ${job.name}`);
      }
      await processor(job.data);
    },
    {
      connection,
    },
  );

  return worker;
};
