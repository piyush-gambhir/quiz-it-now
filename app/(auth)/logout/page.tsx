import { notFound } from 'next/navigation';

import { getServerSession } from '@/lib/auth/get-session';

import LogoutPage from '@/components/LogoutPage';

export default async function page() {
    const session = await getServerSession();
    if (!session) {
        return notFound();
    }
    return <LogoutPage />;
}
