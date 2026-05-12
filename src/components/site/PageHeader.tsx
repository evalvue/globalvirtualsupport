const PageHeader = ({ eyebrow, title, subtitle }: { eyebrow: string; title: string; subtitle?: string }) => (
  <section className="relative py-16 md:py-24 px-6 overflow-hidden">
    <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-[600px] h-[600px] rounded-full bg-primary/15 blur-[140px]" />
    <div className="container mx-auto relative z-10 text-center max-w-3xl">
      <p className="text-sm font-medium text-primary mb-3 tracking-wider uppercase">{eyebrow}</p>
      <h1 className="text-4xl md:text-6xl font-bold mb-4">
        <span className="text-gradient">{title}</span>
      </h1>
      {subtitle && <p className="text-muted-foreground text-lg">{subtitle}</p>}
    </div>
  </section>
);

export default PageHeader;