import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Plus, Pencil, Trash2 } from "lucide-react";
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
};

const empty = { name: "", mobile: "", email: "", role: "", department: "HR", base_salary: 0, joining_date: "", active: true };

const Employees = () => {
  const [rows, setRows] = useState<Employee[]>([]);
  const [open, setOpen] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [form, setForm] = useState(empty);

  const load = async () => {
    const { data } = await supabase.from("employees").select("*").order("name");
    setRows((data as Employee[]) || []);
  };
  useEffect(() => { load(); }, []);

  const startNew = () => { setEditId(null); setForm(empty); setOpen(true); };
  const startEdit = (r: Employee) => {
    setEditId(r.id);
    setForm({ name: r.name, mobile: r.mobile, email: r.email || "", role: r.role || "", department: r.department || "", base_salary: Number(r.base_salary), joining_date: r.joining_date || "", active: r.active });
    setOpen(true);
  };

  const save = async () => {
    if (!form.name || !form.mobile) return toast.error("Name and mobile required.");
    const payload = {
      name: form.name, mobile: form.mobile,
      email: form.email || null, role: form.role || null, department: form.department || null,
      base_salary: Number(form.base_salary) || 0, joining_date: form.joining_date || null, active: form.active,
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
              <div><Label>Joining date</Label><Input type="date" value={form.joining_date} onChange={(e) => setForm({ ...form, joining_date: e.target.value })} /></div>
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
          { header: "Joined", render: (r) => r.joining_date || "—" },
          { header: "", className: "w-24 text-right", render: (r) => (
            <div className="flex gap-1 justify-end">
              <Button size="icon" variant="ghost" onClick={() => startEdit(r)}><Pencil className="w-4 h-4" /></Button>
              <Button size="icon" variant="ghost" onClick={() => remove(r.id)}><Trash2 className="w-4 h-4 text-destructive" /></Button>
            </div>
          )},
        ]}
      />
    </div>
  );
};

export default Employees;