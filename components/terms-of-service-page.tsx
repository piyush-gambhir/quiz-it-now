import { FileText } from 'lucide-react';

import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';

export default function TermsOfServicePage() {
    return (
        <main className="py-16 px-4 container mx-auto">
            <Card className="mx-auto shadow-lg border border-gray-200 dark:border-gray-700">
                <CardHeader className="space-y-2">
                    <CardTitle className="text-4xl font-bold flex items-center">
                        <FileText className="mr-3 h-8 w-8 text-primary" />
                        Terms of Service
                    </CardTitle>
                    <CardDescription className="text-lg">
                        Last updated: October 17, 2024
                    </CardDescription>
                </CardHeader>
                <CardContent className="prose dark:prose-invert max-w-none">
                    <section className="mb-8">
                        <h2 className="text-3xl font-semibold mb-4">
                            1. Introduction
                        </h2>
                        <p className="text-lg">
                            Welcome to Quiz Master. By using our website and
                            services, you agree to be bound by these Terms of
                            Service. Please read them carefully before using our
                            platform.
                        </p>
                    </section>

                    <section className="mb-8">
                        <h2 className="text-3xl font-semibold mb-4">
                            2. Use of Services
                        </h2>
                        <p className="text-lg mb-2">
                            You agree to use our services only for lawful
                            purposes and in accordance with these Terms. You are
                            prohibited from:
                        </p>
                        <ul className="list-disc pl-6 text-lg">
                            <li>
                                Violating any applicable laws or regulations
                            </li>
                            <li>
                                Infringing on the intellectual property rights
                                of others
                            </li>
                            <li>
                                Attempting to gain unauthorized access to our
                                systems
                            </li>
                            <li>
                                Interfering with the proper functioning of our
                                services
                            </li>
                        </ul>
                    </section>

                    <section className="mb-8">
                        <h2 className="text-3xl font-semibold mb-4">
                            3. User Accounts
                        </h2>
                        <p className="text-lg">
                            You are responsible for maintaining the
                            confidentiality of your account and password. You
                            agree to notify us immediately of any unauthorized
                            use of your account.
                        </p>
                    </section>

                    <section className="mb-8">
                        <h2 className="text-3xl font-semibold mb-4">
                            4. Intellectual Property
                        </h2>
                        <p className="text-lg">
                            All content and materials available on Quiz Master,
                            including but not limited to text, graphics, website
                            name, code, images and logos are the intellectual
                            property of Quiz Master and are protected by
                            applicable copyright and trademark law.
                        </p>
                    </section>

                    <section className="mb-8">
                        <h2 className="text-3xl font-semibold mb-4">
                            5. Limitation of Liability
                        </h2>
                        <p className="text-lg">
                            Quiz Master shall not be liable for any indirect,
                            incidental, special, consequential or punitive
                            damages, including without limitation, loss of
                            profits, data, use, goodwill, or other intangible
                            losses, resulting from your access to or use of or
                            inability to access or use the services.
                        </p>
                    </section>

                    <section className="mb-8">
                        <h2 className="text-3xl font-semibold mb-4">
                            6. Modifications
                        </h2>
                        <p className="text-lg">
                            We reserve the right to modify or replace these
                            Terms at any time. If a revision is material, we
                            will provide at least 30 days&apos; notice prior to
                            any new terms taking effect.
                        </p>
                    </section>

                    <section className="mb-8">
                        <h2 className="text-3xl font-semibold mb-4">
                            7. Governing Law
                        </h2>
                        <p className="text-lg">
                            These Terms shall be governed and construed in
                            accordance with the laws of [Your Jurisdiction],
                            without regard to its conflict of law provisions.
                        </p>
                    </section>

                    <section className="mb-8">
                        <h2 className="text-3xl font-semibold mb-4">
                            8. Contact Us
                        </h2>
                        <p className="text-lg">
                            If you have any questions about these Terms, please
                            contact us at:
                        </p>
                        <p className="text-lg mt-2">
                            Email:{' '}
                            <a
                                href="mailto:terms@quizmaster.com"
                                className="text-primary hover:underline"
                            >
                                terms@quizmaster.com
                            </a>
                        </p>
                        <p className="text-lg">
                            Address: 123 Quiz Street, Knowledge City, QZ 12345
                        </p>
                    </section>
                </CardContent>
            </Card>
        </main>
    );
}
