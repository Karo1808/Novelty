import { emailClient } from "@novelty/email/client";
import VerifyEmail from "@novelty/email/templates/verify-email.email";
import ForgotPasswordEmail from "@novelty/email/templates/forgot-passowrd.email";
import React from "react";

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

export const processForgotPasswordEmail = async (
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
    subject: "Forgot password link",
    react: <ForgotPasswordEmail token={token} />,
  });

  if (error) {
    throw new Error(`${error.message}`);
  }
};
