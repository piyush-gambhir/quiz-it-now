'use client';

import Error from '@/components/svg/error';

export default function NotFound() {
    return (
        <div className="grid min-h-[80vh] place-content-center  px-4">
            <div className="text-center">
                <h1 className="mt-6 text-2xl font-bold tracking-tight dark:text-white sm:text-4xl">
                    Uh-oh!
                </h1>
                <Error />
                <p className="mt-4 text-black  dark:text-white">
                    We can&apos;t find that page.
                </p>
            </div>
        </div>
    );
}
