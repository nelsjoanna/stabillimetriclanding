import aiVisualization from "@assets/generated_images/ai_ingredient_compatibility_visualization.png";
import labSetting from "@assets/generated_images/beauty_lab_formulation_setting.png";

const benefits = [
  {
    stat: "40%",
    statLabel: "Faster Time-to-Market",
    headline: "Accelerate Development Cycles",
    description: "Cut months off your product development timeline with predictive analytics that eliminate guesswork and reduce costly trial-and-error iterations.",
    image: aiVisualization,
    imageAlt: "Visualization of ingredient compatibility analysis",
    reverse: false,
  },
  {
    stat: "100%",
    statLabel: "Regulatory Coverage",
    headline: "Stay Compliant Automatically",
    description: "Never worry about regulatory gaps again. Our platform continuously monitors MoCRA, FDA, and EU requirements, flagging issues before they become problems.",
    image: labSetting,
    imageAlt: "Modern beauty formulation laboratory",
    reverse: true,
  },
];

export default function BenefitsSection() {
  return (
    <section id="benefits" className="py-16 lg:py-24">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center max-w-3xl mx-auto mb-12 lg:mb-16">
          <h2 className="text-3xl lg:text-5xl font-bold tracking-tight mb-4" data-testid="text-benefits-headline">
            Why Industry Leaders Choose Us
          </h2>
          <p className="text-lg text-muted-foreground" data-testid="text-benefits-subheadline">
            Transform your formulation workflow with measurable results.
          </p>
        </div>

        <div className="space-y-16 lg:space-y-24">
          {benefits.map((benefit, index) => (
            <div
              key={benefit.headline}
              className={`grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center ${
                benefit.reverse ? "lg:flex-row-reverse" : ""
              }`}
              data-testid={`benefit-${index}`}
            >
              <div className={benefit.reverse ? "lg:order-2" : ""}>
                <div className="inline-flex items-baseline gap-2 mb-4">
                  <span className="text-5xl lg:text-6xl font-bold text-primary">{benefit.stat}</span>
                  <span className="text-lg text-muted-foreground">{benefit.statLabel}</span>
                </div>
                <h3 className="text-2xl lg:text-3xl font-bold mb-4">{benefit.headline}</h3>
                <p className="text-lg text-muted-foreground leading-relaxed">{benefit.description}</p>
              </div>
              <div className={benefit.reverse ? "lg:order-1" : ""}>
                <div className="rounded-xl overflow-hidden border border-border shadow-lg">
                  <img
                    src={benefit.image}
                    alt={benefit.imageAlt}
                    className="w-full h-auto object-cover"
                    data-testid={`img-benefit-${index}`}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
