import { Link } from "react-router-dom";
import SiteLayout from "@/components/site/SiteLayout";
import PageHeader from "@/components/site/PageHeader";
import LeadForm from "@/components/site/LeadForm";
import { softwareServices } from "@/lib/softwareServices";
import { ArrowRight, ExternalLink, Sparkles } from "lucide-react";

const SoftwareDevelopmentPage = () => {
  const liveProjects = softwareServices.flatMap((s) =>
    s.projects.filter((p) => p.status === "live").map((p) => ({ ...p, service: s.title, slug: s.slug }))
  );

  return (
    <SiteLayout>
      <PageHeader
        eyebrow="Software Development"
        title="Build software that customers love"
        subtitle="Websites, mobile apps, accounting, gym, ERP, CRM and custom software — designed, built and shipped by a senior in-house team."
      />

      {/* Categories grid */}
      <section className="relative px-6 pb-16">
        <div className="container mx-auto">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {softwareServices.map((s) => (
              <Link
                key={s.slug}
                to={`/software-development/${s.slug}`}
                className="group relative bg-gradient-card border border-border rounded-2xl p-7 hover:border-primary/40 transition-all hover:-translate-y-1 shadow-card-glow overflow-hidden"
              >
                <div className={`absolute -top-16 -right-16 w-40 h-40 rounded-full bg-gradient-to-br ${s.gradient} opacity-10 blur-2xl group-hover:opacity-20 transition-opacity`} />
                <div className={`inline-flex items-center justify-center w-14 h-14 rounded-xl bg-gradient-to-br ${s.gradient} mb-5 shadow-glow`}>
                  <s.icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl font-semibold mb-2">{s.title}</h3>
                <p className="text-muted-foreground text-sm leading-relaxed mb-4">{s.short}</p>
                <div className="flex flex-wrap gap-1.5 mb-5">
                  {s.tech.slice(0, 3).map((t) => (
                    <span key={t} className="text-xs px-2 py-0.5 rounded-full bg-primary/10 text-primary border border-primary/20">{t}</span>
                  ))}
                </div>
                <div className="flex items-center gap-2 text-sm text-primary font-medium">
                  Explore <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Live projects */}
      <section className="relative px-6 py-16 bg-card/30">
        <div className="container mx-auto">
          <div className="max-w-2xl mb-10">
            <p className="text-sm font-medium text-primary mb-3 tracking-wider uppercase flex items-center gap-2">
              <Sparkles className="w-4 h-4" /> Live projects
            </p>
            <h2 className="text-3xl md:text-4xl font-bold mb-3">Real products. Real customers.</h2>
            <p className="text-muted-foreground">A few of the platforms we've built and are running in production right now.</p>
          </div>
          <div className="grid md:grid-cols-2 gap-6">
            {liveProjects.map((p) => (
              <a
                key={p.name}
                href={p.url}
                target="_blank"
                rel="noopener noreferrer"
                className="group glass rounded-2xl p-6 hover:border-primary/40 transition-all hover:-translate-y-1 block"
              >
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <div className="text-xs text-primary uppercase tracking-wider mb-1">{p.service}</div>
                    <h3 className="text-xl font-semibold">{p.name}</h3>
                  </div>
                  <span className="inline-flex items-center gap-1 text-xs px-2 py-1 rounded-full bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" /> Live
                  </span>
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

      {/* Lead form */}
      <section id="quote" className="relative px-6 py-20">
        <div className="container mx-auto grid lg:grid-cols-2 gap-10 items-start max-w-5xl">
          <div>
            <p className="text-sm font-medium text-primary mb-3 tracking-wider uppercase">Get a free quote</p>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Tell us about your project</h2>
            <p className="text-muted-foreground mb-6">
              Share a few details and our team will get back to you within 24 hours with a tailored plan and price.
            </p>
            <ul className="space-y-2 text-sm text-foreground/85">
              <li>• Free discovery call & scope document</li>
              <li>• Fixed-price or dedicated-team engagement</li>
              <li>• NDA available on request</li>
              <li>• Senior developers — no juniors on production code</li>
            </ul>
          </div>
          <LeadForm sourcePage="/software-development" />
        </div>
      </section>
    </SiteLayout>
  );
};

export default SoftwareDevelopmentPage;