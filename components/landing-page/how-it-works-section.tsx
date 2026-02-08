import { CheckCircle2, FileText, Wand2 } from 'lucide-react';
import Link from 'next/link';

import { Button } from '@/components/ui/button';

const steps = [
    {
        step: '01',
        title: 'Add Your Content',
        description:
            'Paste text directly, upload a PDF or document, or simply provide a link to any web content.',
        icon: FileText,
    },
    {
        step: '02',
        title: 'AI Generates Questions',
        description:
            'Our AI analyzes your content and automatically creates relevant, well-structured quiz questions.',
        icon: Wand2,
    },
    {
        step: '03',
        title: 'Review & Share',
        description:
            'Review the generated quiz, make edits if needed, then take it yourself or share with others.',
        icon: CheckCircle2,
    },
];

export default function HowItWorksSection() {
    return (
        <section className="border-t border-border/40 py-20 md:py-28 px-4 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-7xl">
                <div className="mb-14 max-w-md">
                    <p className="text-sm font-medium text-primary mb-2">
                        How It Works
                    </p>
                    <h2 className="text-3xl font-bold tracking-tight md:text-4xl">
                        Three simple steps
                    </h2>
                    <p className="mt-3 text-muted-foreground">
                        From content to quiz in under a minute.
                    </p>
                </div>

                <div className="grid gap-8 md:grid-cols-3">
                    {steps.map((item) => (
                        <div key={item.step} className="relative">
                            <span className="text-5xl font-bold text-muted/60 leading-none">
                                {item.step}
                            </span>
                            <div className="mt-4 flex size-10 items-center justify-center rounded border border-border bg-muted/50">
                                <item.icon className="size-5 text-primary" />
                            </div>
                            <h3 className="mt-4 text-lg font-semibold">
                                {item.title}
                            </h3>
                            <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
                                {item.description}
                            </p>
                        </div>
                    ))}
                </div>

                <div className="mt-14">
                    <Link href="/quiz/generate">
                        <Button size="lg" className="h-11 px-6 text-sm">
                            Try It Now
                        </Button>
                    </Link>
                </div>
            </div>
        </section>
    );
}
