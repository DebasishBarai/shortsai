import { Suspense } from 'react';
import Image from 'next/image'
import { LoginForm } from '@/components/LoginForm';

export default function LoginPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <div className='w-full h-full grid grid-cols-1 md:grid-cols-2'>
        <LoginForm />
        <div className='hidden md:flex w-[50vw] justify-center items-center'>
          <Image src="/signin.webp" alt="logo" width={800} height={800} className='rounded-2xl z-20' />
        </div>
      </div>
    </Suspense>
  );
}
