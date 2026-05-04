const GlobeFallback = () => {
  return (
    <div className="relative w-full h-full flex items-center justify-center overflow-hidden">
      {/* Ambient glow */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,hsl(var(--primary)/0.25),transparent_60%)]" />

      {/* Starfield */}
      {Array.from({ length: 60 }).map((_, i) => {
        const top = Math.random() * 100;
        const left = Math.random() * 100;
        const size = Math.random() * 2 + 1;
        const delay = Math.random() * 3;
        return (
          <span
            key={i}
            className="absolute rounded-full bg-foreground/70 animate-glow-pulse"
            style={{
              top: `${top}%`,
              left: `${left}%`,
              width: `${size}px`,
              height: `${size}px`,
              animationDelay: `${delay}s`,
            }}
          />
        );
      })}

      {/* Globe */}
      <div
        className="relative rounded-full animate-spin"
        style={{
          width: "min(70%, 360px)",
          aspectRatio: "1 / 1",
          animationDuration: "30s",
          background:
            "radial-gradient(circle at 30% 30%, hsl(var(--primary)/0.35), hsl(var(--background)) 65%)",
          boxShadow:
            "0 0 80px hsl(var(--primary)/0.45), inset -20px -20px 60px hsl(var(--accent)/0.25)",
          border: "1px solid hsl(var(--primary)/0.4)",
        }}
      >
        {/* Latitude lines */}
        {[20, 40, 60, 80].map((p) => (
          <span
            key={`lat-${p}`}
            className="absolute left-0 right-0 border-t border-primary/20"
            style={{ top: `${p}%` }}
          />
        ))}
        {/* Longitude (ellipses) */}
        {[0, 30, 60, 90, 120, 150].map((deg) => (
          <span
            key={`lon-${deg}`}
            className="absolute inset-0 rounded-full border border-primary/20"
            style={{ transform: `rotateY(${deg}deg)` }}
          />
        ))}
        {/* Surface dots */}
        {Array.from({ length: 14 }).map((_, i) => {
          const angle = (i / 14) * Math.PI * 2;
          const r = 35 + (i % 3) * 5;
          const x = 50 + Math.cos(angle) * r;
          const y = 50 + Math.sin(angle) * r * 0.7;
          return (
            <span
              key={i}
              className="absolute w-1.5 h-1.5 rounded-full bg-primary shadow-glow"
              style={{ left: `${x}%`, top: `${y}%` }}
            />
          );
        })}
      </div>

      {/* Outer orbit ring */}
      <div
        className="absolute rounded-full border border-accent/30 animate-spin"
        style={{
          width: "min(85%, 440px)",
          aspectRatio: "1 / 1",
          animationDuration: "40s",
          animationDirection: "reverse",
        }}
      />
    </div>
  );
};

export default GlobeFallback;