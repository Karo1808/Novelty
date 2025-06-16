import env from "@/env";
import { AmazonCognito, Google } from "arctic";

const google = new Google(
  env.GOOGLE_CLIENT_ID!,
  env.GOOGLE_CLIENT_SECRET!,
  env.GOOGLE_REDIRECT_URI!,
);

const amazon = new AmazonCognito(
  env.AMAZON_COGNITO_DOMAIN!,
  env.AMAZON_COGNITO_CLIENT_ID!,
  env.AMAZON_COGNITO_CLIENT_SECRET!,
  env.AMAZON_COGNITO_REDIRECT_URI!,
);

export const providers = { google, amazon };
