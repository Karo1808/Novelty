import { Resend } from "resend";
import "dotenv/config";

// eslint-disable-next-line node/no-process-env
export const emailClient = new Resend(process.env.RESEND_API_KEY);
