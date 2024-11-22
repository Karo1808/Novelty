import type { OpenAPIObjectConfigure } from "@hono/zod-openapi";

import type { AppBindings } from "@/types/index.types";

import packageJSON from "../../package.json" with { type: "json" };

export const getOpenApiDefinition = (): OpenAPIObjectConfigure<
  AppBindings,
  "/spec"
> => {
  return {
    openapi: "3.0.0",
    info: {
      description: "Novelty API",
      version: packageJSON.version,
      title: "Novelty API",
    },
    servers: [{ url: "v1" }],
    tags: [
      {
        name: "Healthcheck",
      },
    ],
  };
};
