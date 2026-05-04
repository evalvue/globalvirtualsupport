import { Globe, Phone, Mail } from "lucide-react";

const Footer = () => {
  return (
    <footer className="border-t border-border py-12 px-6 mt-12">
      <div className="container mx-auto grid md:grid-cols-4 gap-8 text-sm">
        <div className="md:col-span-2">
          <div className="flex items-center gap-2 font-semibold text-base mb-3">
            <Globe className="w-5 h-5 text-primary" />
            <span>Global<span className="text-gradient">Virtual</span>Support</span>
          </div>
          <p className="text-muted-foreground max-w-sm leading-relaxed">
            One global partner for BPO, dispatching, logistics, virtual assistants and web development.
          </p>
        </div>
        <div>
          <h4 className="font-semibold mb-3">Quick Links</h4>
          <ul className="space-y-2 text-muted-foreground">
            <li><a href="#services" className="hover:text-primary">Services</a></li>
            <li><a href="#benefits" className="hover:text-primary">Benefits</a></li>
            <li><a href="#global" className="hover:text-primary">Global Presence</a></li>
            <li><a href="#how-to-connect" className="hover:text-primary">How to Connect</a></li>
            <li><a href="#contact" className="hover:text-primary">Contact</a></li>
          </ul>
        </div>
        <div>
          <h4 className="font-semibold mb-3">Contact</h4>
          <ul className="space-y-2 text-muted-foreground">
            <li className="flex items-center gap-2"><Phone className="w-4 h-4 text-primary" /><a href="tel:+14043820137" className="hover:text-primary">+1 (404) 382-0137</a></li>
            <li className="flex items-center gap-2"><Mail className="w-4 h-4 text-primary" /><a href="mailto:info@globalvirtualsupport.com" className="hover:text-primary">info@globalvirtualsupport.com</a></li>
          </ul>
        </div>
      </div>
      <div className="container mx-auto mt-10 pt-6 border-t border-border text-xs text-muted-foreground text-center">
        © {new Date().getFullYear()} GlobalVirtualSupport.com — All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;