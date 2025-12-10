import { Beaker, Shield, Globe, Lock } from "lucide-react";
import { SiLinkedin, SiX } from "react-icons/si";

const footerLinks = {
  product: [
    { label: "Features", href: "#features" },
    { label: "How It Works", href: "#how-it-works" },
    { label: "Pricing", href: "#", badge: "Coming Soon" },
  ],
  resources: [
    { label: "Documentation", href: "#" },
    { label: "API Reference", href: "#" },
    { label: "Blog", href: "#" },
  ],
  company: [
    { label: "About", href: "#" },
    { label: "Careers", href: "#" },
    { label: "Contact", href: "#" },
  ],
  legal: [
    { label: "Privacy Policy", href: "#" },
    { label: "Terms of Service", href: "#" },
  ],
};

const trustBadges = [
  { icon: Shield, label: "FDA Compliant" },
  { icon: Globe, label: "EU Certified" },
  { icon: Lock, label: "SOC 2 Secure" },
];

export default function Footer() {
  const scrollToSection = (href: string) => {
    if (href.startsWith("#") && href.length > 1) {
      document.getElementById(href.slice(1))?.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <footer className="bg-card border-t border-border">
      <div className="max-w-7xl mx-auto px-6 py-12 lg:py-16">
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-8 mb-12">
          <div className="col-span-2 lg:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-9 h-9 rounded-lg bg-primary flex items-center justify-center">
                <Beaker className="w-5 h-5 text-primary-foreground" />
              </div>
              <span className="font-semibold text-lg">StabiliMetric Pro</span>
            </div>
            <p className="text-sm text-muted-foreground mb-4">
              Predictive cosmetic formulation for the sustainable beauty industry.
            </p>
            <div className="flex items-center gap-3">
              <a
                href="#"
                className="w-9 h-9 rounded-lg bg-muted flex items-center justify-center hover-elevate"
                aria-label="LinkedIn"
                data-testid="link-linkedin"
              >
                <SiLinkedin className="w-4 h-4" />
              </a>
              <a
                href="#"
                className="w-9 h-9 rounded-lg bg-muted flex items-center justify-center hover-elevate"
                aria-label="X (Twitter)"
                data-testid="link-twitter"
              >
                <SiX className="w-4 h-4" />
              </a>
            </div>
          </div>

          <div>
            <h4 className="font-semibold mb-4">Product</h4>
            <ul className="space-y-3">
              {footerLinks.product.map((link) => (
                <li key={link.label}>
                  <button
                    onClick={() => scrollToSection(link.href)}
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors inline-flex items-center gap-2"
                  >
                    {link.label}
                    {link.badge && (
                      <span className="text-xs px-2 py-0.5 rounded-full bg-primary/10 text-primary">
                        {link.badge}
                      </span>
                    )}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-4">Resources</h4>
            <ul className="space-y-3">
              {footerLinks.resources.map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-4">Company</h4>
            <ul className="space-y-3">
              {footerLinks.company.map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row items-center justify-between gap-6 pt-8 border-t border-border">
          <div className="flex flex-wrap items-center justify-center lg:justify-start gap-6">
            {trustBadges.map((badge) => (
              <div key={badge.label} className="flex items-center gap-2 text-sm text-muted-foreground">
                <badge.icon className="w-4 h-4 text-primary" />
                <span>{badge.label}</span>
              </div>
            ))}
          </div>

          <div className="flex flex-wrap items-center justify-center gap-4 text-sm text-muted-foreground">
            {footerLinks.legal.map((link) => (
              <a key={link.label} href={link.href} className="hover:text-foreground transition-colors">
                {link.label}
              </a>
            ))}
            <span>© 2024 StabiliMetric Pro. All rights reserved.</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
