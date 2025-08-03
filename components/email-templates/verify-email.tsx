import {
  Body,
  Button,
  Container,
  Head,
  Heading,
  Html,
  Link,
  Preview,
  Section,
  Text,
} from '@react-email/components';
import * as React from 'react';

interface VerifyEmailTemplateProps {
  baseUrl: string;
  token: string;
}

export default function VerifyEmailTemplate({
  baseUrl,
  token,
}: VerifyEmailTemplateProps) {
  const verifyLink = `${baseUrl}/api/auth/verify?token=${token}`;

  return (
    <Html>
      <Head />
      <Preview>Verify your email address for RemindMe</Preview>
      <Body style={main}>
        <Container style={container}>
          <Heading style={h1}>Verify your email</Heading>
          <Text style={text}>
            Click the button below to verify your email address and get started with RemindMe.
          </Text>
          <Section style={buttonContainer}>
            <Button style={button} href={verifyLink}>
              Verify Email
            </Button>
          </Section>
          <Text style={text}>
            Or copy and paste this URL into your browser:{' '}
            <Link href={verifyLink} style={link}>
              {verifyLink}
            </Link>
          </Text>
          <Text style={footer}>
            If you didn't request this email, you can safely ignore it.
          </Text>
        </Container>
      </Body>
    </Html>
  );
}

const main = {
  backgroundColor: '#f6f9fc',
  padding: '10px 0',
};

const container = {
  backgroundColor: '#ffffff',
  border: '1px solid #f0f0f0',
  borderRadius: '5px',
  margin: '0 auto',
  padding: '45px',
  maxWidth: '600px',
};

const h1 = {
  color: '#1f2937',
  fontSize: '24px',
  fontWeight: '600',
  lineHeight: '1.1',
  margin: '0 0 15px',
};

const text = {
  color: '#374151',
  fontSize: '16px',
  lineHeight: '24px',
  margin: '24px 0',
};

const buttonContainer = {
  textAlign: 'center' as const,
  margin: '32px 0',
};

const button = {
  backgroundColor: '#4F46E5',
  borderRadius: '4px',
  color: '#fff',
  fontSize: '16px',
  textDecoration: 'none',
  textAlign: 'center' as const,
  display: 'inline-block',
  padding: '12px 24px',
};

const link = {
  color: '#4F46E5',
  textDecoration: 'underline',
};

const footer = {
  color: '#666666',
  fontSize: '14px',
  margin: '48px 0 0',
}; 