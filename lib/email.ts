import { Resend } from 'resend';
import { randomUUID } from 'crypto';
import { prisma } from '@/lib/prisma';
import VerifyEmailTemplate from '@/components/email-templates/verify-email';

const resend = new Resend(process.env.RESEND_API_KEY);

interface VerifyEmailProps {
  email: string;
  userId: string;
}

export async function sendVerificationEmail({ email, userId }: VerifyEmailProps): Promise<unknown> {
  try {
    if (!email) {
      throw new Error("Email is null");
    }

    const token = `${randomUUID()}${randomUUID()}`.replace(/-/g, "");
    
    // Update user with verification token
    await prisma.user.update({
      where: { id: userId },
      data: { verifyToken: token },
    });

    const baseUrl = process.env.NEXTAUTH_URL || "http://localhost:3000";

    const { data, error } = await resend.emails.send({
      from: "RemindMe <no-reply@debasishbarai.com>",
      to: [`${email}`],
      subject: "Verify your email",
      react: VerifyEmailTemplate({ baseUrl, token }),
    });

    if (error) {
      console.error('Resend error:', error);
      throw new Error("Failed to send verification email");
    }

    return data;
  } catch (error) {
    console.error('Error sending email:', error);
    throw error;
  }
} 