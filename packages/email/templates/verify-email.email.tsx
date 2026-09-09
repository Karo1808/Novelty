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

interface VerifyEmailProps {
  validationCode?: string;
}

export const VerifyEmail = ({ validationCode }: VerifyEmailProps) => (
  <Html>
    <Head />
    <Preview>Verify your Novelty email address</Preview>
    <Body style={body}>
      <Container style={container}>
        <Heading style={heading}>Verify your email</Heading>
        <Text style={text}>
          Enter this code in Novelty to verify your email address:
        </Text>
        <Section style={codeBox}>
          <Text style={code}>{validationCode}</Text>
        </Section>
        <Text style={muted}>
          If you did not request this email, you can safely ignore it.
        </Text>
      </Container>
    </Body>
  </Html>
);

VerifyEmail.PreviewProps = {
  validationCode: "DJZ-TLX",
} satisfies VerifyEmailProps;

export default VerifyEmail;

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
  fontSize: "26px",
  fontWeight: "bold",
  letterSpacing: "6px",
  margin: "0",
  textAlign: "center" as const,
};
