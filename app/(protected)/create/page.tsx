import { Suspense } from 'react';
import { Loader2 } from 'lucide-react';
import CreateVideoForm from '@/components/CreateVideoForm';

export default function CreatePage() {
  return (
    <Suspense fallback={
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    }>
      <CreateVideoForm />
    </Suspense>
  );
} 
