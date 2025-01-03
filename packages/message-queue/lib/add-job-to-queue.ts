import type { Queue } from "bullmq";

export const addJobToQueue = async (
  queue: Queue,
  jobName: string,
  data: Record<any, any>,
) => {
  queue.add(jobName, data);
};
