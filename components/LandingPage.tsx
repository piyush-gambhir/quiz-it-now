import Footer from '@/components/Footer';
import Header from '@/components/Header';
import FeaturesSection from '@/components/landing-page/FeatureSection';
import HeroSection from '@/components/landing-page/HeroSection';
import HowItWorksSection from '@/components/landing-page/HowItWorksSection';
import PricingSection from '@/components/landing-page/PricingSection';

// import QuizGenerator from "@/components/QuizGenerator"

export default function LandingPage() {
  return (
    <main className="flex-grow">
      <HeroSection />
      <FeaturesSection />
      <HowItWorksSection />
      {/* Commented out QuizGenerator section for now */}
      {/* <section id="quiz-generator" className="py-20">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-12">Try the Quiz Generator</h2>
            <QuizGenerator />
          </div>
        </section> */}
      <PricingSection />
    </main>
  );
}
