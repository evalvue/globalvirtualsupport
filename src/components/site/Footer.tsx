import { Globe } from "lucide-react";

const Footer = () => {
  return (
    <footer className="border-t border-border py-10 px-6 mt-12">
      <div className="container mx-auto flex flex-col md:flex-row gap-4 items-center justify-between text-sm text-muted-foreground">
        <div className="flex items-center gap-2">
          <Globe className="w-5 h-5 text-primary" />
          <span>Global<span className="text-gradient">Virtual</span>Support</span>
        </div>
        <p>© {new Date().getFullYear()} GlobalVirtualSupport.com — All rights reserved.</p>
        <div className="flex gap-5">
          <a href="#services" className="hover:text-primary">Services</a>
          <a href="#about" className="hover:text-primary">About</a>
          <a href="#contact" className="hover:text-primary">Contact</a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;