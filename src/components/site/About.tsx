import { Check } from "lucide-react";

const points = [
  "USA-focused service delivery, round-the-clock coverage",
  "Transparent pricing — pay for results, not hours",
  "Trained, English-fluent agents and developers",
  "Secure infrastructure with NDA & data protection",
];

const About = () => {
  return (
    <section id="about" className="relative py-24 px-6">
      <div className="container mx-auto grid lg:grid-cols-2 gap-16 items-center">
        <div className="relative">
          <div className="absolute -inset-6 bg-gradient-primary opacity-20 blur-3xl rounded-full" />
          <div className="relative glass rounded-3xl p-10 shadow-elevated">
            <p className="text-7xl font-bold text-gradient leading-none">8+</p>
            <p className="text-xl mt-2">Years powering US businesses</p>
            <div className="grid grid-cols-2 gap-6 mt-10 pt-10 border-t border-border">
              <div><div className="text-3xl font-bold">120+</div><div className="text-sm text-muted-foreground mt-1">Active clients</div></div>
              <div><div className="text-3xl font-bold">300K+</div><div className="text-sm text-muted-foreground mt-1">Calls handled</div></div>
              <div><div className="text-3xl font-bold">$40M+</div><div className="text-sm text-muted-foreground mt-1">Loads dispatched</div></div>
              <div><div className="text-3xl font-bold">99.9%</div><div className="text-sm text-muted-foreground mt-1">Uptime SLA</div></div>
            </div>
          </div>
        </div>

        <div>
          <p className="text-sm font-medium text-primary mb-3 tracking-wider uppercase">Why GlobalVirtualSupport</p>
          <h2 className="text-4xl md:text-5xl font-bold mb-6">A virtual workforce that <span className="text-gradient">delivers results</span>.</h2>
          <p className="text-muted-foreground text-lg mb-8 leading-relaxed">
            We help carriers, brokers, e-commerce brands and service businesses across the United States offload
            the work that slows them down. From the first call to the final invoice — we handle it.
          </p>
          <ul className="space-y-4">
            {points.map((p) => (
              <li key={p} className="flex items-start gap-3">
                <span className="mt-0.5 inline-flex w-6 h-6 items-center justify-center rounded-full bg-primary/15 text-primary border border-primary/30">
                  <Check className="w-3.5 h-3.5" />
                </span>
                <span className="text-foreground/90">{p}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
};

export default About;