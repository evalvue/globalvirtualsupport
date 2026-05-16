import { Link, useParams, Navigate } from "react-router-dom";
import SiteLayout from "@/components/site/SiteLayout";
import LeadForm from "@/components/site/LeadForm";
import { getServiceBySlug, softwareServices } from "@/lib/softwareServices";
import { ArrowLeft, Check, ExternalLink, Sparkles } from "lucide-react";

const SoftwareCategoryPage = () => {
  const { slug } = useParams();
  const service = getServiceBySlug(slug);
  if (!service) return <Navigate to="/software-development" replace />;
  const Icon = service.icon;
  const related = softwareServices.filter((s) => s.slug !== service.slug).slice(0, 3);

  return (
    <SiteLayout>
      {/* Hero */}
      <section className="relative px-6 pt-10 pb-16 overflow-hidden">
        <div className={`absolute -top-32 -right-32 w-[500px] h-[500px] rounded-full bg-gradient-to-br ${service.gradient} opacity-20 blur-[120px]`} />
        <div className="container mx-auto max-w-5xl relative z-10">
          <Link to="/software-development" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary mb-6">
            <ArrowLeft className="w-4 h-4" /> All software services
          </Link>
          <div className="grid lg:grid-cols-[1fr_auto] gap-8 items-start">
            <div>
              <div className={`inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br ${service.gradient} mb-6 shadow-glow`}>
                <Icon className="w-7 h-7 text-white" />
              </div>
              <h1 className="text-4xl md:text-5xl font-bold mb-4">
                <span className="text-gradient">{service.title}</span>
              </h1>
              <p className="text-lg text-muted-foreground max-w-2xl mb-6">{service.long}</p>
              <div className="flex flex-wrap gap-2">
                {service.tech.map((t) => (
                  <span key={t} className="text-xs px-3 py-1 rounded-full bg-primary/10 text-primary border border-primary/20">{t}</span>
                ))}
              </div>
            </div>
            <a href="#quote" className="hidden lg:inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-gradient-primary text-primary-foreground shadow-glow hover:opacity-90 transition">
              Get a free quote <Sparkles className="w-4 h-4" />
            </a>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="px-6 py-16 bg-card/30">
        <div className="container mx-auto max-w-5xl">
          <h2 className="text-2xl md:text-3xl font-bold mb-8">What's included</h2>
          <div className="grid sm:grid-cols-2 gap-4">
            {service.features.map((f) => (
              <div key={f} className="glass rounded-xl p-5 flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-primary/15 border border-primary/30 flex items-center justify-center flex-shrink-0">
                  <Check className="w-4 h-4 text-primary" />
                </div>
                <span className="text-foreground/90">{f}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Projects */}
      {service.projects.length > 0 && (
        <section className="px-6 py-16">
          <div className="container mx-auto max-w-5xl">
            <h2 className="text-2xl md:text-3xl font-bold mb-2">Our work in this space</h2>
            <p className="text-muted-foreground mb-8">Live products and case studies we've shipped.</p>
            <div className="grid md:grid-cols-2 gap-6">
              {service.projects.map((p) => (
                <a
                  key={p.name}
                  href={p.url || "#quote"}
                  target={p.url ? "_blank" : undefined}
                  rel={p.url ? "noopener noreferrer" : undefined}
                  className="group glass rounded-2xl p-6 hover:border-primary/40 transition-all hover:-translate-y-1 block"
                >
                  <div className="flex items-start justify-between mb-3">
                    <h3 className="text-xl font-semibold">{p.name}</h3>
                    {p.status === "live" ? (
                      <span className="inline-flex items-center gap-1 text-xs px-2 py-1 rounded-full bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" /> Live
                      </span>
                    ) : (
                      <span className="text-xs px-2 py-1 rounded-full bg-primary/10 text-primary border border-primary/20">Case study</span>
                    )}
                  </div>
                  <p className="text-muted-foreground text-sm mb-4">{p.tagline}</p>
                  {p.url && (
                    <div className="flex items-center gap-2 text-sm text-primary font-medium">
                      Visit {p.url.replace(/^https?:\/\//, "")} <ExternalLink className="w-3.5 h-3.5" />
                    </div>
                  )}
                </a>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Quote */}
      <section id="quote" className="px-6 py-20 bg-card/30">
        <div className="container mx-auto grid lg:grid-cols-2 gap-10 items-start max-w-5xl">
          <div>
            <p className="text-sm font-medium text-primary mb-3 tracking-wider uppercase">Free quote</p>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Start your {service.title.toLowerCase()} project</h2>
            <p className="text-muted-foreground mb-6">
              Fill the form and our team will reach out within 24 hours with next steps, timeline and pricing.
            </p>
          </div>
          <LeadForm defaultCategory={service.title} sourcePage={`/software-development/${service.slug}`} />
        </div>
      </section>

      {/* Related */}
      <section className="px-6 py-16">
        <div className="container mx-auto max-w-5xl">
          <h2 className="text-2xl font-bold mb-6">Related services</h2>
          <div className="grid md:grid-cols-3 gap-4">
            {related.map((r) => (
              <Link key={r.slug} to={`/software-development/${r.slug}`} className="glass rounded-xl p-5 hover:border-primary/40 transition-colors">
                <div className="font-semibold mb-1">{r.title}</div>
                <div className="text-sm text-muted-foreground">{r.short}</div>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </SiteLayout>
  );
};

export default SoftwareCategoryPage;