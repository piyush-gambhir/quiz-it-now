import { Check } from 'lucide-react';
import Link from 'next/link';

import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

const plans = [
    {
        name: 'Free',
        price: '$0',
        description: 'Perfect for getting started',
        features: [
            'Generate 5 quizzes/month',
            'Text input support',
            'Basic question types',
            'Email support',
        ],
        cta: 'Get Started',
        href: '/register',
        popular: false,
    },
    {
        name: 'Pro',
        price: '$19',
        period: '/mo',
        description: 'Best for professionals',
        features: [
            'Generate 100 quizzes/month',
            'All input sources (PDF, video, audio)',
            'Advanced question types',
            'Priority email support',
            'Custom branding',
            'Analytics dashboard',
        ],
        cta: 'Start Free Trial',
        href: '/register?plan=pro',
        popular: true,
    },
    {
        name: 'Enterprise',
        price: 'Custom',
        description: 'For teams and organizations',
        features: [
            'Unlimited quizzes',
            'All Pro features',
            'SSO integration',
            'Dedicated support',
            'Custom integrations',
            'SLA guarantee',
        ],
        cta: 'Contact Sales',
        href: '/contact-us',
        popular: false,
    },
];

export default function PricingSection() {
    return (
        <section className="border-t border-border/40 py-20 md:py-28 px-6">
            <div className="mx-auto max-w-6xl">
                <div className="mb-14 text-center">
                    <p className="text-sm font-medium text-primary mb-2">
                        Pricing
                    </p>
                    <h2 className="text-3xl font-bold tracking-tight md:text-4xl">
                        Simple, transparent pricing
                    </h2>
                    <p className="mt-3 text-muted-foreground max-w-lg mx-auto">
                        Start for free and upgrade as you grow.
                    </p>
                </div>

                <div className="grid gap-6 md:grid-cols-3 max-w-5xl mx-auto">
                    {plans.map((plan, idx) => (
                        <div
                            key={idx}
                            className={cn(
                                'relative rounded-lg border p-6 md:p-8 flex flex-col',
                                plan.popular
                                    ? 'border-primary bg-primary/2 shadow-sm'
                                    : 'border-border',
                            )}
                        >
                            {plan.popular && (
                                <span className="absolute -top-3 left-4 rounded-full bg-primary px-3 py-0.5 text-xs font-medium text-primary-foreground">
                                    Popular
                                </span>
                            )}

                            <div>
                                <h3 className="text-lg font-semibold">
                                    {plan.name}
                                </h3>
                                <p className="mt-1 text-sm text-muted-foreground">
                                    {plan.description}
                                </p>
                            </div>

                            <div className="mt-6 mb-6">
                                <span className="text-4xl font-bold tracking-tight">
                                    {plan.price}
                                </span>
                                {plan.period && (
                                    <span className="text-sm text-muted-foreground">
                                        {plan.period}
                                    </span>
                                )}
                            </div>

                            <ul className="mb-8 space-y-3 flex-1">
                                {plan.features.map((feature, i) => (
                                    <li
                                        key={i}
                                        className="flex items-start gap-2.5 text-sm"
                                    >
                                        <Check className="size-4 text-primary shrink-0 mt-0.5" />
                                        {feature}
                                    </li>
                                ))}
                            </ul>

                            <Link href={plan.href}>
                                <Button
                                    className="w-full"
                                    variant={
                                        plan.popular ? 'default' : 'outline'
                                    }
                                >
                                    {plan.cta}
                                </Button>
                            </Link>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
