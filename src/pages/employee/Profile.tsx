import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useEmployeeAuth } from "@/hooks/useEmployeeAuth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";

const EmployeeProfile = () => {
  const { employee, refresh } = useEmployeeAuth();
  const [form, setForm] = useState({ name: "", mobile: "", email: "", dob: "", avatar_url: "", about: "" });

  useEffect(() => {
    if (employee) setForm({
      name: employee.name, mobile: employee.mobile, email: employee.email || "",
      dob: employee.dob || "", avatar_url: employee.avatar_url || "", about: employee.about || "",
    });
  }, [employee?.id]);

  const save = async () => {
    if (!employee) return;
    const { error } = await supabase.from("employees").update({
      name: form.name, mobile: form.mobile, email: form.email || null,
      dob: form.dob || null, avatar_url: form.avatar_url || null, about: form.about || null,
    }).eq("id", employee.id);
    if (error) return toast.error(error.message);
    toast.success("Profile updated");
    refresh();
  };

  return (
    <div className="space-y-6 max-w-2xl">
      <div>
        <h1 className="text-3xl font-bold">My Profile</h1>
        <p className="text-muted-foreground">Your personal data is only visible to you and the admin.</p>
      </div>

      <div className="glass rounded-xl p-5 border border-border space-y-4">
        <div className="flex items-center gap-4">
          <div className="w-20 h-20 rounded-full bg-muted overflow-hidden flex items-center justify-center text-2xl font-bold">
            {form.avatar_url ? <img src={form.avatar_url} alt={form.name} className="w-full h-full object-cover" /> : (form.name[0] || "?")}
          </div>
          <div className="flex-1">
            <Label>Avatar URL</Label>
            <Input value={form.avatar_url} onChange={(e) => setForm({ ...form, avatar_url: e.target.value })} placeholder="https://..." />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div><Label>Name</Label><Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} /></div>
          <div><Label>Mobile</Label><Input value={form.mobile} onChange={(e) => setForm({ ...form, mobile: e.target.value })} /></div>
          <div><Label>Email</Label><Input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} /></div>
          <div><Label>Date of birth</Label><Input type="date" value={form.dob} onChange={(e) => setForm({ ...form, dob: e.target.value })} /></div>
        </div>

        <div><Label>About me</Label><Textarea value={form.about} onChange={(e) => setForm({ ...form, about: e.target.value })} placeholder="A short bio..." /></div>

        <Button onClick={save} className="w-full bg-gradient-primary text-primary-foreground border-0">Save profile</Button>
      </div>

      <div className="glass rounded-xl p-5 border border-border text-sm text-muted-foreground space-y-1">
        <div><strong className="text-foreground">Department:</strong> {employee?.department || "—"} (admin only)</div>
        <div><strong className="text-foreground">Role:</strong> {employee?.role || "—"} (admin only)</div>
        <div><strong className="text-foreground">Joining:</strong> {employee?.joining_date || "—"}</div>
      </div>
    </div>
  );
};

export default EmployeeProfile;