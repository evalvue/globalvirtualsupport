import { Globe, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";

const Navbar = () => {
  return (
    <header className="fixed top-0 inset-x-0 z-50 glass">
      <nav className="container mx-auto flex items-center justify-between py-4 px-6">
        <a href="#home" className="flex items-center gap-2 font-semibold text-lg">
          <Globe className="w-6 h-6 text-primary" />
          <span className="text-foreground">Global<span className="text-gradient">Virtual</span>Support</span>
        </a>
        <ul className="hidden md:flex items-center gap-8 text-sm text-muted-foreground">
          <li><a href="#services" className="hover:text-primary transition-colors">Services</a></li>
          <li><a href="#benefits" className="hover:text-primary transition-colors">Benefits</a></li>
          <li><a href="#about" className="hover:text-primary transition-colors">About</a></li>
          <li><a href="#global" className="hover:text-primary transition-colors">Global</a></li>
          <li><a href="#contact" className="hover:text-primary transition-colors">Contact</a></li>
        </ul>
        <div className="flex items-center gap-3">
          <a href="tel:+14043820137" className="hidden sm:inline-flex items-center gap-1.5 text-sm text-foreground/90 hover:text-primary transition-colors">
            <Phone className="w-4 h-4 text-primary" />
            +1 (404) 382-0137
          </a>
          <Button asChild size="sm" className="bg-gradient-primary text-primary-foreground border-0 shadow-glow hover:opacity-90">
            <a href="#contact">Get a Quote</a>
          </Button>
        </div>
      </nav>
    </header>
  );
};

export default Navbar;