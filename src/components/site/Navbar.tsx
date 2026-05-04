import { Globe } from "lucide-react";
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
          <li><a href="#about" className="hover:text-primary transition-colors">About</a></li>
          <li><a href="#industries" className="hover:text-primary transition-colors">Industries</a></li>
          <li><a href="#contact" className="hover:text-primary transition-colors">Contact</a></li>
        </ul>
        <Button asChild size="sm" className="bg-gradient-primary text-primary-foreground border-0 shadow-glow hover:opacity-90">
          <a href="#contact">Get a Quote</a>
        </Button>
      </nav>
    </header>
  );
};

export default Navbar;