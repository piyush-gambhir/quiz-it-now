import { Shield } from 'lucide-react';

import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';

export default function PrivacyPolicyPage() {
    return (
        <main className="py-16 px-4 container mx-auto">
            <Card className="border-none shadow-none">
                <CardHeader className="space-y-2 ">
                    <CardTitle className="text-4xl font-bold flex items-center">
                        <Shield className="mr-3 h-8 w-8 text-primary" />
                        Privacy Policy
                    </CardTitle>
                    <CardDescription className="text-lg">
                        Last updated: October 17, 2024
                    </CardDescription>
                </CardHeader>
                <CardContent className="prose dark:prose-invert max-w-none">
                    <section className="mb-8">
                        <h2 className="text-xl font-semibold mb-4">
                            1. Introduction
                        </h2>
                        <p className="text-lg ml-5">
                            Welcome to Quiz Master. We are committed to
                            protecting your personal information and your right
                            to privacy. This Privacy Policy explains how we
                            collect, use, disclose, and safeguard your
                            information when you use our website and services.
                        </p>
                    </section>

                    <section className="mb-8">
                        <h2 className="text-xl font-semibold mb-4">
                            2. Information We Collect
                        </h2>
                        <p className="text-lg ml-5 mb-2">
                            We collect information that you provide directly to
                            us, including:
                        </p>
                        <ul className="list-disc pl-6 text-lg">
                            <li>
                                Personal information (such as name and email
                                address) when you create an account
                            </li>
                            <li>Quiz responses and results</li>
                            <li>Communication data when you contact us</li>
                        </ul>
                    </section>

                    <section className="mb-8">
                        <h2 className="text-xl font-semibold mb-4">
                            3. How We Use Your Information
                        </h2>
                        <p className="text-lg ml-5 mb-2">
                            We use the information we collect for various
                            purposes, including:
                        </p>
                        <ul className="list-disc pl-6 text-lg">
                            <li>
                                Providing, maintaining, and improving our
                                services
                            </li>
                            <li>Personalizing your experience</li>
                            <li>Communicating with you about our services</li>
                            <li>
                                Analyzing usage patterns to enhance our platform
                            </li>
                        </ul>
                    </section>

                    <section className="mb-8">
                        <h2 className="text-xl font-semibold mb-4">
                            4. Data Security
                        </h2>
                        <p className="text-lg ml-5">
                            We implement appropriate technical and
                            organizational measures to protect your personal
                            information against unauthorized or unlawful
                            processing, accidental loss, destruction, or damage.
                        </p>
                    </section>

                    <section className="mb-8">
                        <h2 className="text-xl font-semibold mb-4">
                            5. Data Retention
                        </h2>
                        <p className="text-lg ml-5">
                            We retain your personal information for as long as
                            necessary to fulfill the purposes outlined in this
                            Privacy Policy, unless a longer retention period is
                            required or permitted by law.
                        </p>
                    </section>

                    <section className="mb-8">
                        <h2 className="text-xl font-semibold mb-4">
                            6. Your Rights
                        </h2>
                        <p className="text-lg ml-5">
                            Depending on your location, you may have certain
                            rights regarding your personal information,
                            including the right to access, correct, or delete
                            your data. To exercise these rights, please contact
                            us using the information provided below.
                        </p>
                    </section>

                    <section className="mb-8">
                        <h2 className="text-xl font-semibold mb-4">
                            7. Changes to This Policy
                        </h2>
                        <p className="text-lg ml-5">
                            We may update this Privacy Policy from time to time.
                            We will notify you of any changes by posting the new
                            Privacy Policy on this page and updating the
                            &quot;Last updated&quot; date.
                        </p>
                    </section>

                    <section className="mb-8">
                        <h2 className="text-xl font-semibold mb-4">
                            8. Contact Us
                        </h2>
                        <p className="text-lg ml-5">
                            If you have any questions about this Privacy Policy,
                            please contact us at:
                        </p>
                        <p className="text-lg mt-2">
                            Email:{' '}
                            <a
                                href="mailto:privacy@quizmaster.com"
                                className="text-primary hover:underline"
                            >
                                privacy@quizmaster.com
                            </a>
                        </p>
                        <p className="text-lg ml-5">
                            Address: 123 Quiz Street, Knowledge City, QZ 12345
                        </p>
                    </section>
                </CardContent>
            </Card>
        </main>
    );
}
