import type { OpenAPIObjectConfig } from "@asteasolutions/zod-to-openapi/dist/v3.0/openapi-generator";

import packageJSON from "../../package.json" with { type: "json" };

export const getOpenApiDefinition = (): OpenAPIObjectConfig => {
  return {
    openapi: "3.0.0",
    info: {
      description: "Novelty API",
      version: packageJSON.version,
      title: "Novelty API",
    },
    tags: [
      {
        name: "Healthcheck",
      },
    ],
  };
};
