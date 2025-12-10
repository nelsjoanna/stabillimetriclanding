import { Card, CardContent } from "@/components/ui/card";
import { 
  Beaker, 
  ShieldCheck, 
  Sparkles, 
  Database, 
  LineChart, 
  Factory,
  ArrowRight 
} from "lucide-react";

const features = [
  {
    icon: Beaker,
    title: "Predictive Compatibility Testing",
    description: "Advanced analysis predicts ingredient interactions and stability issues before you even mix a batch.",
    href: "#",
  },
  {
    icon: Sparkles,
    title: "All-in-One Formulation Platform",
    description: "Design, develop, and iterate on skincare and haircare formulas in a single unified workspace.",
    href: "#",
  },
  {
    icon: ShieldCheck,
    title: "Automatic Regulatory Compliance",
    description: "Built-in MoCRA, FDA, and EU compliance checks ensure your formulas meet global standards automatically.",
    href: "#",
  },
  {
    icon: Database,
    title: "Sustainable Ingredient Database",
    description: "Access thousands of eco-friendly, ethically-sourced ingredients with full traceability data.",
    href: "#",
  },
  {
    icon: LineChart,
    title: "Real-time Stability Predictions",
    description: "Advanced models forecast shelf-life and stability across temperature and humidity conditions.",
    href: "#",
  },
  {
    icon: Factory,
    title: "Manufacturing Integration",
    description: "Seamlessly connect formulation to production with export-ready documentation and batch scaling.",
    href: "#",
  },
];

export default function FeatureGallery() {
  return (
    <section id="features" className="py-16 lg:py-24">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center max-w-3xl mx-auto mb-12 lg:mb-16">
          <h2 className="text-3xl lg:text-5xl font-bold tracking-tight mb-4" data-testid="text-features-headline">
            Everything You Need to Formulate
          </h2>
          <p className="text-lg text-muted-foreground" data-testid="text-features-subheadline">
            A complete toolkit for modern cosmetic development, from concept to compliant product.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <Card
              key={feature.title}
              className="group hover-elevate cursor-pointer"
              data-testid={`card-feature-${index}`}
            >
              <CardContent className="p-6 lg:p-8">
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                  <feature.icon className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                <p className="text-muted-foreground mb-4">{feature.description}</p>
                <span className="inline-flex items-center text-sm font-medium text-primary group-hover:gap-2 transition-all">
                  Learn more
                  <ArrowRight className="w-4 h-4 ml-1 opacity-0 group-hover:opacity-100 transition-opacity" />
                </span>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
