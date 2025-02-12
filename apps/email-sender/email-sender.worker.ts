import { processVerificationEmail } from "@novelty/message-queue/queues/email.handler";
import { createWorker } from "@novelty/message-queue/lib/create-worker";
import env from "./lib/env";

export const jobProcessors: Record<string, (data: any) => Promise<void>> = {
  "send-verification-email": async (data) => {
    processVerificationEmail(data, env.SENDER_EMAIL);
  },
};

export const emailWorker = createWorker("email-queue", jobProcessors);
