'use client';

import { Loader2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import React, { useEffect, useRef } from 'react';

import { logout } from '@/actions/auth';

export default function LogoutPage() {
  const router = useRouter();
  const logoutButtonRef = useRef<HTMLButtonElement>(null);

  const handleLogout = async () => {
    await logout();
    router.push('/login');
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      if (logoutButtonRef.current) {
        logoutButtonRef.current.click();
      }
    }, 2000);

    return () => clearTimeout(timer);
  }, [router]);
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background p-4 text-muted-foreground">
      <div className="text-center">
        <Loader2
          className="mx-auto mb-8 h-16 w-16 animate-spin text-primary"
          aria-hidden="true"
        />
        <h1 className="mb-4 text-3xl font-bold text-primary md:text-4xl">
          Signing Out
        </h1>
        <p className="mx-auto mb-8 max-w-md text-xl">
          Please wait while we securely log you out of your account.
        </p>
        <p className="text-lg text-gray-400">
          You will be redirected in a few seconds...
        </p>
      </div>
      <div className="mt-12 max-w-md text-center text-sm text-gray-500">
        <p>
          Thank you for using our service. We hope you enjoyed your cinematic
          experience!
        </p>
      </div>
      <button ref={logoutButtonRef} className="hidden" onClick={handleLogout}>
        Sign Out Now
      </button>
    </div>
  );
}
