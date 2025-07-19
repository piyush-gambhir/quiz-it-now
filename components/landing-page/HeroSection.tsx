import { BookOpen, PlayCircle } from 'lucide-react';
import Link from 'next/link';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

const HeroSection = () => {
    return (
        <section className="py-32 px-8">
            <div className="container mx-auto">
                <Badge
                    variant="outline"
                    className="mb-4 max-w-full text-sm font-normal lg:mb-10 lg:py-2 lg:pl-2 lg:pr-5"
                >
                    <span className="mr-2 flex size-8 shrink-0 items-center justify-center rounded-full bg-accent">
                        <BookOpen className="size-4" />
                    </span>
                    <p className="">
                        Instant quiz generation from any content source.
                    </p>
                </Badge>
                <h1 className="mb-6 text-4xl font-bold leading-none tracking-tighter md:text-[7vw] lg:text-8xl">
                    Transform Learning with AI-Powered Quizzes.
                </h1>
                <p className="max-w-2xl text-muted-foreground md:text-[2vw] lg:text-xl">
                    Create and customize quizzes effortlessly using our
                    AI-powered platform. Automate question generation, track
                    progress, and enhance engagement.
                </p>
                <div className="mt-6 flex flex-col gap-4 sm:flex-row lg:mt-10">
                    <Link href="/quiz/generate" prefetch={true}>
                        <Button size={'lg'} className="w-full md:w-auto">
                            Generate Quiz
                        </Button>
                    </Link>
                    <Button
                        disabled
                        size={'lg'}
                        variant={'outline'}
                        className="w-full md:w-auto"
                    >
                        <PlayCircle className="mr-2 size-4" />
                        Watch Tutorial
                    </Button>
                </div>
            </div>
        </section>
    );
};

export default HeroSection;
