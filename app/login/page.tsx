import { Suspense } from 'react';
import { LoginForm } from '@/components/LoginForm';
import { SignInForm } from '@/components/SignInForm';

export default function LoginPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <LoginForm />
    </Suspense>
  );
}
