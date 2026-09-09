import {
  Body,
  Container,
  Head,
  Heading,
  Html,
  Preview,
  Section,
  Text,
} from "@react-email/components";
import * as React from "react";

interface ForgotPasswordEmailProps {
  token?: string;
}

export const ForgotPasswordEmail = ({ token }: ForgotPasswordEmailProps) => (
  <Html>
    <Head />
    <Preview>Reset your Novelty password</Preview>
    <Body style={body}>
      <Container style={container}>
        <Heading style={heading}>Reset your password</Heading>
        <Text style={text}>
          Use this token to continue resetting your Novelty password:
        </Text>
        <Section style={codeBox}>
          <Text style={code}>{token}</Text>
        </Section>
        <Text style={muted}>
          If you did not request a password reset, you can safely ignore this
          email.
        </Text>
      </Container>
    </Body>
  </Html>
);

ForgotPasswordEmail.PreviewProps = {
  token: "example-reset-token",
} satisfies ForgotPasswordEmailProps;

export default ForgotPasswordEmail;

const body = {
  backgroundColor: "#0f172a",
  color: "#e2e8f0",
  fontFamily: "Arial, sans-serif",
  padding: "32px 16px",
};

const container = {
  backgroundColor: "#1e293b",
  borderRadius: "8px",
  margin: "0 auto",
  maxWidth: "520px",
  padding: "32px",
};

const heading = { color: "#f8fafc", fontSize: "28px" };
const text = { fontSize: "16px", lineHeight: "24px" };
const muted = { color: "#94a3b8", fontSize: "14px", lineHeight: "22px" };
const codeBox = {
  backgroundColor: "#0f172a",
  borderRadius: "6px",
  margin: "24px 0",
  padding: "12px",
};
const code = {
  fontSize: "20px",
  fontWeight: "bold",
  margin: "0",
  overflowWrap: "anywhere" as const,
  textAlign: "center" as const,
};
