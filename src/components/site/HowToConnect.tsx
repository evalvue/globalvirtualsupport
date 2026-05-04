import { MessageSquare, ClipboardList, Rocket, BarChart3 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Phone, Mail, ArrowRight } from "lucide-react";

const steps = [
  { icon: MessageSquare, n: "01", title: "Get in touch", desc: "Call, email or fill the form. Tell us what you need — even a rough idea is enough." },
  { icon: ClipboardList, n: "02", title: "Free consultation", desc: "We map your process, recommend the right team size and send a clear, fixed quote within 24 hours." },
  { icon: Rocket, n: "03", title: "Onboarding & launch", desc: "We build SOPs, train the team on your tools (CRM, TMS, helpdesk) and go live in 48 hours." },
  { icon: BarChart3, n: "04", title: "Scale & optimize", desc: "Weekly reports, a dedicated account manager and ongoing tuning to keep results trending up." },
];

const HowToConnect = () => {
  return (
    <section id="how-to-connect" className="relative py-24 px-6">
      <div className="container mx-auto">
        <div className="text-center max-w-2xl mx-auto mb-14">
          <p className="text-sm font-medium text-primary mb-3 tracking-wider uppercase">How to connect</p>
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            From hello to live in <span className="text-gradient">48 hours</span>
          </h2>
          <p className="text-muted-foreground text-lg">A simple 4-step process — no long contracts, no setup fees.</p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {steps.map((s) => (
            <div key={s.n} className="relative glass rounded-2xl p-7 hover:border-primary/40 transition-all">
              <span className="absolute top-4 right-5 text-5xl font-bold text-primary/10">{s.n}</span>
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-primary/10 border border-primary/20 mb-5">
                <s.icon className="w-5 h-5 text-primary" />
              </div>
              <h3 className="text-lg font-semibold mb-2">{s.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{s.desc}</p>
            </div>
          ))}
        </div>

        <div className="glass rounded-2xl p-8 md:p-10 flex flex-col md:flex-row items-center justify-between gap-6 shadow-elevated">
          <div>
            <h3 className="text-2xl md:text-3xl font-bold mb-2">Ready to start? Talk to us today.</h3>
            <p className="text-muted-foreground">Available 24/7 — we usually respond in under an hour.</p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Button asChild size="lg" className="bg-gradient-primary text-primary-foreground border-0 shadow-glow hover:opacity-90">
              <a href="tel:+14043820137"><Phone className="mr-2 w-4 h-4" /> +1 (404) 382-0137</a>
            </Button>
            <Button asChild size="lg" variant="outline" className="border-border bg-card/50 hover:text-primary">
              <a href="mailto:info@globalvirtualsupport.com"><Mail className="mr-2 w-4 h-4" /> Email us</a>
            </Button>
            <Button asChild size="lg" variant="outline" className="border-border bg-card/50 hover:text-primary">
              <a href="#contact">Get a quote <ArrowRight className="ml-2 w-4 h-4" /></a>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HowToConnect;