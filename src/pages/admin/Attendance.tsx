import { useEffect, useMemo, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

type Employee = { id: string; name: string };
type AttRow = { employee_id: string; status: string };

const STATUSES = ["present", "absent", "half-day", "leave"] as const;

const Attendance = () => {
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10));
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [marks, setMarks] = useState<Record<string, string>>({});
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    supabase.from("employees").select("id,name").eq("active", true).order("name").then(({ data }) => {
      setEmployees((data as Employee[]) || []);
    });
  }, []);

  useEffect(() => {
    supabase.from("attendance").select("employee_id,status").eq("date", date).then(({ data }) => {
      const m: Record<string, string> = {};
      (data as AttRow[] || []).forEach((r) => { m[r.employee_id] = r.status; });
      setMarks(m);
    });
  }, [date]);

  const setStatus = (id: string, status: string) => setMarks({ ...marks, [id]: status });

  const save = async () => {
    setSaving(true);
    const records = Object.entries(marks).map(([employee_id, status]) => ({ employee_id, status, date }));
    if (!records.length) { setSaving(false); return; }
    const { error } = await supabase.from("attendance").upsert(records, { onConflict: "employee_id,date" });
    setSaving(false);
    if (error) toast.error(error.message); else toast.success("Attendance saved");
  };

  const summary = useMemo(() => {
    const counts: Record<string, number> = { present: 0, absent: 0, "half-day": 0, leave: 0 };
    Object.values(marks).forEach((s) => { counts[s] = (counts[s] || 0) + 1; });
    return counts;
  }, [marks]);

  return (
    <div>
      <h1 className="text-3xl font-bold mb-2">Attendance</h1>
      <p className="text-muted-foreground mb-6">Mark daily attendance for active employees.</p>

      <div className="flex flex-wrap items-end gap-4 mb-6">
        <div>
          <Label>Date</Label>
          <Input type="date" value={date} onChange={(e) => setDate(e.target.value)} className="w-48" />
        </div>
        <div className="flex-1 flex gap-3 text-sm">
          {STATUSES.map((s) => (
            <span key={s} className="px-3 py-1 rounded-full glass">
              <span className="capitalize text-muted-foreground">{s}:</span> <strong className="text-foreground">{summary[s] || 0}</strong>
            </span>
          ))}
        </div>
        <Button onClick={save} disabled={saving} className="bg-gradient-primary text-primary-foreground border-0">{saving ? "Saving..." : "Save attendance"}</Button>
      </div>

      {employees.length === 0 ? (
        <div className="text-muted-foreground text-sm">Add employees first.</div>
      ) : (
        <div className="glass rounded-2xl divide-y divide-border">
          {employees.map((e) => (
            <div key={e.id} className="flex items-center justify-between p-4">
              <div className="font-medium">{e.name}</div>
              <div className="flex gap-2">
                {STATUSES.map((s) => (
                  <Button
                    key={s}
                    size="sm"
                    variant={marks[e.id] === s ? "default" : "outline"}
                    className={marks[e.id] === s ? "bg-gradient-primary text-primary-foreground border-0 capitalize" : "capitalize"}
                    onClick={() => setStatus(e.id, s)}
                  >
                    {s}
                  </Button>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Attendance;