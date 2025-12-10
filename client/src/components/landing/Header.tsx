import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Menu, X, Beaker } from "lucide-react";

interface HeaderProps {
  onJoinWaitlist: () => void;
}

export default function Header({ onJoinWaitlist }: HeaderProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const scrollToSection = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
    setMobileMenuOpen(false);
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b border-border">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex items-center justify-between gap-4 h-16">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-lg bg-primary flex items-center justify-center">
              <Beaker className="w-5 h-5 text-primary-foreground" />
            </div>
            <span className="font-semibold text-lg" data-testid="text-logo">StabiliMetric Pro</span>
          </div>

          <nav className="hidden md:flex items-center gap-6">
            <button
              onClick={() => scrollToSection("features")}
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
              data-testid="link-features"
            >
              Features
            </button>
            <button
              onClick={() => scrollToSection("how-it-works")}
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
              data-testid="link-how-it-works"
            >
              How It Works
            </button>
            <button
              onClick={() => scrollToSection("benefits")}
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
              data-testid="link-benefits"
            >
              Benefits
            </button>
          </nav>

          <div className="flex items-center gap-3">
            <Button
              onClick={onJoinWaitlist}
              className="hidden md:flex"
              data-testid="button-header-waitlist"
            >
              Join Waitlist
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              data-testid="button-mobile-menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </Button>
          </div>
        </div>

        {mobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-border">
            <nav className="flex flex-col gap-3">
              <button
                onClick={() => scrollToSection("features")}
                className="text-left py-2 text-muted-foreground hover:text-foreground transition-colors"
                data-testid="link-features-mobile"
              >
                Features
              </button>
              <button
                onClick={() => scrollToSection("how-it-works")}
                className="text-left py-2 text-muted-foreground hover:text-foreground transition-colors"
                data-testid="link-how-it-works-mobile"
              >
                How It Works
              </button>
              <button
                onClick={() => scrollToSection("benefits")}
                className="text-left py-2 text-muted-foreground hover:text-foreground transition-colors"
                data-testid="link-benefits-mobile"
              >
                Benefits
              </button>
              <Button onClick={onJoinWaitlist} className="mt-2" data-testid="button-waitlist-mobile">
                Join Waitlist
              </Button>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}
