import { Globe, Phone, Mail, MapPin } from "lucide-react";
import { Link } from "react-router-dom";
import { useSiteSettings, telHref } from "@/hooks/useSiteSettings";

const Footer = () => {
  const { settings } = useSiteSettings();
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
            <li><Link to="/services" className="hover:text-primary">Services</Link></li>
            <li><Link to="/industries" className="hover:text-primary">Industries</Link></li>
            <li><Link to="/about" className="hover:text-primary">About</Link></li>
            <li><Link to="/global-presence" className="hover:text-primary">Global Presence</Link></li>
            <li><Link to="/how-to-connect" className="hover:text-primary">How to Connect</Link></li>
            <li><Link to="/contact" className="hover:text-primary">Contact</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="font-semibold mb-3">Contact</h4>
          <ul className="space-y-2 text-muted-foreground">
            <li className="flex items-center gap-2"><Phone className="w-4 h-4 text-primary" /><a href={telHref(settings.phone)} className="hover:text-primary">{settings.phone}</a></li>
            <li className="flex items-center gap-2"><Mail className="w-4 h-4 text-primary" /><a href={`mailto:${settings.email}`} className="hover:text-primary">{settings.email}</a></li>
            <li className="flex items-start gap-2"><MapPin className="w-4 h-4 text-primary mt-0.5" /><span>{settings.address}</span></li>
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