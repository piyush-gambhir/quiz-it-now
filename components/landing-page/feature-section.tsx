import { Brain, FileText, Share2, Sparkles, Upload, Zap } from 'lucide-react';

const features = [
    {
        title: 'AI-Powered',
        description:
            'Advanced language models understand context and generate relevant, challenging questions.',
        icon: Brain,
    },
    {
        title: 'Multiple Sources',
        description:
            'Upload PDFs, paste text, or provide URLs. Support for documents, articles, and more.',
        icon: Upload,
    },
    {
        title: 'Lightning Fast',
        description:
            'Generate comprehensive quizzes in seconds. No more hours of manual question creation.',
        icon: Zap,
    },
    {
        title: 'Customizable',
        description:
            'Adjust difficulty levels, question count, and quiz parameters to match your needs.',
        icon: Sparkles,
    },
    {
        title: 'Various Formats',
        description:
            'MCQ, true/false, short answer and more question types to test different skills.',
        icon: FileText,
    },
    {
        title: 'Easy Sharing',
        description:
            'Share your quizzes via a simple link. Take quizzes anytime, anywhere.',
        icon: Share2,
    },
];

const FeatureSection = () => {
    return (
        <section className="py-20 md:py-28 px-4 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-7xl">
                <div className="mb-14 max-w-md">
                    <p className="text-sm font-medium text-primary mb-2">
                        Features
                    </p>
                    <h2 className="text-3xl font-bold tracking-tight md:text-4xl">
                        Everything you need
                    </h2>
                    <p className="mt-3 text-muted-foreground">
                        Powerful tools to create, customize, and share quizzes.
                    </p>
                </div>

                <div className="grid gap-px overflow-hidden rounded-md border border-border bg-border sm:grid-cols-2 lg:grid-cols-3">
                    {features.map((feature, idx) => (
                        <div
                            key={idx}
                            className="group bg-background p-5 sm:p-6 md:p-8 lg:p-10 transition-colors hover:bg-muted/40"
                        >
                            <div className="mb-4 flex size-10 items-center justify-center rounded border border-border bg-muted/50">
                                <feature.icon className="size-5 text-primary" />
                            </div>
                            <h3 className="text-base font-semibold mb-2">
                                {feature.title}
                            </h3>
                            <p className="text-sm text-muted-foreground leading-relaxed">
                                {feature.description}
                            </p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default FeatureSection;
