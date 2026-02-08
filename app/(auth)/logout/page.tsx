import { notFound } from 'next/navigation';

import { getServerSession } from '@/lib/auth/get-session';

import LogoutPage from '@/components/logout-page';

export default async function Page() {
    const session = await getServerSession();
    if (!session) {
        return notFound();
    }
    return <LogoutPage />;
}
