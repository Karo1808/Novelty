import type { JobsOptions, Queue } from "bullmq";

export const addJobToQueue = async (
  queue: Queue,
  jobName: string,
  data: Record<any, any>,
  options?: JobsOptions,
) => {
  queue.add(jobName, data, options);
};
