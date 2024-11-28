import app from "@/app";
import logger from "@/lib/logger";
import { serve } from "@hono/node-server";
import "../instrument";

const port = 3001;

logger.info(`Server is running on port http://localhost:${port}`);

serve({
  fetch: app.fetch,
  port,
});
