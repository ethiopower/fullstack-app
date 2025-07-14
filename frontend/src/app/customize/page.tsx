'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function CustomizePage() {
  const router = useRouter();

  useEffect(() => {
    router.replace('/customize/step1');
  }, [router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-slate-900 mx-auto"></div>
        <p className="mt-4 text-slate-600">Preparing your customization experience...</p>
      </div>
    </div>
  );
} 