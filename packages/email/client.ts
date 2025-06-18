/* eslint-disable node/no-process-env */
import path from "node:path";

import dotenv from "dotenv";
import { Resend } from "resend";

dotenv.config({
  path: path.resolve(
    process.env.NODE_ENV !== "test" ? "./.env.local" : "./.env.test",
  ),
});

export const emailClient = new Resend(
  process.env.RESEND_API_KEY ?? ("re" as never),
);
