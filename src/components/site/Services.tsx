import { Headphones, Truck, PhoneCall, Code2, ClipboardList, Building2 } from "lucide-react";

const services = [
  { icon: PhoneCall, title: "Call Center & BPO", desc: "Inbound, outbound and back-office operations handled by trained agents who feel like part of your team." },
  { icon: Truck, title: "Dispatching Services", desc: "24/7 truck dispatch, load booking, rate negotiation and route optimization for carriers." },
  { icon: Building2, title: "Logistics Support", desc: "End-to-end coordination — billing, paperwork, broker communication and freight tracking." },
  { icon: Headphones, title: "Virtual Assistants", desc: "Dedicated VAs for admin, scheduling, CRM, lead generation and customer follow-ups." },
  { icon: Code2, title: "Web Development", desc: "Modern websites, e-commerce stores and custom web apps built with the latest stack." },
  { icon: ClipboardList, title: "Data & Operations", desc: "Data entry, document processing and process automation that keeps your back office humming." },
];

const Services = () => {
  return (
    <section id="services" className="relative py-24 px-6">
      <div className="container mx-auto">
        <div className="max-w-2xl mb-16">
          <p className="text-sm font-medium text-primary mb-3 tracking-wider uppercase">What we do</p>
          <h2 className="text-4xl md:text-5xl font-bold mb-4">Services built to <span className="text-gradient">scale your business</span></h2>
          <p className="text-muted-foreground text-lg">From call handling to custom code — one team, one contract, one global partner.</p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((s, i) => (
            <article
              key={s.title}
              className="group relative bg-gradient-card border border-border rounded-2xl p-8 hover:border-primary/40 transition-all duration-500 hover:-translate-y-1 shadow-card-glow"
              style={{ animationDelay: `${i * 80}ms` }}
            >
              <div className="absolute inset-0 rounded-2xl bg-gradient-primary opacity-0 group-hover:opacity-[0.04] transition-opacity" />
              <div className="relative">
                <div className="inline-flex items-center justify-center w-14 h-14 rounded-xl bg-primary/10 border border-primary/20 mb-6 group-hover:shadow-glow transition-shadow">
                  <s.icon className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-3">{s.title}</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">{s.desc}</p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Services;