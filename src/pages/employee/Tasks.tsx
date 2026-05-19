import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useEmployeeAuth } from "@/hooks/useEmployeeAuth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2, Circle, Trash2, Plus } from "lucide-react";

type Row = { id: string; log_date: string; tasks_completed: number; customers_handled: number; notes: string | null };
type Task = { id: string; title: string; description: string | null; status: string; priority: string; due_date: string | null; created_at: string };

const todayISO = () => new Date().toISOString().slice(0, 10);

const EmployeeTasks = () => {
  const { employee } = useEmployeeAuth();
  const [rows, setRows] = useState<Row[]>([]);
  const [tasks, setTasks] = useState(0);
  const [customers, setCustomers] = useState(0);
  const [notes, setNotes] = useState("");
  const [existingId, setExistingId] = useState<string | null>(null);
  const [taskList, setTaskList] = useState<Task[]>([]);
  const [newTitle, setNewTitle] = useState("");
  const [newDesc, setNewDesc] = useState("");
  const [newPriority, setNewPriority] = useState("medium");
  const [newDue, setNewDue] = useState("");

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

  const loadTasks = async () => {
    if (!employee) return;
    const { data } = await (supabase as any)
      .from("employee_tasks")
      .select("id,title,description,status,priority,due_date,created_at")
      .eq("employee_id", employee.id)
      .order("created_at", { ascending: false });
    setTaskList((data as Task[]) || []);
  };

  useEffect(() => { load(); loadTasks(); }, [employee?.id]);

  const addTask = async () => {
    if (!employee) return;
    if (!newTitle.trim()) return toast.error("Title required");
    const { error } = await (supabase as any).from("employee_tasks").insert({
      employee_id: employee.id,
      title: newTitle.trim(),
      description: newDesc.trim() || null,
      priority: newPriority,
      due_date: newDue || null,
      status: "todo",
    });
    if (error) return toast.error(error.message);
    toast.success("Task created");
    setNewTitle(""); setNewDesc(""); setNewDue(""); setNewPriority("medium");
    loadTasks();
  };

  const toggleTask = async (t: Task) => {
    const done = t.status === "done";
    const { error } = await (supabase as any)
      .from("employee_tasks")
      .update({ status: done ? "todo" : "done", completed_at: done ? null : new Date().toISOString() })
      .eq("id", t.id);
    if (error) return toast.error(error.message);
    loadTasks();
  };

  const deleteTask = async (id: string) => {
    const { error } = await (supabase as any).from("employee_tasks").delete().eq("id", id);
    if (error) return toast.error(error.message);
    toast.success("Deleted");
    loadTasks();
  };

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
  const openCount = taskList.filter((t) => t.status !== "done").length;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Tasks & Customers</h1>
        <p className="text-muted-foreground">Create your own tasks and log daily work.</p>
      </div>

      <div className="glass rounded-xl p-5 border border-border space-y-3">
        <div className="flex items-center justify-between">
          <div className="font-semibold">My Tasks <span className="text-muted-foreground text-sm">({openCount} open)</span></div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-12 gap-3">
          <div className="md:col-span-4"><Label>Task title</Label><Input value={newTitle} onChange={(e) => setNewTitle(e.target.value)} placeholder="Call client / Fix bug…" /></div>
          <div className="md:col-span-4"><Label>Description</Label><Input value={newDesc} onChange={(e) => setNewDesc(e.target.value)} placeholder="Optional details" /></div>
          <div className="md:col-span-2"><Label>Priority</Label>
            <Select value={newPriority} onValueChange={setNewPriority}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="low">Low</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="high">High</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="md:col-span-2"><Label>Due date</Label><Input type="date" value={newDue} onChange={(e) => setNewDue(e.target.value)} /></div>
        </div>
        <Button onClick={addTask} className="bg-gradient-primary text-primary-foreground border-0">
          <Plus className="w-4 h-4 mr-2" /> Add task
        </Button>
        <div className="space-y-2">
          {taskList.length === 0 && <div className="text-sm text-muted-foreground">No tasks yet — create your first one above.</div>}
          {taskList.map((t) => (
            <div key={t.id} className="flex items-center gap-3 p-3 rounded-lg border border-border bg-card/40">
              <button onClick={() => toggleTask(t)} className="text-primary hover:scale-110 transition-transform">
                {t.status === "done" ? <CheckCircle2 className="w-5 h-5" /> : <Circle className="w-5 h-5" />}
              </button>
              <div className="flex-1 min-w-0">
                <div className={`font-medium truncate ${t.status === "done" ? "line-through text-muted-foreground" : ""}`}>{t.title}</div>
                {t.description && <div className="text-xs text-muted-foreground truncate">{t.description}</div>}
              </div>
              <Badge variant={t.priority === "high" ? "destructive" : t.priority === "low" ? "secondary" : "default"} className="capitalize">{t.priority}</Badge>
              {t.due_date && <span className="text-xs text-muted-foreground hidden md:inline">{t.due_date}</span>}
              <Button size="icon" variant="ghost" onClick={() => deleteTask(t.id)}><Trash2 className="w-4 h-4" /></Button>
            </div>
          ))}
        </div>
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