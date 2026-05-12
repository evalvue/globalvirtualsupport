import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";
import CrudTable from "@/components/admin/CrudTable";

type Holiday = { id: string; date: string; name: string; notes: string | null };

const Holidays = () => {
  const [rows, setRows] = useState<Holiday[]>([]);
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ date: "", name: "", notes: "" });

  const load = async () => {
    const { data } = await supabase.from("holidays").select("*").order("date");
    setRows((data as Holiday[]) || []);
  };
  useEffect(() => { load(); }, []);

  const save = async () => {
    if (!form.date || !form.name) return toast.error("Date and name required.");
    const { error } = await supabase.from("holidays").insert({ ...form, notes: form.notes || null });
    if (error) return toast.error(error.message);
    toast.success("Holiday added");
    setOpen(false); setForm({ date: "", name: "", notes: "" }); load();
  };

  const remove = async (id: string) => {
    if (!confirm("Delete?")) return;
    await supabase.from("holidays").delete().eq("id", id);
    load();
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold">Holidays</h1>
          <p className="text-muted-foreground">Company holiday calendar.</p>
        </div>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild><Button className="bg-gradient-primary text-primary-foreground border-0"><Plus className="w-4 h-4 mr-2" />Add holiday</Button></DialogTrigger>
          <DialogContent>
            <DialogHeader><DialogTitle>New holiday</DialogTitle></DialogHeader>
            <div className="space-y-4">
              <div><Label>Date</Label><Input type="date" value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} /></div>
              <div><Label>Name</Label><Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Diwali" /></div>
              <div><Label>Notes</Label><Input value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} /></div>
              <Button onClick={save} className="w-full bg-gradient-primary text-primary-foreground border-0">Save</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
      <CrudTable
        rows={rows}
        columns={[
          { header: "Date", render: (r) => new Date(r.date).toLocaleDateString("en-IN", { weekday: "short", day: "numeric", month: "short", year: "numeric" }) },
          { header: "Name", render: (r) => <span className="font-medium">{r.name}</span> },
          { header: "Notes", render: (r) => r.notes || "—" },
          { header: "", className: "w-12 text-right", render: (r) => <Button size="icon" variant="ghost" onClick={() => remove(r.id)}><Trash2 className="w-4 h-4 text-destructive" /></Button> },
        ]}
      />
    </div>
  );
};

export default Holidays;