import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, Pencil, Check } from "lucide-react";
import { toast } from "sonner";
import CrudTable from "@/components/admin/CrudTable";
import { inr } from "@/lib/currency";

type Employee = { id: string; name: string; base_salary: number };
type Salary = {
  id: string;
  employee_id: string;
  month: string;
  base: number;
  bonus: number;
  deduction: number;
  net: number;
  paid: boolean;
};

const monthInput = (d: string) => d.slice(0, 7);
const toFirst = (m: string) => m + "-01";

const empty = { employee_id: "", month: monthInput(new Date().toISOString()), base: 0, bonus: 0, deduction: 0 };

const Salary = () => {
  const [rows, setRows] = useState<(Salary & { employee_name: string })[]>([]);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [open, setOpen] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [form, setForm] = useState(empty);

  const load = async () => {
    const [s, e] = await Promise.all([
      supabase.from("salaries").select("*").order("month", { ascending: false }),
      supabase.from("employees").select("id,name,base_salary").order("name"),
    ]);
    const emps = (e.data as Employee[]) || [];
    setEmployees(emps);
    const empMap = new Map(emps.map((x) => [x.id, x.name]));
    setRows(((s.data as Salary[]) || []).map((r) => ({ ...r, employee_name: empMap.get(r.employee_id) || "—" })));
  };
  useEffect(() => { load(); }, []);

  const startNew = () => { setEditId(null); setForm(empty); setOpen(true); };
  const startEdit = (r: Salary) => {
    setEditId(r.id);
    setForm({ employee_id: r.employee_id, month: monthInput(r.month), base: Number(r.base), bonus: Number(r.bonus), deduction: Number(r.deduction) });
    setOpen(true);
  };

  const onPickEmployee = (id: string) => {
    const emp = employees.find((x) => x.id === id);
    setForm({ ...form, employee_id: id, base: emp ? Number(emp.base_salary) : form.base });
  };

  const save = async () => {
    if (!form.employee_id || !form.month) return toast.error("Employee and month required.");
    const net = Number(form.base) + Number(form.bonus) - Number(form.deduction);
    const payload = { employee_id: form.employee_id, month: toFirst(form.month), base: form.base, bonus: form.bonus, deduction: form.deduction, net };
    const { error } = editId
      ? await supabase.from("salaries").update(payload).eq("id", editId)
      : await supabase.from("salaries").upsert(payload, { onConflict: "employee_id,month" });
    if (error) return toast.error(error.message);
    toast.success("Saved");
    setOpen(false);
    load();
  };

  const markPaid = async (r: Salary) => {
    await supabase.from("salaries").update({ paid: !r.paid, paid_at: !r.paid ? new Date().toISOString() : null }).eq("id", r.id);
    load();
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold">Salary</h1>
          <p className="text-muted-foreground">Generate and pay monthly salaries.</p>
        </div>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button onClick={startNew} className="bg-gradient-primary text-primary-foreground border-0"><Plus className="w-4 h-4 mr-2" />New salary</Button>
          </DialogTrigger>
          <DialogContent className="max-w-lg">
            <DialogHeader><DialogTitle>{editId ? "Edit salary" : "Generate salary"}</DialogTitle></DialogHeader>
            <div className="space-y-4">
              <div>
                <Label>Employee</Label>
                <Select value={form.employee_id} onValueChange={onPickEmployee}>
                  <SelectTrigger><SelectValue placeholder="Pick employee" /></SelectTrigger>
                  <SelectContent>
                    {employees.map((e) => <SelectItem key={e.id} value={e.id}>{e.name}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div><Label>Month</Label><Input type="month" value={form.month} onChange={(e) => setForm({ ...form, month: e.target.value })} /></div>
                <div><Label>Base</Label><Input type="number" value={form.base} onChange={(e) => setForm({ ...form, base: Number(e.target.value) })} /></div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div><Label>Bonus</Label><Input type="number" value={form.bonus} onChange={(e) => setForm({ ...form, bonus: Number(e.target.value) })} /></div>
                <div><Label>Deduction</Label><Input type="number" value={form.deduction} onChange={(e) => setForm({ ...form, deduction: Number(e.target.value) })} /></div>
              </div>
              <div className="text-sm text-muted-foreground">
                Net: <span className="text-foreground font-bold text-lg">{inr(Number(form.base) + Number(form.bonus) - Number(form.deduction))}</span>
              </div>
              <Button onClick={save} className="w-full bg-gradient-primary text-primary-foreground border-0">Save</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <CrudTable
        rows={rows}
        columns={[
          { header: "Employee", render: (r) => <span className="font-medium">{r.employee_name}</span> },
          { header: "Month", render: (r) => r.month.slice(0, 7) },
          { header: "Base", render: (r) => inr(r.base) },
          { header: "Bonus", render: (r) => inr(r.bonus) },
          { header: "Deduction", render: (r) => inr(r.deduction) },
          { header: "Net", render: (r) => <span className="font-bold text-gradient">{inr(r.net)}</span> },
          { header: "Status", render: (r) => r.paid
            ? <span className="px-2 py-0.5 rounded-full text-xs border border-primary/40 text-primary bg-primary/10">Paid</span>
            : <span className="px-2 py-0.5 rounded-full text-xs border border-border text-muted-foreground">Unpaid</span> },
          { header: "", className: "w-32 text-right", render: (r) => (
            <div className="flex gap-1 justify-end">
              <Button size="icon" variant="ghost" onClick={() => startEdit(r)}><Pencil className="w-4 h-4" /></Button>
              <Button size="icon" variant="ghost" onClick={() => markPaid(r)}><Check className={`w-4 h-4 ${r.paid ? "text-primary" : ""}`} /></Button>
            </div>
          )},
        ]}
      />
    </div>
  );
};

export default Salary;