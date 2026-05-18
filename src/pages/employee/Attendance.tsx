import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useEmployeeAuth } from "@/hooks/useEmployeeAuth";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

type Row = { id: string; date: string; status: string; notes: string | null };

const EmployeeAttendance = () => {
  const { employee } = useEmployeeAuth();
  const [rows, setRows] = useState<Row[]>([]);
  const [status, setStatus] = useState("present");
  const [notes, setNotes] = useState("");

  const load = async () => {
    if (!employee) return;
    const { data } = await supabase
      .from("attendance")
      .select("id,date,status,notes")
      .eq("employee_id", employee.id)
      .order("date", { ascending: false })
      .limit(60);
    setRows((data as Row[]) || []);
  };
  useEffect(() => { load(); }, [employee?.id]);

  const mark = async () => {
    if (!employee) return;
    const today = new Date().toISOString().slice(0, 10);
    if (rows.some((r) => r.date === today)) return toast.error("Already marked for today.");
    const { error } = await supabase
      .from("attendance")
      .insert({ employee_id: employee.id, date: today, status, notes: notes || null });
    if (error) return toast.error(error.message);
    toast.success("Marked");
    setNotes("");
    load();
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">My Attendance</h1>
        <p className="text-muted-foreground">Mark today's status. Admin can override.</p>
      </div>
      <div className="glass rounded-xl p-5 border border-border flex flex-wrap gap-3 items-end">
        <div className="flex-1 min-w-[140px]">
          <div className="text-xs text-muted-foreground mb-1">Status</div>
          <Select value={status} onValueChange={setStatus}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="present">Present</SelectItem>
              <SelectItem value="absent">Absent</SelectItem>
              <SelectItem value="half_day">Half day</SelectItem>
              <SelectItem value="leave">Leave</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="flex-[2] min-w-[200px]">
          <div className="text-xs text-muted-foreground mb-1">Notes (optional)</div>
          <Input value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="e.g. WFH" />
        </div>
        <Button onClick={mark} className="bg-gradient-primary text-primary-foreground border-0">Mark today</Button>
      </div>

      <div className="glass rounded-xl border border-border overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow><TableHead>Date</TableHead><TableHead>Status</TableHead><TableHead>Notes</TableHead></TableRow>
          </TableHeader>
          <TableBody>
            {rows.map((r) => (
              <TableRow key={r.id}>
                <TableCell>{r.date}</TableCell>
                <TableCell className="capitalize">{r.status.replace("_", " ")}</TableCell>
                <TableCell className="text-muted-foreground">{r.notes || "—"}</TableCell>
              </TableRow>
            ))}
            {rows.length === 0 && (
              <TableRow><TableCell colSpan={3} className="text-center text-muted-foreground">No records yet.</TableCell></TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default EmployeeAttendance;