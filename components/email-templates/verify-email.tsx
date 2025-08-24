import * as React from 'react';
import {
  Html,
  Head,
  Body,
  Container,
  Section,
  Text,
  Button,
  Hr,
  Tailwind,
} from '@react-email/components';

interface VerifyEmailProps {
  userEmail: string
  verificationUrl: string
}

export const VerificationEmail = ({ userEmail, verificationUrl }: VerifyEmailProps) => {

  return (
    <Html lang="en" dir="ltr">
      <Tailwind>
        <Head />
        <Body className="bg-gray-100 font-sans py-[40px]">
          <Container className="bg-white mx-auto px-[40px] py-[40px] rounded-[8px] max-w-[600px]">
            {/* Header */}
            <Section className="text-center mb-[32px]">
              <Text className="text-[24px] font-bold text-gray-900 m-0 mb-[8px]">
                Verify Your Email Address
              </Text>
              <Text className="text-[16px] text-gray-600 m-0">
                Please confirm your email address to complete your account setup
              </Text>
            </Section>

            {/* Main Content */}
            <Section className="mb-[32px]">
              <Text className="text-[16px] text-gray-800 mb-[16px] leading-[24px]">
                Hi there,
              </Text>
              <Text className="text-[16px] text-gray-800 mb-[16px] leading-[24px]">
                Thanks for signing up! We need to verify your email address <strong>{userEmail}</strong> to activate your account.
              </Text>
              <Text className="text-[16px] text-gray-800 mb-[24px] leading-[24px]">
                Click the button below to verify your email address:
              </Text>
            </Section>

            {/* Verification Button */}
            <Section className="text-center mb-[32px]">
              <Button
                href={verificationUrl}
                className="bg-blue-600 text-white px-[32px] py-[12px] rounded-[8px] text-[16px] font-semibold no-underline box-border inline-block"
              >
                Verify Email Address
              </Button>
            </Section>

            {/* Alternative Link */}
            <Section className="mb-[32px]">
              <Text className="text-[14px] text-gray-600 leading-[20px]">
                If the button doesn&apos;t work, you can copy and paste this link into your browser:
              </Text>
              <Text className="text-[14px] text-blue-600 break-all leading-[20px]">
                {verificationUrl}
              </Text>
            </Section>

            <Hr className="border-gray-200 my-[24px]" />

            {/* Security Notice */}
            <Section className="mb-[24px]">
              <Text className="text-[14px] text-gray-600 leading-[20px]">
                <strong>Security Notice:</strong> This verification link will expire in 24 hours. If you didn&apos;t create an account, you can safely ignore this email.
              </Text>
            </Section>

            {/* Footer */}
            <Section className="text-center">
              <Text className="text-[12px] text-gray-500 m-0 mb-[8px]">
                This email was sent to {userEmail}
              </Text>
              <Text className="text-[12px] text-gray-500 m-0 mb-[8px]">
                123 Business Street, Suite 100, City, State 12345
              </Text>
              <Text className="text-[12px] text-gray-500 m-0">
                © 2025 Your Company Name. All rights reserved.
              </Text>
            </Section>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
};

VerificationEmail.PreviewProps = {
  userEmail: 'debasishbaraiju@gmail.com',
  verificationUrl: 'https://yourapp.com/verify?token=abc123xyz',
};

export default VerificationEmail;

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
