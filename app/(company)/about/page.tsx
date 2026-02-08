import { Building2, Target, Users, Zap } from 'lucide-react';
import Link from 'next/link';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import type { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'About',
    description:
        'Learn about QuizItNow — our mission to transform learning with AI-powered quiz generation.',
};

const values = [
    {
        icon: <Zap className="size-6" />,
        title: 'Innovation',
        description:
            'We constantly push boundaries to deliver cutting-edge AI technology that transforms learning experiences.',
    },
    {
        icon: <Users className="size-6" />,
        title: 'Accessibility',
        description:
            'We believe everyone deserves access to powerful educational tools, making learning accessible for all.',
    },
    {
        icon: <Target className="size-6" />,
        title: 'Quality',
        description:
            'We are committed to generating high-quality, accurate quizzes that truly test understanding.',
    },
    {
        icon: <Building2 className="size-6" />,
        title: 'Trust',
        description:
            'We prioritize data security and user privacy, building lasting relationships with our community.',
    },
];

export default function AboutPage() {
    return (
        <main className="flex-grow">
            {/* Hero Section */}
            <section className="py-20 px-8">
                <div className="container mx-auto max-w-4xl text-center">
                    <h1 className="text-4xl md:text-5xl font-bold mb-6">
                        About QuizItNow
                    </h1>
                    <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                        We&apos;re on a mission to transform how people learn
                        and assess knowledge using the power of artificial
                        intelligence.
                    </p>
                </div>
            </section>

            {/* Story Section */}
            <section className="py-16 px-8 bg-muted">
                <div className="container mx-auto max-w-4xl">
                    <div className="grid md:grid-cols-2 gap-12 items-center">
                        <div>
                            <h2 className="text-3xl font-bold mb-6">
                                Our Story
                            </h2>
                            <div className="space-y-4 text-muted-foreground">
                                <p>
                                    QuizItNow was born from a simple
                                    observation: creating quality quizzes is
                                    incredibly time-consuming. Educators spend
                                    hours crafting questions when they could be
                                    teaching.
                                </p>
                                <p>
                                    We built QuizItNow to solve this problem.
                                    Using advanced AI, we can transform any
                                    content—text, PDFs, videos, or audio—into
                                    comprehensive quizzes in seconds.
                                </p>
                                <p>
                                    Today, thousands of educators, trainers, and
                                    content creators use QuizItNow to save time
                                    and engage their audiences with intelligent
                                    assessments.
                                </p>
                            </div>
                        </div>
                        <div className="bg-accent rounded-lg h-64 md:h-80 flex items-center justify-center">
                            <span className="text-muted-foreground">
                                Team Image
                            </span>
                        </div>
                    </div>
                </div>
            </section>

            {/* Values Section */}
            <section className="py-20 px-8">
                <div className="container mx-auto max-w-5xl">
                    <h2 className="text-3xl font-bold text-center mb-12">
                        Our Values
                    </h2>
                    <div className="grid md:grid-cols-2 gap-6">
                        {values.map((value, idx) => (
                            <Card key={idx}>
                                <CardHeader>
                                    <div className="flex items-center gap-4">
                                        <div className="flex items-center justify-center size-12 rounded-lg bg-primary/10 text-primary">
                                            {value.icon}
                                        </div>
                                        <CardTitle>{value.title}</CardTitle>
                                    </div>
                                </CardHeader>
                                <CardContent>
                                    <p className="text-muted-foreground">
                                        {value.description}
                                    </p>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-16 px-8 bg-primary text-primary-foreground">
                <div className="container mx-auto max-w-3xl text-center">
                    <h2 className="text-3xl font-bold mb-4">
                        Ready to Transform Your Content?
                    </h2>
                    <p className="mb-8 opacity-90">
                        Join thousands of educators and content creators who are
                        saving time with AI-powered quizzes.
                    </p>
                    <Link
                        href="/register"
                        className="inline-flex items-center justify-center rounded-md bg-background text-foreground px-8 py-3 font-medium hover:bg-background/90 transition-colors"
                    >
                        Get Started for Free
                    </Link>
                </div>
            </section>
        </main>
    );
}
