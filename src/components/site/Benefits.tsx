import { Zap, ShieldCheck, DollarSign, Users, Clock, TrendingUp } from "lucide-react";

const benefits = [
  { icon: DollarSign, title: "Save up to 60% on costs", desc: "Skip the overhead of in-house hiring, payroll taxes, equipment and training. Pay one flat rate." },
  { icon: Clock, title: "24/7/365 coverage", desc: "Our agents work in shifts so your customers, drivers and leads are never left waiting." },
  { icon: Users, title: "Trained, English-fluent team", desc: "Hand-picked staff with USA work-hour experience in your industry — ready from day one." },
  { icon: ShieldCheck, title: "NDA & data security", desc: "Signed NDAs, encrypted systems, role-based access and full HIPAA / PCI awareness." },
  { icon: Zap, title: "Onboard in 48 hours", desc: "Tell us your process. We build the SOP, train the team and go live in under two business days." },
  { icon: TrendingUp, title: "Scale up or down anytime", desc: "Add agents during peak season, scale back when you don't — no contracts holding you hostage." },
];

const Benefits = () => {
  return (
    <section id="benefits" className="relative py-24 px-6">
      <div className="container mx-auto">
        <div className="max-w-2xl mb-14">
          <p className="text-sm font-medium text-primary mb-3 tracking-wider uppercase">Why work with us</p>
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            Real benefits, <span className="text-gradient">measurable results</span>
          </h2>
          <p className="text-muted-foreground text-lg">
            We don't sell hours — we deliver outcomes that show up on your P&L.
          </p>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {benefits.map((b) => (
            <div key={b.title} className="glass rounded-2xl p-7 hover:border-primary/40 transition-all hover:-translate-y-1">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-primary/10 border border-primary/20 mb-5">
                <b.icon className="w-5 h-5 text-primary" />
              </div>
              <h3 className="text-lg font-semibold mb-2">{b.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{b.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Benefits;