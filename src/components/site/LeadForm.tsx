import { useState } from "react";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { Loader2, Send, CheckCircle2 } from "lucide-react";
import { softwareServices } from "@/lib/softwareServices";

const schema = z.object({
  name: z.string().trim().min(2, "Name is too short").max(100),
  email: z.string().trim().email("Invalid email").max(255),
  phone: z.string().trim().min(7, "Invalid phone").max(20),
  company: z.string().trim().max(120).optional(),
  service_category: z.string().min(1, "Please select a service"),
  project_type: z.string().max(120).optional(),
  budget: z.string().max(60).optional(),
  message: z.string().trim().min(5, "Tell us a bit more").max(2000),
});

type LeadFormProps = {
  defaultCategory?: string;
  sourcePage?: string;
  compact?: boolean;
};

const LeadForm = ({ defaultCategory, sourcePage, compact }: LeadFormProps) => {
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    company: "",
    service_category: defaultCategory ?? "",
    project_type: "",
    budget: "",
    message: "",
  });

  const update = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setForm({ ...form, [k]: e.target.value });

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    const parsed = schema.safeParse(form);
    if (!parsed.success) {
      toast({ title: "Please check the form", description: parsed.error.errors[0]?.message ?? "Invalid input", variant: "destructive" });
      return;
    }
    setLoading(true);
    const { error } = await supabase.from("leads").insert({
      name: parsed.data.name,
      email: parsed.data.email,
      phone: parsed.data.phone,
      company: parsed.data.company,
      service_category: parsed.data.service_category,
      project_type: parsed.data.project_type,
      budget: parsed.data.budget,
      message: parsed.data.message,
      source_page: sourcePage ?? (typeof window !== "undefined" ? window.location.pathname : ""),
    });
    setLoading(false);
    if (error) {
      toast({ title: "Could not submit", description: error.message, variant: "destructive" });
      return;
    }
    setDone(true);
    toast({ title: "Thanks!", description: "We'll get back to you within 24 hours." });
    setForm({ name: "", email: "", phone: "", company: "", service_category: defaultCategory ?? "", project_type: "", budget: "", message: "" });
  };

  if (done) {
    return (
      <div className="glass rounded-2xl p-8 text-center">
        <CheckCircle2 className="w-12 h-12 text-primary mx-auto mb-3" />
        <h3 className="text-xl font-semibold mb-1">Request received</h3>
        <p className="text-muted-foreground text-sm mb-4">Our team will reach out within 24 hours.</p>
        <Button variant="outline" onClick={() => setDone(false)}>Submit another</Button>
      </div>
    );
  }

  return (
    <form onSubmit={submit} className={`glass rounded-2xl p-6 md:p-8 space-y-4 ${compact ? "" : "shadow-card-glow"}`}>
      <div className="grid sm:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="name">Full name *</Label>
          <Input id="name" value={form.name} onChange={update("name")} placeholder="John Doe" />
        </div>
        <div>
          <Label htmlFor="email">Email *</Label>
          <Input id="email" type="email" value={form.email} onChange={update("email")} placeholder="you@company.com" />
        </div>
        <div>
          <Label htmlFor="phone">Phone / WhatsApp *</Label>
          <Input id="phone" value={form.phone} onChange={update("phone")} placeholder="+91 98765 43210" />
        </div>
        <div>
          <Label htmlFor="company">Company</Label>
          <Input id="company" value={form.company} onChange={update("company")} placeholder="Acme Inc." />
        </div>
        <div>
          <Label>Service *</Label>
          <Select value={form.service_category} onValueChange={(v) => setForm({ ...form, service_category: v })}>
            <SelectTrigger><SelectValue placeholder="Select a service" /></SelectTrigger>
            <SelectContent>
              {softwareServices.map((s) => (
                <SelectItem key={s.slug} value={s.title}>{s.title}</SelectItem>
              ))}
              <SelectItem value="Other">Other</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label>Budget</Label>
          <Select value={form.budget} onValueChange={(v) => setForm({ ...form, budget: v })}>
            <SelectTrigger><SelectValue placeholder="Estimated budget" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="Under ₹50,000">Under ₹50,000</SelectItem>
              <SelectItem value="₹50,000 – ₹2,00,000">₹50,000 – ₹2,00,000</SelectItem>
              <SelectItem value="₹2,00,000 – ₹10,00,000">₹2,00,000 – ₹10,00,000</SelectItem>
              <SelectItem value="₹10,00,000+">₹10,00,000+</SelectItem>
              <SelectItem value="Not sure yet">Not sure yet</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      <div>
        <Label htmlFor="message">Project details *</Label>
        <Textarea id="message" rows={4} value={form.message} onChange={update("message")} placeholder="Tell us about your project, goals and timeline..." />
      </div>
      <Button type="submit" disabled={loading} size="lg" className="w-full bg-gradient-primary text-primary-foreground border-0 shadow-glow hover:opacity-90">
        {loading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Send className="w-4 h-4 mr-2" />}
        Send my request
      </Button>
      <p className="text-xs text-muted-foreground text-center">
        Your request goes straight to our team. We typically reply within 24 hours.
      </p>
    </form>
  );
};

export default LeadForm;