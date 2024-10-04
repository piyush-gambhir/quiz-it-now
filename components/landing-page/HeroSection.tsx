import Link from 'next/link';

import { Button } from '@/components/ui/button';

export default function HeroSection() {
  return (
    <section className="py-20 text-center">
      <div className="container mx-auto px-4">
        <h1 className="text-4xl md:text-6xl font-bold mb-6">
          Generate Quizzes from Any Content
        </h1>
        <p className="text-xl mb-8">
          Transform text, videos, audio, and PDFs into engaging quizzes with AI
        </p>
        <Button size="lg" asChild>
          <Link href="#quiz-generator">Try It Now</Link>
        </Button>
      </div>
    </section>
  );
}
