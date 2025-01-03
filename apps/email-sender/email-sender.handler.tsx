import { emailClient } from "@novelty/email/client";
import VerifyEmail from "@novelty/email/templates/prototype.email";
import env from "./lib/env";

export const processVerificationEmail = async (data: {
  email: string;
  token: string;
}) => {
  const { email, token } = data;

  const { error } = await emailClient.emails.send({
    from: env.SENDER_EMAIL,
    to: email,
    subject: "Email verification link",
    react: <VerifyEmail validationCode={token} />,
  });

  if (error) {
    throw new Error(`${error.message}`);
  }
};
