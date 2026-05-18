import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import CrudTable from "@/components/admin/CrudTable";
import { Trash2 } from "lucide-react";

type Emp = { id: string; name: string };
type Row = { id: string; employee_id: string; month: string; title: string; description: string | null };

const Achievements = () => {
  const [rows, setRows] = useState<(Row & { employee_name?: string })[]>([]);
  const [emps, setEmps] = useState<Emp[]>([]);
  const [employee_id, setEmpId] = useState("");
  const [month, setMonth] = useState(new Date().toISOString().slice(0, 7) + "-01");
  const [title, setTitle] = useState("Best Achiever");
  const [description, setDescription] = useState("");

  const load = async () => {
    const { data: e } = await supabase.from("employees").select("id,name").order("name");
    setEmps((e as Emp[]) || []);
    const { data } = await supabase.from("achievements").select("*").order("month", { ascending: false });
    const byId = Object.fromEntries(((e as Emp[]) || []).map((x) => [x.id, x.name]));
    setRows(((data as Row[]) || []).map((r) => ({ ...r, employee_name: byId[r.employee_id] })));
  };
  useEffect(() => { load(); }, []);

  const add = async () => {
    if (!employee_id || !month) return toast.error("Employee & month required");
    const { error } = await supabase.from("achievements").insert({ employee_id, month, title, description: description || null });
    if (error) return toast.error(error.message);
    toast.success("Saved");
    setDescription("");
    load();
  };

  const remove = async (id: string) => {
    if (!confirm("Delete this achievement?")) return;
    await supabase.from("achievements").delete().eq("id", id);
    load();
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Best Achievers</h1>
        <p className="text-muted-foreground">Highlight top employees each month — shown across all CRM dashboards.</p>
      </div>
      <div className="glass rounded-xl p-5 border border-border space-y-3">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <div>
            <Label>Employee</Label>
            <Select value={employee_id} onValueChange={setEmpId}>
              <SelectTrigger><SelectValue placeholder="Select employee" /></SelectTrigger>
              <SelectContent>{emps.map((e) => <SelectItem key={e.id} value={e.id}>{e.name}</SelectItem>)}</SelectContent>
            </Select>
          </div>
          <div><Label>Month</Label><Input type="month" value={month.slice(0, 7)} onChange={(e) => setMonth(e.target.value + "-01")} /></div>
          <div><Label>Title</Label><Input value={title} onChange={(e) => setTitle(e.target.value)} /></div>
        </div>
        <div><Label>Description</Label><Textarea value={description} onChange={(e) => setDescription(e.target.value)} placeholder="What did they do?" /></div>
        <Button onClick={add} className="bg-gradient-primary text-primary-foreground border-0">Add achievement</Button>
      </div>

      <CrudTable
        rows={rows}
        columns={[
          { header: "Employee", render: (r) => <span className="font-medium">{r.employee_name || "—"}</span> },
          { header: "Month", render: (r) => r.month.slice(0, 7) },
          { header: "Title", render: (r) => r.title },
          { header: "Description", render: (r) => <span className="text-muted-foreground">{r.description || "—"}</span> },
          { header: "", className: "w-16 text-right", render: (r) => (
            <Button size="icon" variant="ghost" onClick={() => remove(r.id)}><Trash2 className="w-4 h-4 text-destructive" /></Button>
          )},
        ]}
      />
    </div>
  );
};

export default Achievements;