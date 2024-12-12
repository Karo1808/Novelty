import { OpenApiGeneratorV3 } from "@asteasolutions/zod-to-openapi";
import * as yaml from "js-yaml";
import { writeFileSync } from "node:fs";

import app from "@/app";

import { getOpenApiDefinition } from "./get-open-api-doc";

function removeRequiredFields(obj: any): any {
  if (Array.isArray(obj)) {
    return obj.map(removeRequiredFields);
  }
  else if (obj && typeof obj === "object") {
    const { required, ...rest } = obj;
    return Object.fromEntries(
      Object.entries(rest)
        // Filter out functions
        .filter(([_, value]) => typeof value !== "function")
        .map(([key, value]) => [key, removeRequiredFields(value)]),
    );
  }
  return obj;
}

const generator = new OpenApiGeneratorV3(app.openAPIRegistry.definitions);
const doc = generator.generateDocument(getOpenApiDefinition());

// Remove all `required` properties due to issue with spectral throwing any error on that rule
const sanitizedDoc = removeRequiredFields(doc);

const openApiYaml = yaml.dump(sanitizedDoc);

writeFileSync("open-api-spec.yaml", openApiYaml);
