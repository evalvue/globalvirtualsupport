import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Plus, Pencil, Trash2, KeyRound } from "lucide-react";
import { toast } from "sonner";
import CrudTable from "@/components/admin/CrudTable";
import { inr } from "@/lib/currency";

type Employee = {
  id: string;
  name: string;
  mobile: string;
  email: string | null;
  role: string | null;
  department: string | null;
  base_salary: number;
  joining_date: string | null;
  active: boolean;
  dob?: string | null;
  user_id?: string | null;
  monthly_target?: number;
};

const empty = { name: "", mobile: "", email: "", role: "", department: "HR", base_salary: 0, joining_date: "", active: true, dob: "", monthly_target: 0 };

const Employees = () => {
  const [rows, setRows] = useState<Employee[]>([]);
  const [open, setOpen] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [form, setForm] = useState(empty);
  const [credFor, setCredFor] = useState<Employee | null>(null);
  const [credEmail, setCredEmail] = useState("");
  const [credPassword, setCredPassword] = useState("");
  const [credLoading, setCredLoading] = useState(false);

  const load = async () => {
    const { data } = await supabase.from("employees").select("*").order("name");
    setRows((data as Employee[]) || []);
  };
  useEffect(() => { load(); }, []);

  const startNew = () => { setEditId(null); setForm(empty); setOpen(true); };
  const startEdit = (r: Employee) => {
    setEditId(r.id);
    setForm({ name: r.name, mobile: r.mobile, email: r.email || "", role: r.role || "", department: r.department || "", base_salary: Number(r.base_salary), joining_date: r.joining_date || "", active: r.active, dob: r.dob || "", monthly_target: Number(r.monthly_target || 0) });
    setOpen(true);
  };

  const save = async () => {
    if (!form.name || !form.mobile) return toast.error("Name and mobile required.");
    const payload = {
      name: form.name, mobile: form.mobile,
      email: form.email || null, role: form.role || null, department: form.department || null,
      base_salary: Number(form.base_salary) || 0, joining_date: form.joining_date || null, active: form.active,
      dob: form.dob || null, monthly_target: Number(form.monthly_target) || 0,
    };
    const { error } = editId
      ? await supabase.from("employees").update(payload).eq("id", editId)
      : await supabase.from("employees").insert(payload);
    if (error) return toast.error(error.message);
    toast.success("Saved");
    setOpen(false);
    load();
  };

  const remove = async (id: string) => {
    if (!confirm("Delete this employee?")) return;
    await supabase.from("employees").delete().eq("id", id);
    load();
  };

  const openCred = (r: Employee) => {
    setCredFor(r);
    setCredEmail(r.email || "");
    setCredPassword("");
  };

  const createLogin = async () => {
    if (!credFor) return;
    if (!credEmail || credPassword.length < 6) return toast.error("Email & 6+ char password required.");
    setCredLoading(true);
    const { data, error } = await supabase.functions.invoke("create-employee", {
      body: { employee_id: credFor.id, email: credEmail, password: credPassword },
    });
    setCredLoading(false);
    if (error || (data as any)?.error) return toast.error((data as any)?.error || error?.message || "Failed");
    toast.success(`Login created for ${credFor.name}`);
    setCredFor(null);
    load();
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold">Employees (HR)</h1>
          <p className="text-muted-foreground">Add HR, agents, drivers, developers — anyone on payroll.</p>
        </div>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button onClick={startNew} className="bg-gradient-primary text-primary-foreground border-0"><Plus className="w-4 h-4 mr-2" />Add employee</Button>
          </DialogTrigger>
          <DialogContent className="max-w-lg">
            <DialogHeader><DialogTitle>{editId ? "Edit employee" : "Add employee"}</DialogTitle></DialogHeader>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div><Label>Name *</Label><Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} /></div>
                <div><Label>Mobile *</Label><Input value={form.mobile} onChange={(e) => setForm({ ...form, mobile: e.target.value })} /></div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div><Label>Email</Label><Input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} /></div>
                <div><Label>Department</Label><Input value={form.department} onChange={(e) => setForm({ ...form, department: e.target.value })} placeholder="HR / Dispatch / Dev" /></div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div><Label>Role / Designation</Label><Input value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })} /></div>
                <div><Label>Base salary (monthly)</Label><Input type="number" value={form.base_salary} onChange={(e) => setForm({ ...form, base_salary: Number(e.target.value) })} /></div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div><Label>Joining date</Label><Input type="date" value={form.joining_date} onChange={(e) => setForm({ ...form, joining_date: e.target.value })} /></div>
                <div><Label>Date of birth</Label><Input type="date" value={form.dob} onChange={(e) => setForm({ ...form, dob: e.target.value })} /></div>
              </div>
              <div><Label>Monthly target (tasks)</Label><Input type="number" value={form.monthly_target} onChange={(e) => setForm({ ...form, monthly_target: Number(e.target.value) })} /></div>
              <Button onClick={save} className="w-full bg-gradient-primary text-primary-foreground border-0">Save</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
      <CrudTable
        rows={rows}
        columns={[
          { header: "Name", render: (r) => <span className="font-medium">{r.name}</span> },
          { header: "Mobile", render: (r) => r.mobile },
          { header: "Department", render: (r) => r.department || "—" },
          { header: "Role", render: (r) => r.role || "—" },
          { header: "Salary", render: (r) => inr(r.base_salary) },
          { header: "Login", render: (r) => r.user_id ? <span className="text-xs text-green-500">✓ active</span> : <span className="text-xs text-muted-foreground">—</span> },
          { header: "", className: "w-36 text-right", render: (r) => (
            <div className="flex gap-1 justify-end">
              <Button size="icon" variant="ghost" title="Create / reset login" onClick={() => openCred(r)}><KeyRound className="w-4 h-4" /></Button>
              <Button size="icon" variant="ghost" onClick={() => startEdit(r)}><Pencil className="w-4 h-4" /></Button>
              <Button size="icon" variant="ghost" onClick={() => remove(r.id)}><Trash2 className="w-4 h-4 text-destructive" /></Button>
            </div>
          )},
        ]}
      />

      <Dialog open={!!credFor} onOpenChange={(o) => !o && setCredFor(null)}>
        <DialogContent>
          <DialogHeader><DialogTitle>Employee CRM login — {credFor?.name}</DialogTitle></DialogHeader>
          <p className="text-sm text-muted-foreground">Set email & password. The employee will sign in at <code>/employee/login</code>.</p>
          <div className="space-y-3 mt-2">
            <div><Label>Email</Label><Input type="email" value={credEmail} onChange={(e) => setCredEmail(e.target.value)} /></div>
            <div><Label>Password (min 6 chars)</Label><Input type="text" value={credPassword} onChange={(e) => setCredPassword(e.target.value)} placeholder="Share securely with employee" /></div>
            <Button onClick={createLogin} disabled={credLoading} className="w-full bg-gradient-primary text-primary-foreground border-0">
              {credLoading ? "Creating..." : (credFor?.user_id ? "Reset password" : "Create login")}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Employees;