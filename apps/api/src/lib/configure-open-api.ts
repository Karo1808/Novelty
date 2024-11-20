import { apiReference } from "@scalar/hono-api-reference";

import type { AppOpenAPI } from "@/types/index.types";

import packageJSON from "../../package.json" with { type: "json" };

export default function configureOpenAPI(app: AppOpenAPI) {
  app.doc("/spec", {
    openapi: "3.0.0",
    info: {
      version: packageJSON.version,
      title: "Novelty API",
    },
  });

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
