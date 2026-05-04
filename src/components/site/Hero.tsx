import { Suspense, lazy } from "react";
import { Button } from "@/components/ui/button";
import { ArrowRight, Sparkles } from "lucide-react";

const Globe3D = lazy(() => import("@/components/Globe3D"));

const Hero = () => {
  return (
    <section id="home" className="relative min-h-screen pt-24 overflow-hidden">
      {/* Ambient glows */}
      <div className="absolute top-1/3 -left-32 w-96 h-96 rounded-full bg-primary/20 blur-[120px] animate-glow-pulse" />
      <div className="absolute bottom-0 -right-32 w-96 h-96 rounded-full bg-accent/20 blur-[120px] animate-glow-pulse" />

      <div className="container mx-auto px-6 grid lg:grid-cols-2 gap-8 items-center min-h-[calc(100vh-6rem)]">
        <div className="relative z-10 animate-fade-in-up">
          <div className="inline-flex items-center gap-2 glass rounded-full px-4 py-1.5 mb-6 text-xs text-muted-foreground">
            <Sparkles className="w-3.5 h-3.5 text-primary" />
            Trusted by businesses across the USA
          </div>
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold leading-[1.05] mb-6">
            One Partner.<br />
            <span className="text-gradient">Global Operations.</span>
          </h1>
          <p className="text-lg text-muted-foreground max-w-xl mb-8 leading-relaxed">
            BPO, call center, dispatching, logistics support and world-class web development —
            delivered by a virtual team that scales with your business.
          </p>
          <div className="flex flex-wrap gap-4">
            <Button asChild size="lg" className="bg-gradient-primary text-primary-foreground border-0 shadow-glow hover:opacity-90 h-12 px-8">
              <a href="#contact">Start a Project <ArrowRight className="ml-2 w-4 h-4" /></a>
            </Button>
            <Button asChild variant="outline" size="lg" className="h-12 px-8 border-border bg-card/50 hover:bg-card hover:text-primary">
              <a href="#services">Explore Services</a>
            </Button>
          </div>

          <div className="mt-12 grid grid-cols-3 gap-6 max-w-md">
            {[
              { v: "24/7", l: "Live support" },
              { v: "120+", l: "Clients served" },
              { v: "8 yrs", l: "In business" },
            ].map((s) => (
              <div key={s.l}>
                <div className="text-2xl font-bold text-gradient">{s.v}</div>
                <div className="text-xs text-muted-foreground mt-1">{s.l}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="relative h-[420px] sm:h-[520px] lg:h-[600px] animate-fade-in">
          <Suspense fallback={<div className="w-full h-full flex items-center justify-center text-muted-foreground">Loading globe…</div>}>
            <Globe3D />
          </Suspense>
        </div>
      </div>
    </section>
  );
};

export default Hero;