'use client';

import FeatureSection from '@/components/landing-page/feature-section';
import HeroSection from '@/components/landing-page/hero-section';
import HowItWorksSection from '@/components/landing-page/how-it-works-section';

export default function LandingPage() {
    return (
        <main className="grow">
            <HeroSection />
            <FeatureSection />
            <HowItWorksSection />
        </main>
    );
}
