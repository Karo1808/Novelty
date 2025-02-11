import { emailClient } from "@novelty/email/client";
import VerifyEmail from "@novelty/email/templates/prototype.email";

export const processVerificationEmail = async (
  data: {
    email: string;
    token: string;
  },
  senderEmail: string,
) => {
  const { email, token } = data;

  const { error } = await emailClient.emails.send({
    from: senderEmail,
    to: email,
    subject: "Email verification link",
    react: <VerifyEmail validationCode={token} />,
  });

  if (error) {
    throw new Error(`${error.message}`);
  }
};
