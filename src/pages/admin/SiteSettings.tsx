import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";

const SiteSettings = () => {
  const [form, setForm] = useState({ id: "", phone: "", email: "", address: "", whatsapp: "" });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    (async () => {
      const { data } = await supabase.from("site_settings").select("*").limit(1).maybeSingle();
      if (data) setForm({ id: data.id, phone: data.phone, email: data.email, address: data.address, whatsapp: data.whatsapp || "" });
      setLoading(false);
    })();
  }, []);

  const save = async () => {
    setSaving(true);
    const { error } = form.id
      ? await supabase.from("site_settings").update({ phone: form.phone, email: form.email, address: form.address, whatsapp: form.whatsapp || null, updated_at: new Date().toISOString() }).eq("id", form.id)
      : await supabase.from("site_settings").insert({ phone: form.phone, email: form.email, address: form.address, whatsapp: form.whatsapp || null });
    setSaving(false);
    if (error) toast.error(error.message);
    else toast.success("Site settings saved. Public site updated.");
  };

  if (loading) return <div className="text-muted-foreground">Loading...</div>;

  return (
    <div>
      <h1 className="text-3xl font-bold mb-2">Site Settings</h1>
      <p className="text-muted-foreground mb-8">These values are shown across the public website (navbar, footer, contact page).</p>
      <div className="glass rounded-2xl p-6 space-y-5 max-w-2xl">
        <div className="space-y-2"><Label>Mobile / Phone</Label><Input value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} placeholder="+1 (404) 382-0137" /></div>
        <div className="space-y-2"><Label>Email</Label><Input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} /></div>
        <div className="space-y-2"><Label>WhatsApp (optional)</Label><Input value={form.whatsapp} onChange={(e) => setForm({ ...form, whatsapp: e.target.value })} placeholder="+1..." /></div>
        <div className="space-y-2"><Label>Address</Label><Textarea rows={3} value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} /></div>
        <Button onClick={save} disabled={saving} className="bg-gradient-primary text-primary-foreground border-0">{saving ? "Saving..." : "Save changes"}</Button>
      </div>
    </div>
  );
};

export default SiteSettings;