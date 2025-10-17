"use client";

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function HomePage() {
  const router = useRouter();

  useEffect(() => {
    router.replace('/pages/commentaries');
  }, [router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-pink-100">
      <div className="text-center">
        <div className="w-8 h-8 border-4 border-pink-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
        <p className="text-pink-600 font-medium">Redirection en cours...</p>
      </div>
    </div>
  );
}
