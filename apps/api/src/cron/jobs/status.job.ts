import { healthcheckOkSchema } from "$/healhcheck/healthcheck.validations";
import env from "@/env";
import logger from "@/lib/logger";
import { cronJobOutcomeHistogram, prometheusRegistry } from "@/lib/metrics";
import * as Sentry from "@sentry/node";

export const callHealthcheck = async () => {
  const monitorSlug = "healthcheck-cron";
  const path = `${env.BASE_URL}:${env.PORT}/healthcheck`;

  const checkInId = Sentry.captureCheckIn({
    monitorSlug,
    status: "in_progress",
  });

  const endTimer = cronJobOutcomeHistogram(prometheusRegistry).startTimer({
    job_name: monitorSlug,
  });

  try {
    const res = await fetch(path);

    if (!res.ok) {
      throw new Error(`Cron job failed with status: ${res.statusText}`);
    }

    const data = await res.json();
    const parsedData = healthcheckOkSchema.parse(data);

    if (!parsedData.status || parsedData.status !== "healthy") {
      throw new Error(`Unexpected healthcheck status: ${parsedData.status}`);
    }

    logger.info({
      message: "Healthcheck cron job executed successfully",
      source: "callHealthcheck",
      job: "cron",
      parsedData,
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
