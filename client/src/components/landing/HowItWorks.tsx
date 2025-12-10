import { Upload, Cpu, CheckCircle, Package } from "lucide-react";

const steps = [
  {
    number: "01",
    icon: Upload,
    title: "Input Your Ingredients",
    description: "Upload your ingredient list or select from our extensive sustainable database.",
  },
  {
    number: "02",
    icon: Cpu,
    title: "Smart Analysis",
    description: "Our engine predicts compatibility, stability, and potential issues in seconds.",
  },
  {
    number: "03",
    icon: CheckCircle,
    title: "Compliance Check",
    description: "Automatic verification against MoCRA, FDA, and EU regulatory requirements.",
  },
  {
    number: "04",
    icon: Package,
    title: "Ready to Manufacture",
    description: "Export production-ready documentation and scale your formula with confidence.",
  },
];

export default function HowItWorks() {
  return (
    <section id="how-it-works" className="py-16 lg:py-24 bg-muted/30">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center max-w-3xl mx-auto mb-12 lg:mb-16">
          <h2 className="text-3xl lg:text-5xl font-bold tracking-tight mb-4" data-testid="text-how-headline">
            From Concept to Compliant in Minutes
          </h2>
          <p className="text-lg text-muted-foreground" data-testid="text-how-subheadline">
            Our streamlined workflow takes you from initial idea to production-ready formula faster than ever.
          </p>
        </div>

        <div className="relative">
          <div className="hidden lg:block absolute top-1/2 left-0 right-0 h-0.5 bg-border -translate-y-1/2" />
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {steps.map((step, index) => (
              <div key={step.number} className="relative" data-testid={`step-${index}`}>
                <div className="flex flex-col items-center text-center">
                  <div className="relative z-10 w-16 h-16 rounded-full bg-primary flex items-center justify-center mb-4 shadow-lg">
                    <step.icon className="w-7 h-7 text-primary-foreground" />
                  </div>
                  <span className="text-sm font-bold text-primary mb-2">{step.number}</span>
                  <h3 className="text-lg font-semibold mb-2">{step.title}</h3>
                  <p className="text-sm text-muted-foreground">{step.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
