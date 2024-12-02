import env from "@/env";
import * as Sentry from "@sentry/node";
import logger from "@/lib/logger";
import { cronJobOutcomeHistogram } from "@/lib/metrics";

export const callHealthcheck = async () => {
  const monitorSlug = "healthcheck-cron";
  const path = `${env.BASE_URL}:${env.PORT}/healthcheck`;

  const checkInId = Sentry.captureCheckIn({
    monitorSlug,
    status: "in_progress",
  });

  const endTimer = cronJobOutcomeHistogram.startTimer({
    job_name: monitorSlug,
  });

  try {
    const res = await fetch(path);

    if (!res.ok) {
      throw new Error(`Cron job failed with status: ${res.statusText}`);
    }

    const data = await res.json();

    logger.info({
      message: "Healthcheck cron job executed successfully",
      source: "callHealthcheck",
      job: "cron",
      data,
    });

    Sentry.captureCheckIn({
      checkInId,
      monitorSlug,
      status: "ok",
    });

    endTimer({ outcome: "success" });
  }
  catch (error) {
    logger.error({
      message: "Healthcheck cron job failed to execute",
      source: "callHealthcheck",
      job: "cron",
      error: (error as Error).message,
      stackTrace: (error as Error)?.stack,
    });

    Sentry.captureCheckIn({
      checkInId,
      monitorSlug,
      status: "error",
    });

    endTimer({ outcome: "failure" });
  }
};
