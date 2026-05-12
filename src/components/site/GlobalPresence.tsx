import { MapPin, Phone } from "lucide-react";
import { useSiteSettings, telHref } from "@/hooks/useSiteSettings";

const locations = [
  { city: "New York, USA", x: 26, y: 38, primary: true },
  { city: "Los Angeles, USA", x: 14, y: 42 },
  { city: "Toronto, Canada", x: 24, y: 34 },
  { city: "London, UK", x: 47, y: 32 },
  { city: "Dubai, UAE", x: 60, y: 46 },
  { city: "Mumbai, India", x: 67, y: 50 },
  { city: "Singapore", x: 76, y: 58 },
  { city: "Sydney, Australia", x: 86, y: 72 },
];

const GlobalPresence = () => {
  const { settings } = useSiteSettings();
  return (
    <section id="global" className="relative py-24 px-6">
      <div className="container mx-auto">
        <div className="text-center max-w-2xl mx-auto mb-14">
          <p className="text-sm font-medium text-primary mb-3 tracking-wider uppercase">Global Presence</p>
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            Serving clients <span className="text-gradient">worldwide</span>
          </h2>
          <p className="text-muted-foreground text-lg">
            Headquartered in the USA with a delivery network spanning 4 continents — always one call away.
          </p>
          <a
            href={telHref(settings.phone)}
            className="inline-flex items-center gap-2 mt-6 glass rounded-full px-5 py-2.5 text-sm font-medium hover:border-primary/60 transition-colors"
          >
            <Phone className="w-4 h-4 text-primary" />
            <span className="text-foreground">{settings.phone}</span>
            <span className="text-muted-foreground">— 24/7 Support</span>
          </a>
        </div>

        <div className="relative glass rounded-3xl p-6 md:p-10 shadow-elevated overflow-hidden">
          <div className="absolute inset-0 bg-gradient-primary opacity-[0.04]" />
          <div className="relative aspect-[2/1] w-full">
            {/* World map SVG (simplified continents) */}
            <svg
              viewBox="0 0 100 50"
              className="absolute inset-0 w-full h-full"
              preserveAspectRatio="xMidYMid meet"
              aria-hidden="true"
            >
              <defs>
                <radialGradient id="dotFade" cx="50%" cy="50%" r="50%">
                  <stop offset="0%" stopColor="hsl(var(--primary))" stopOpacity="0.55" />
                  <stop offset="100%" stopColor="hsl(var(--primary))" stopOpacity="0.08" />
                </radialGradient>
              </defs>
              {/* Dotted world map grid */}
              {Array.from({ length: 25 }).map((_, row) =>
                Array.from({ length: 50 }).map((_, col) => {
                  const x = col * 2 + 1;
                  const y = row * 2 + 1;
                  // Rough continent silhouettes via inclusion test
                  const inLand =
                    // North America
                    (x > 8 && x < 30 && y > 18 && y < 36 && !(x > 24 && y < 22)) ||
                    // South America
                    (x > 22 && x < 32 && y > 36 && y < 48) ||
                    // Europe
                    (x > 44 && x < 56 && y > 22 && y < 34) ||
                    // Africa
                    (x > 46 && x < 60 && y > 34 && y < 48) ||
                    // Asia
                    (x > 56 && x < 82 && y > 20 && y < 42) ||
                    // Australia
                    (x > 78 && x < 90 && y > 60 / 1.4 && y < 44);
                  if (!inLand) return null;
                  return (
                    <circle
                      key={`${row}-${col}`}
                      cx={x}
                      cy={y}
                      r={0.45}
                      fill="hsl(var(--primary))"
                      opacity={0.35}
                    />
                  );
                })
              )}
            </svg>

            {/* Connection arcs from HQ (NY) */}
            <svg viewBox="0 0 100 50" className="absolute inset-0 w-full h-full" preserveAspectRatio="none" aria-hidden="true">
              {locations.slice(1).map((loc) => {
                const hq = locations[0];
                const mx = (hq.x + loc.x) / 2;
                const my = Math.min(hq.y, loc.y) - 10;
                return (
                  <path
                    key={loc.city}
                    d={`M ${hq.x} ${hq.y} Q ${mx} ${my} ${loc.x} ${loc.y}`}
                    fill="none"
                    stroke="url(#arcGrad)"
                    strokeWidth="0.25"
                    opacity="0.6"
                  />
                );
              })}
              <defs>
                <linearGradient id="arcGrad" x1="0" x2="1" y1="0" y2="0">
                  <stop offset="0%" stopColor="hsl(var(--primary))" stopOpacity="0.9" />
                  <stop offset="100%" stopColor="hsl(var(--accent))" stopOpacity="0.4" />
                </linearGradient>
              </defs>
            </svg>

            {/* Pins */}
            {locations.map((loc) => (
              <div
                key={loc.city}
                className="absolute -translate-x-1/2 -translate-y-1/2 group"
                style={{ left: `${loc.x}%`, top: `${loc.y}%` }}
              >
                <span
                  className={`block rounded-full ${
                    loc.primary
                      ? "w-3.5 h-3.5 bg-primary shadow-glow animate-glow-pulse"
                      : "w-2.5 h-2.5 bg-accent"
                  }`}
                />
                {loc.primary && (
                  <span className="absolute inset-0 rounded-full bg-primary/40 animate-ping" />
                )}
                <div className="absolute left-1/2 -translate-x-1/2 top-full mt-1 whitespace-nowrap text-[10px] md:text-xs font-medium text-foreground/90 opacity-0 group-hover:opacity-100 transition-opacity glass px-2 py-0.5 rounded-md pointer-events-none">
                  <MapPin className="inline w-2.5 h-2.5 text-primary mr-1" />
                  {loc.city}
                </div>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-10 pt-8 border-t border-border">
            <div><div className="text-2xl font-bold text-gradient">8+</div><div className="text-xs text-muted-foreground mt-1">Countries served</div></div>
            <div><div className="text-2xl font-bold text-gradient">24/7</div><div className="text-xs text-muted-foreground mt-1">Live coverage</div></div>
            <div><div className="text-2xl font-bold text-gradient">120+</div><div className="text-xs text-muted-foreground mt-1">Active clients</div></div>
            <div><div className="text-2xl font-bold text-gradient">USA</div><div className="text-xs text-muted-foreground mt-1">Headquarters</div></div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default GlobalPresence;