import { Globe, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { NavLink, Link } from "react-router-dom";
import { useSiteSettings, telHref } from "@/hooks/useSiteSettings";

const links = [
  { to: "/services", label: "Services" },
  { to: "/industries", label: "Industries" },
  { to: "/about", label: "About" },
  { to: "/global-presence", label: "Global" },
  { to: "/how-to-connect", label: "How to Connect" },
  { to: "/contact", label: "Contact" },
];

const Navbar = () => {
  const { settings } = useSiteSettings();
  return (
    <header className="fixed top-0 inset-x-0 z-50 glass">
      <nav className="container mx-auto flex items-center justify-between py-4 px-6">
        <Link to="/" className="flex items-center gap-2 font-semibold text-lg">
          <Globe className="w-6 h-6 text-primary" />
          <span className="text-foreground">Global<span className="text-gradient">Virtual</span>Support</span>
        </Link>
        <ul className="hidden md:flex items-center gap-7 text-sm text-muted-foreground">
          {links.map((l) => (
            <li key={l.to}>
              <NavLink
                to={l.to}
                className={({ isActive }) =>
                  `transition-colors ${isActive ? "text-primary" : "hover:text-primary"}`
                }
              >
                {l.label}
              </NavLink>
            </li>
          ))}
        </ul>
        <div className="flex items-center gap-3">
          <a href={telHref(settings.phone)} className="hidden sm:inline-flex items-center gap-1.5 text-sm text-foreground/90 hover:text-primary transition-colors">
            <Phone className="w-4 h-4 text-primary" />
            {settings.phone}
          </a>
          <Button asChild size="sm" className="bg-gradient-primary text-primary-foreground border-0 shadow-glow hover:opacity-90">
            <Link to="/contact">Get a Quote</Link>
          </Button>
        </div>
      </nav>
    </header>
  );
};

export default Navbar;