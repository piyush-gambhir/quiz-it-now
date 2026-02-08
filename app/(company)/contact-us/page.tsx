import ContactUsPage from '@/components/contact-us-page';

import type { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Contact Us',
    description:
        "Get in touch with the QuizItNow team. We'd love to hear from you.",
};

export default function Page() {
    return <ContactUsPage />;
}
