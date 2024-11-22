import { OpenApiGeneratorV3 } from "@asteasolutions/zod-to-openapi";
import * as yaml from "js-yaml";
import { writeFileSync } from "node:fs";

import app from "@/app";

import { getOpenApiDefinition } from "./get-open-api-doc";

const generator = new OpenApiGeneratorV3(app.openAPIRegistry.definitions);

const doc = generator.generateDocument(getOpenApiDefinition());

const openApiYaml = yaml.dump(doc);

writeFileSync("open-api-spec.yaml", openApiYaml);
