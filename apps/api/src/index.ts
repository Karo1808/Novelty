import app from "@/app";
import logger from "@/lib/logger";
import { serve } from "@hono/node-server";
import "../instrument";
import env from "@/env";

logger.info(`Server is running on port http://localhost:${env.PORT}`);

serve({
  fetch: app.fetch,
  port: env.PORT,
});
