import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Play, ArrowRight, Shield, Leaf, Zap } from "lucide-react";
import dashboardImage from "@assets/generated_images/formulation_dashboard_interface_mockup.png";

interface HeroSectionProps {
  onJoinWaitlist: () => void;
}

export default function HeroSection({ onJoinWaitlist }: HeroSectionProps) {
  const [isPlaying, setIsPlaying] = useState(false);

  return (
    <section className="relative pt-32 pb-16 lg:pt-40 lg:pb-24 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-primary/5 via-transparent to-transparent pointer-events-none" />
      
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center max-w-4xl mx-auto mb-12 lg:mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6" data-testid="badge-announcement">
            <Zap className="w-4 h-4" />
            Now accepting early access partners
          </div>
          
          <h1 className="text-4xl lg:text-6xl xl:text-7xl font-bold tracking-tight mb-6" data-testid="text-hero-headline">
            Predictive Formulation
            <span className="block text-primary">for Sustainable Beauty</span>
          </h1>
          
          <p className="text-lg lg:text-xl text-muted-foreground max-w-2xl mx-auto mb-8" data-testid="text-hero-subheadline">
            Predict ingredient compatibility, automate MoCRA/FDA/EU compliance, and accelerate your skincare and haircare development with our all-in-one platform.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button size="lg" onClick={onJoinWaitlist} className="w-full sm:w-auto" data-testid="button-hero-waitlist">
              Get Early Access
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
            <Button
              size="lg"
              variant="outline"
              onClick={() => setIsPlaying(true)}
              className="w-full sm:w-auto"
              data-testid="button-watch-demo"
            >
              <Play className="w-4 h-4 mr-2" />
              Watch Demo
            </Button>
          </div>
        </div>

        <div className="relative max-w-5xl mx-auto">
          <div className="relative rounded-xl overflow-hidden border border-border bg-card shadow-2xl">
            {isPlaying ? (
              <div className="aspect-video bg-black flex items-center justify-center">
                <p className="text-white text-lg">Demo video playing...</p>
              </div>
            ) : (
              <div className="relative aspect-video group cursor-pointer" onClick={() => setIsPlaying(true)}>
                <img
                  src={dashboardImage}
                  alt="StabiliMetric Pro Dashboard"
                  className="w-full h-full object-cover"
                  data-testid="img-hero-dashboard"
                />
                <div className="absolute inset-0 bg-black/30 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <div className="w-20 h-20 rounded-full bg-white/90 flex items-center justify-center">
                    <Play className="w-8 h-8 text-primary ml-1" />
                  </div>
                </div>
              </div>
            )}
          </div>
          
          <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-6 px-6 py-3 rounded-full bg-card border border-border shadow-lg">
            <div className="flex items-center gap-2 text-sm">
              <Shield className="w-4 h-4 text-primary" />
              <span className="text-muted-foreground">FDA Compliant</span>
            </div>
            <div className="w-px h-4 bg-border" />
            <div className="flex items-center gap-2 text-sm">
              <Leaf className="w-4 h-4 text-primary" />
              <span className="text-muted-foreground">Sustainable Focus</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
