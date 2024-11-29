import logger from "@/lib/logger";
import * as Sentry from "@sentry/node";
import cron from "node-cron";
import { callHealthcheck } from "./jobs/status.job";
import env from "@/env";

const cronWithCheckIn = Sentry.cron.instrumentNodeCron(cron);

export const startCronJobs = () => {
  if (env.NODE_ENV === "open-api") {
    logger.info("Cron jobs are disabled in this environment.");
    return;
  }

  logger.info("Cron jobs started!");

  cronWithCheckIn.schedule(
    "0 * * * *",
    async () => {
      logger.info({ message: "Executing Hourly Healhtcheck Cron Job..." });
      await callHealthcheck();
    },
    {
      name: "healthcheck-cron",
      timezone: "UTC",
    },
  );
};
