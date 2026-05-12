import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, Check, X, Trash2 } from "lucide-react";
import { toast } from "sonner";
import CrudTable from "@/components/admin/CrudTable";

type Leave = { id: string; employee_id: string; leave_type: string; from_date: string; to_date: string; days: number; reason: string | null; status: string };
type Employee = { id: string; name: string };

const empty = { employee_id: "", leave_type: "casual", from_date: "", to_date: "", days: 1, reason: "" };

const Leaves = () => {
  const [rows, setRows] = useState<(Leave & { employee_name: string })[]>([]);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState(empty);

  const load = async () => {
    const [l, e] = await Promise.all([
      supabase.from("leaves").select("*").order("from_date", { ascending: false }),
      supabase.from("employees").select("id,name").order("name"),
    ]);
    const emps = (e.data as Employee[]) || [];
    setEmployees(emps);
    const map = new Map(emps.map((x) => [x.id, x.name]));
    setRows(((l.data as Leave[]) || []).map((r) => ({ ...r, employee_name: map.get(r.employee_id) || "—" })));
  };
  useEffect(() => { load(); }, []);

  const days = (from: string, to: string) => {
    if (!from || !to) return 1;
    const d = (new Date(to).getTime() - new Date(from).getTime()) / 86400000 + 1;
    return Math.max(1, Math.round(d));
  };

  const save = async () => {
    if (!form.employee_id || !form.from_date || !form.to_date) return toast.error("Employee and dates required.");
    const payload = { ...form, days: days(form.from_date, form.to_date), reason: form.reason || null };
    const { error } = await supabase.from("leaves").insert(payload);
    if (error) return toast.error(error.message);
    toast.success("Leave added");
    setOpen(false); setForm(empty); load();
  };

  const setStatus = async (id: string, status: string) => {
    await supabase.from("leaves").update({ status }).eq("id", id);
    load();
  };
  const remove = async (id: string) => {
    if (!confirm("Delete?")) return;
    await supabase.from("leaves").delete().eq("id", id);
    load();
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold">Leaves</h1>
          <p className="text-muted-foreground">Track employee leave applications and approvals.</p>
        </div>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button className="bg-gradient-primary text-primary-foreground border-0"><Plus className="w-4 h-4 mr-2" />Add leave</Button>
          </DialogTrigger>
          <DialogContent className="max-w-lg">
            <DialogHeader><DialogTitle>New leave</DialogTitle></DialogHeader>
            <div className="space-y-4">
              <div>
                <Label>Employee</Label>
                <Select value={form.employee_id} onValueChange={(v) => setForm({ ...form, employee_id: v })}>
                  <SelectTrigger><SelectValue placeholder="Pick employee" /></SelectTrigger>
                  <SelectContent>{employees.map((e) => <SelectItem key={e.id} value={e.id}>{e.name}</SelectItem>)}</SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div><Label>Type</Label>
                  <Select value={form.leave_type} onValueChange={(v) => setForm({ ...form, leave_type: v })}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="casual">Casual</SelectItem>
                      <SelectItem value="sick">Sick</SelectItem>
                      <SelectItem value="paid">Paid</SelectItem>
                      <SelectItem value="unpaid">Unpaid</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div><Label>Days</Label><Input type="number" value={days(form.from_date, form.to_date)} readOnly /></div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div><Label>From</Label><Input type="date" value={form.from_date} onChange={(e) => setForm({ ...form, from_date: e.target.value })} /></div>
                <div><Label>To</Label><Input type="date" value={form.to_date} onChange={(e) => setForm({ ...form, to_date: e.target.value })} /></div>
              </div>
              <div><Label>Reason</Label><Textarea rows={3} value={form.reason} onChange={(e) => setForm({ ...form, reason: e.target.value })} /></div>
              <Button onClick={save} className="w-full bg-gradient-primary text-primary-foreground border-0">Save</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
      <CrudTable
        rows={rows}
        columns={[
          { header: "Employee", render: (r) => <span className="font-medium">{r.employee_name}</span> },
          { header: "Type", render: (r) => <span className="capitalize">{r.leave_type}</span> },
          { header: "From", render: (r) => r.from_date },
          { header: "To", render: (r) => r.to_date },
          { header: "Days", render: (r) => r.days },
          { header: "Status", render: (r) => <span className={`px-2 py-0.5 rounded-full text-xs border ${
            r.status === "approved" ? "border-primary/40 text-primary bg-primary/10" :
            r.status === "rejected" ? "border-destructive/40 text-destructive bg-destructive/10" :
            "border-border text-muted-foreground"
          }`}>{r.status}</span> },
          { header: "", className: "w-32 text-right", render: (r) => (
            <div className="flex gap-1 justify-end">
              <Button size="icon" variant="ghost" onClick={() => setStatus(r.id, "approved")}><Check className="w-4 h-4 text-primary" /></Button>
              <Button size="icon" variant="ghost" onClick={() => setStatus(r.id, "rejected")}><X className="w-4 h-4 text-destructive" /></Button>
              <Button size="icon" variant="ghost" onClick={() => remove(r.id)}><Trash2 className="w-4 h-4" /></Button>
            </div>
          )},
        ]}
      />
    </div>
  );
};

export default Leaves;