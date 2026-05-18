import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useEmployeeAuth } from "@/hooks/useEmployeeAuth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

type Row = { id: string; log_date: string; tasks_completed: number; customers_handled: number; notes: string | null };

const todayISO = () => new Date().toISOString().slice(0, 10);

const EmployeeTasks = () => {
  const { employee } = useEmployeeAuth();
  const [rows, setRows] = useState<Row[]>([]);
  const [tasks, setTasks] = useState(0);
  const [customers, setCustomers] = useState(0);
  const [notes, setNotes] = useState("");
  const [existingId, setExistingId] = useState<string | null>(null);

  const load = async () => {
    if (!employee) return;
    const { data } = await supabase
      .from("work_logs")
      .select("id,log_date,tasks_completed,customers_handled,notes")
      .eq("employee_id", employee.id)
      .order("log_date", { ascending: false })
      .limit(60);
    const list = (data as Row[]) || [];
    setRows(list);
    const today = list.find((r) => r.log_date === todayISO());
    if (today) {
      setExistingId(today.id);
      setTasks(today.tasks_completed);
      setCustomers(today.customers_handled);
      setNotes(today.notes || "");
    } else {
      setExistingId(null);
      setTasks(0); setCustomers(0); setNotes("");
    }
  };
  useEffect(() => { load(); }, [employee?.id]);

  const save = async () => {
    if (!employee) return;
    const payload = {
      employee_id: employee.id,
      log_date: todayISO(),
      tasks_completed: Number(tasks) || 0,
      customers_handled: Number(customers) || 0,
      notes: notes || null,
    };
    const { error } = existingId
      ? await supabase.from("work_logs").update(payload).eq("id", existingId)
      : await supabase.from("work_logs").insert(payload);
    if (error) return toast.error(error.message);
    toast.success("Saved");
    load();
  };

  const totalTasks = rows.reduce((a, r) => a + r.tasks_completed, 0);
  const totalCustomers = rows.reduce((a, r) => a + r.customers_handled, 0);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Tasks & Customers</h1>
        <p className="text-muted-foreground">Log how much work you completed today.</p>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <div className="glass rounded-xl p-4 border border-border"><div className="text-xs text-muted-foreground">Total tasks (60d)</div><div className="text-2xl font-bold">{totalTasks}</div></div>
        <div className="glass rounded-xl p-4 border border-border"><div className="text-xs text-muted-foreground">Total customers (60d)</div><div className="text-2xl font-bold">{totalCustomers}</div></div>
        <div className="glass rounded-xl p-4 border border-border"><div className="text-xs text-muted-foreground">Monthly target</div><div className="text-2xl font-bold">{employee?.monthly_target || 0}</div></div>
        <div className="glass rounded-xl p-4 border border-border"><div className="text-xs text-muted-foreground">Today tasks</div><div className="text-2xl font-bold">{tasks}</div></div>
      </div>

      <div className="glass rounded-xl p-5 border border-border space-y-3">
        <div className="font-semibold">Today's log ({todayISO()})</div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <div><Label>Tasks completed</Label><Input type="number" min={0} value={tasks} onChange={(e) => setTasks(Number(e.target.value))} /></div>
          <div><Label>Customers handled</Label><Input type="number" min={0} value={customers} onChange={(e) => setCustomers(Number(e.target.value))} /></div>
          <div className="flex items-end"><Button onClick={save} className="w-full bg-gradient-primary text-primary-foreground border-0">{existingId ? "Update today" : "Save today"}</Button></div>
        </div>
        <div><Label>Notes</Label><Textarea value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="What did you work on?" /></div>
      </div>

      <div className="glass rounded-xl border border-border overflow-hidden">
        <Table>
          <TableHeader><TableRow><TableHead>Date</TableHead><TableHead>Tasks</TableHead><TableHead>Customers</TableHead><TableHead>Notes</TableHead></TableRow></TableHeader>
          <TableBody>
            {rows.map((r) => (
              <TableRow key={r.id}>
                <TableCell>{r.log_date}</TableCell>
                <TableCell>{r.tasks_completed}</TableCell>
                <TableCell>{r.customers_handled}</TableCell>
                <TableCell className="text-muted-foreground max-w-md truncate">{r.notes || "—"}</TableCell>
              </TableRow>
            ))}
            {rows.length === 0 && (<TableRow><TableCell colSpan={4} className="text-center text-muted-foreground">No work logs yet.</TableCell></TableRow>)}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default EmployeeTasks;