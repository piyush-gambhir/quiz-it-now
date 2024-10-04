'use client';

import React from 'react';

import Error from '@/components/svg/error';

export default function error() {
  return (
    <div className="grid min-h-[80vh] place-content-center bg-white px-4">
      <div className="text-center">
        <h1 className="mt-6 text-2xl font-bold tracking-tight text-gray-900 sm:text-4xl">
          Uh-oh!
        </h1>
        <Error />
        <p className="mt-4 text-gray-500">We can&apos;t find that page.</p>
      </div>
    </div>
  );
}
