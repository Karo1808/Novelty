import { serve } from "@hono/node-server";

import app from "@/app";

const port = 3001;

// eslint-disable-next-line no-console
console.log(`Server is running on port http://localhost:${port}`);

serve({
  fetch: app.fetch,
  port,
});
