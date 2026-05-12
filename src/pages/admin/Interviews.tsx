import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, Pencil, Trash2 } from "lucide-react";
import { toast } from "sonner";
import CrudTable from "@/components/admin/CrudTable";

type Interview = {
  id: string;
  candidate_id: string | null;
  candidate_name: string;
  scheduled_at: string;
  interviewer: string | null;
  mode: string | null;
  result: string;
  notes: string | null;
};

type Candidate = { id: string; name: string };

const empty = { candidate_id: "", candidate_name: "", scheduled_at: "", interviewer: "", mode: "online", result: "scheduled", notes: "" };

const Interviews = () => {
  const [rows, setRows] = useState<Interview[]>([]);
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [open, setOpen] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [form, setForm] = useState(empty);

  const load = async () => {
    const [i, c] = await Promise.all([
      supabase.from("interviews").select("*").order("scheduled_at", { ascending: false }),
      supabase.from("candidates").select("id,name").order("name"),
    ]);
    setRows((i.data as Interview[]) || []);
    setCandidates((c.data as Candidate[]) || []);
  };
  useEffect(() => { load(); }, []);

  const startNew = () => { setEditId(null); setForm(empty); setOpen(true); };
  const startEdit = (r: Interview) => {
    setEditId(r.id);
    setForm({
      candidate_id: r.candidate_id || "",
      candidate_name: r.candidate_name,
      scheduled_at: r.scheduled_at.slice(0, 16),
      interviewer: r.interviewer || "",
      mode: r.mode || "online",
      result: r.result,
      notes: r.notes || "",
    });
    setOpen(true);
  };

  const save = async () => {
    if (!form.candidate_name || !form.scheduled_at) return toast.error("Candidate and date are required.");
    const payload = {
      candidate_id: form.candidate_id || null,
      candidate_name: form.candidate_name,
      scheduled_at: new Date(form.scheduled_at).toISOString(),
      interviewer: form.interviewer || null,
      mode: form.mode,
      result: form.result,
      notes: form.notes || null,
    };
    const { error } = editId
      ? await supabase.from("interviews").update(payload).eq("id", editId)
      : await supabase.from("interviews").insert(payload);
    if (error) return toast.error(error.message);
    toast.success("Saved");
    setOpen(false);
    load();
  };

  const remove = async (id: string) => {
    if (!confirm("Delete this interview?")) return;
    await supabase.from("interviews").delete().eq("id", id);
    load();
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold">Interviews</h1>
          <p className="text-muted-foreground">Schedule and track candidate interviews.</p>
        </div>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button onClick={startNew} className="bg-gradient-primary text-primary-foreground border-0"><Plus className="w-4 h-4 mr-2" />Schedule</Button>
          </DialogTrigger>
          <DialogContent className="max-w-lg">
            <DialogHeader><DialogTitle>{editId ? "Edit interview" : "Schedule interview"}</DialogTitle></DialogHeader>
            <div className="space-y-4">
              <div>
                <Label>Candidate</Label>
                <Select
                  value={form.candidate_id || "_custom"}
                  onValueChange={(v) => {
                    if (v === "_custom") setForm({ ...form, candidate_id: "" });
                    else {
                      const c = candidates.find((x) => x.id === v);
                      setForm({ ...form, candidate_id: v, candidate_name: c?.name || form.candidate_name });
                    }
                  }}
                >
                  <SelectTrigger><SelectValue placeholder="Pick candidate" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="_custom">— Type name manually —</SelectItem>
                    {candidates.map((c) => <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div><Label>Candidate name *</Label><Input value={form.candidate_name} onChange={(e) => setForm({ ...form, candidate_name: e.target.value })} /></div>
              <div className="grid grid-cols-2 gap-3">
                <div><Label>Date & time *</Label><Input type="datetime-local" value={form.scheduled_at} onChange={(e) => setForm({ ...form, scheduled_at: e.target.value })} /></div>
                <div><Label>Interviewer</Label><Input value={form.interviewer} onChange={(e) => setForm({ ...form, interviewer: e.target.value })} /></div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div><Label>Mode</Label>
                  <Select value={form.mode} onValueChange={(v) => setForm({ ...form, mode: v })}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="online">Online</SelectItem>
                      <SelectItem value="in-person">In-person</SelectItem>
                      <SelectItem value="phone">Phone</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div><Label>Result</Label>
                  <Select value={form.result} onValueChange={(v) => setForm({ ...form, result: v })}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="scheduled">Scheduled</SelectItem>
                      <SelectItem value="pass">Pass</SelectItem>
                      <SelectItem value="fail">Fail</SelectItem>
                      <SelectItem value="no-show">No-show</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div><Label>Notes</Label><Textarea rows={3} value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} /></div>
              <Button onClick={save} className="w-full bg-gradient-primary text-primary-foreground border-0">Save</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <CrudTable
        rows={rows}
        columns={[
          { header: "Candidate", render: (r) => <span className="font-medium">{r.candidate_name}</span> },
          { header: "When", render: (r) => new Date(r.scheduled_at).toLocaleString() },
          { header: "Interviewer", render: (r) => r.interviewer || "—" },
          { header: "Mode", render: (r) => r.mode || "—" },
          { header: "Result", render: (r) => <span className={`px-2 py-0.5 rounded-full text-xs border ${
            r.result === "pass" ? "border-primary/40 text-primary bg-primary/10" :
            r.result === "fail" || r.result === "no-show" ? "border-destructive/40 text-destructive bg-destructive/10" :
            "border-border text-muted-foreground"
          }`}>{r.result}</span> },
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

export default Interviews;