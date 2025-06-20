import type { AppOpenAPI } from "@/types/index.types";

import { Scalar } from "@scalar/hono-api-reference";

import { getOpenApiDefinition } from "./get-open-api-doc";

export default function configureOpenAPI(app: AppOpenAPI) {
  app.doc("/spec", getOpenApiDefinition());

  app.get(
    "/docs",
    Scalar({
      theme: "kepler",
      layout: "classic",
      defaultHttpClient: {
        targetKey: "js",
        clientKey: "fetch",
      },
    }),
  );
}
