import React from 'react';

import LoginForm from '@/components/auth/SignUpForm';

export default function page() {
  return (
    <div className="flex justify-center items-center min-h-[80vh]">
      <LoginForm />
    </div>
  );
}
