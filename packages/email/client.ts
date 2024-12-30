/* eslint-disable node/no-process-env */
import { Resend } from "resend";

export const emailClient = new Resend(
  process.env.RESEND_API_KEY ?? ("re" as never),
);
