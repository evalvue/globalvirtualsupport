import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useEmployeeAuth } from "@/hooks/useEmployeeAuth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

type Row = { id: string; leave_type: string; from_date: string; to_date: string; days: number; reason: string | null; status: string };

const EmployeeLeave = () => {
  const { employee } = useEmployeeAuth();
  const [rows, setRows] = useState<Row[]>([]);
  const [type, setType] = useState("casual");
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [reason, setReason] = useState("");

  const load = async () => {
    if (!employee) return;
    const { data } = await supabase
      .from("leaves")
      .select("id,leave_type,from_date,to_date,days,reason,status")
      .eq("employee_id", employee.id)
      .order("created_at", { ascending: false });
    setRows((data as Row[]) || []);
  };
  useEffect(() => { load(); }, [employee?.id]);

  const submit = async () => {
    if (!employee || !from || !to) return toast.error("From & to dates required");
    const days = Math.max(1, Math.round((new Date(to).getTime() - new Date(from).getTime()) / 86400000) + 1);
    const { error } = await supabase.from("leaves").insert({
      employee_id: employee.id, leave_type: type, from_date: from, to_date: to, days, reason, status: "pending",
    });
    if (error) return toast.error(error.message);
    toast.success("Leave request submitted");
    setFrom(""); setTo(""); setReason("");
    load();
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Leave Requests</h1>
        <p className="text-muted-foreground">Apply for casual, sick, paid, unpaid or advance leave.</p>
      </div>
      <div className="glass rounded-xl p-5 border border-border space-y-3">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
          <div>
            <Label>Type</Label>
            <Select value={type} onValueChange={setType}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="casual">Casual</SelectItem>
                <SelectItem value="sick">Sick</SelectItem>
                <SelectItem value="paid">Paid</SelectItem>
                <SelectItem value="unpaid">Unpaid</SelectItem>
                <SelectItem value="advance">Advance</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div><Label>From</Label><Input type="date" value={from} onChange={(e) => setFrom(e.target.value)} /></div>
          <div><Label>To</Label><Input type="date" value={to} onChange={(e) => setTo(e.target.value)} /></div>
          <div className="flex items-end"><Button onClick={submit} className="w-full bg-gradient-primary text-primary-foreground border-0">Submit</Button></div>
        </div>
        <div><Label>Reason</Label><Textarea value={reason} onChange={(e) => setReason(e.target.value)} placeholder="Reason for leave..." /></div>
      </div>

      <div className="glass rounded-xl border border-border overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow><TableHead>Type</TableHead><TableHead>From</TableHead><TableHead>To</TableHead><TableHead>Days</TableHead><TableHead>Reason</TableHead><TableHead>Status</TableHead></TableRow>
          </TableHeader>
          <TableBody>
            {rows.map((r) => (
              <TableRow key={r.id}>
                <TableCell className="capitalize">{r.leave_type}</TableCell>
                <TableCell>{r.from_date}</TableCell>
                <TableCell>{r.to_date}</TableCell>
                <TableCell>{r.days}</TableCell>
                <TableCell className="text-muted-foreground max-w-xs truncate">{r.reason || "—"}</TableCell>
                <TableCell><span className={`px-2 py-0.5 rounded-full text-xs ${r.status === "approved" ? "bg-green-500/15 text-green-500" : r.status === "rejected" ? "bg-destructive/15 text-destructive" : "bg-yellow-500/15 text-yellow-500"}`}>{r.status}</span></TableCell>
              </TableRow>
            ))}
            {rows.length === 0 && (<TableRow><TableCell colSpan={6} className="text-center text-muted-foreground">No requests yet.</TableCell></TableRow>)}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default EmployeeLeave;