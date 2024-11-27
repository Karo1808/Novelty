import type { AppOpenAPI } from "@/types/index.types";

import { apiReference } from "@scalar/hono-api-reference";

import { getOpenApiDefinition } from "./get-open-api-doc";

export default function configureOpenAPI(app: AppOpenAPI) {
  app.doc("/spec", getOpenApiDefinition());

  app.get(
    "/docs",
    apiReference({
      theme: "kepler",
      layout: "classic",
      defaultHttpClient: {
        targetKey: "javascript",
        clientKey: "fetch",
      },
      spec: {
        url: "/spec",
      },
    }),
  );
}
