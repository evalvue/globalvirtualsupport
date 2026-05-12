import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";
import CrudTable from "@/components/admin/CrudTable";

type Dept = { id: string; name: string; description: string | null };

const Departments = () => {
  const [rows, setRows] = useState<Dept[]>([]);
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ name: "", description: "" });

  const load = async () => {
    const { data } = await supabase.from("departments").select("*").order("name");
    setRows((data as Dept[]) || []);
  };
  useEffect(() => { load(); }, []);

  const save = async () => {
    if (!form.name) return toast.error("Name required.");
    const { error } = await supabase.from("departments").insert({ name: form.name, description: form.description || null });
    if (error) return toast.error(error.message);
    toast.success("Saved");
    setOpen(false); setForm({ name: "", description: "" }); load();
  };
  const remove = async (id: string) => {
    if (!confirm("Delete?")) return;
    await supabase.from("departments").delete().eq("id", id);
    load();
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold">Departments</h1>
          <p className="text-muted-foreground">Organize your company structure.</p>
        </div>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild><Button className="bg-gradient-primary text-primary-foreground border-0"><Plus className="w-4 h-4 mr-2" />Add department</Button></DialogTrigger>
          <DialogContent>
            <DialogHeader><DialogTitle>New department</DialogTitle></DialogHeader>
            <div className="space-y-4">
              <div><Label>Name</Label><Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} /></div>
              <div><Label>Description</Label><Input value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} /></div>
              <Button onClick={save} className="w-full bg-gradient-primary text-primary-foreground border-0">Save</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
      <CrudTable
        rows={rows}
        columns={[
          { header: "Name", render: (r) => <span className="font-medium">{r.name}</span> },
          { header: "Description", render: (r) => r.description || "—" },
          { header: "", className: "w-12 text-right", render: (r) => <Button size="icon" variant="ghost" onClick={() => remove(r.id)}><Trash2 className="w-4 h-4 text-destructive" /></Button> },
        ]}
      />
    </div>
  );
};

export default Departments;