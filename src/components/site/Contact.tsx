import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Mail, Phone, MapPin, Send } from "lucide-react";
import { toast } from "sonner";
import { FormEvent } from "react";
import { useSiteSettings, telHref } from "@/hooks/useSiteSettings";

const Contact = () => {
  const { settings } = useSiteSettings();
  const onSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    toast.success("Thanks! We'll get back to you within 1 business day.");
    (e.currentTarget as HTMLFormElement).reset();
  };

  return (
    <section id="contact" className="relative py-24 px-6">
      <div className="container mx-auto grid lg:grid-cols-2 gap-12">
        <div>
          <p className="text-sm font-medium text-primary mb-3 tracking-wider uppercase">Get in touch</p>
          <h2 className="text-4xl md:text-5xl font-bold mb-6">Let's build your <span className="text-gradient">virtual team</span>.</h2>
          <p className="text-muted-foreground text-lg mb-10">Tell us what you need. We'll respond within 24 hours with a tailored proposal.</p>

          <ul className="space-y-5">
            <li className="flex items-center gap-4">
              <span className="w-11 h-11 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center"><Mail className="w-5 h-5 text-primary" /></span>
              <div><div className="text-xs text-muted-foreground">Email</div><a href={`mailto:${settings.email}`} className="font-medium hover:text-primary">{settings.email}</a></div>
            </li>
            <li className="flex items-center gap-4">
              <span className="w-11 h-11 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center"><Phone className="w-5 h-5 text-primary" /></span>
              <div><div className="text-xs text-muted-foreground">Phone — 24/7</div><a href={telHref(settings.phone)} className="font-medium hover:text-primary">{settings.phone}</a></div>
            </li>
            <li className="flex items-center gap-4">
              <span className="w-11 h-11 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center"><MapPin className="w-5 h-5 text-primary" /></span>
              <div><div className="text-xs text-muted-foreground">Address</div><div className="font-medium">{settings.address}</div></div>
            </li>
          </ul>
        </div>

        <form onSubmit={onSubmit} className="glass rounded-2xl p-8 shadow-elevated space-y-5">
          <div className="grid sm:grid-cols-2 gap-4">
            <div className="space-y-2"><Label htmlFor="name">Full name</Label><Input id="name" required placeholder="John Doe" className="bg-background/50 border-border" /></div>
            <div className="space-y-2"><Label htmlFor="email">Email</Label><Input id="email" type="email" required placeholder="john@company.com" className="bg-background/50 border-border" /></div>
          </div>
          <div className="space-y-2"><Label htmlFor="company">Company</Label><Input id="company" placeholder="Your company" className="bg-background/50 border-border" /></div>
          <div className="space-y-2"><Label htmlFor="service">Service interested in</Label><Input id="service" placeholder="e.g. Truck dispatching" className="bg-background/50 border-border" /></div>
          <div className="space-y-2"><Label htmlFor="message">How can we help?</Label><Textarea id="message" rows={5} required placeholder="Tell us about your project..." className="bg-background/50 border-border resize-none" /></div>
          <Button type="submit" size="lg" className="w-full bg-gradient-primary text-primary-foreground border-0 shadow-glow hover:opacity-90">
            Send message <Send className="ml-2 w-4 h-4" />
          </Button>
        </form>
      </div>
    </section>
  );
};

export default Contact;