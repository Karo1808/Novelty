import app from "@/app";
import env from "@/env";
import logger from "@/lib/logger";
import { serve } from "@hono/node-server";
import "../instrument";

logger.info(`Server is running on port http://localhost:${env.PORT}`);

serve({
  fetch: app.fetch,
  port: env.PORT,
});
