import { useRef } from "react";
import Header from "@/components/landing/Header";
import HeroSection from "@/components/landing/HeroSection";
import FeatureGallery from "@/components/landing/FeatureGallery";
import HowItWorks from "@/components/landing/HowItWorks";
import BenefitsSection from "@/components/landing/BenefitsSection";
import WaitlistSection from "@/components/landing/WaitlistSection";
import Footer from "@/components/landing/Footer";

export default function LandingPage() {
  const waitlistRef = useRef<HTMLDivElement>(null);

  const scrollToWaitlist = () => {
    waitlistRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="min-h-screen bg-background">
      <Header onJoinWaitlist={scrollToWaitlist} />
      <main>
        <HeroSection onJoinWaitlist={scrollToWaitlist} />
        <FeatureGallery />
        <HowItWorks />
        <BenefitsSection />
        <WaitlistSection formRef={waitlistRef} />
      </main>
      <Footer />
    </div>
  );
}
