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

type Candidate = {
  id: string;
  name: string;
  mobile: string;
  email: string | null;
  position: string | null;
  status: string;
  joining_date: string | null;
  notes: string | null;
};

const empty: Omit<Candidate, "id"> = { name: "", mobile: "", email: "", position: "", status: "pending", joining_date: null, notes: "" };

const Candidates = () => {
  const [rows, setRows] = useState<Candidate[]>([]);
  const [open, setOpen] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [form, setForm] = useState<Omit<Candidate, "id">>(empty);

  const load = async () => {
    const { data } = await supabase.from("candidates").select("*").order("created_at", { ascending: false });
    setRows((data as Candidate[]) || []);
  };
  useEffect(() => { load(); }, []);

  const startEdit = (c: Candidate) => {
    setEditId(c.id);
    setForm({ name: c.name, mobile: c.mobile, email: c.email || "", position: c.position || "", status: c.status, joining_date: c.joining_date, notes: c.notes || "" });
    setOpen(true);
  };
  const startNew = () => { setEditId(null); setForm(empty); setOpen(true); };

  const save = async () => {
    if (!form.name || !form.mobile) return toast.error("Name and mobile are required.");
    const payload = { ...form, joining_date: form.joining_date || null, email: form.email || null };
    const { error } = editId
      ? await supabase.from("candidates").update(payload).eq("id", editId)
      : await supabase.from("candidates").insert(payload);
    if (error) return toast.error(error.message);
    toast.success("Saved");
    setOpen(false);
    load();
  };

  const remove = async (id: string) => {
    if (!confirm("Delete this candidate?")) return;
    const { error } = await supabase.from("candidates").delete().eq("id", id);
    if (error) return toast.error(error.message);
    load();
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold">Candidates</h1>
          <p className="text-muted-foreground">Manage applicants and their interview status.</p>
        </div>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button onClick={startNew} className="bg-gradient-primary text-primary-foreground border-0"><Plus className="w-4 h-4 mr-2" />Add candidate</Button>
          </DialogTrigger>
          <DialogContent className="max-w-lg">
            <DialogHeader><DialogTitle>{editId ? "Edit candidate" : "New candidate"}</DialogTitle></DialogHeader>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div><Label>Name *</Label><Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} /></div>
                <div><Label>Mobile *</Label><Input value={form.mobile} onChange={(e) => setForm({ ...form, mobile: e.target.value })} /></div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div><Label>Email</Label><Input type="email" value={form.email || ""} onChange={(e) => setForm({ ...form, email: e.target.value })} /></div>
                <div><Label>Position</Label><Input value={form.position || ""} onChange={(e) => setForm({ ...form, position: e.target.value })} /></div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label>Status</Label>
                  <Select value={form.status} onValueChange={(v) => setForm({ ...form, status: v })}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="pass">Pass</SelectItem>
                      <SelectItem value="fail">Fail</SelectItem>
                      <SelectItem value="hired">Hired</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div><Label>Joining date</Label><Input type="date" value={form.joining_date || ""} onChange={(e) => setForm({ ...form, joining_date: e.target.value })} /></div>
              </div>
              <div><Label>Notes</Label><Textarea rows={3} value={form.notes || ""} onChange={(e) => setForm({ ...form, notes: e.target.value })} /></div>
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
          { header: "Position", render: (r) => r.position || "—" },
          { header: "Status", render: (r) => <span className={`px-2 py-0.5 rounded-full text-xs border ${
            r.status === "pass" || r.status === "hired" ? "border-primary/40 text-primary bg-primary/10" :
            r.status === "fail" ? "border-destructive/40 text-destructive bg-destructive/10" :
            "border-border text-muted-foreground"
          }`}>{r.status}</span> },
          { header: "Joining", render: (r) => r.joining_date || "—" },
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

export default Candidates;