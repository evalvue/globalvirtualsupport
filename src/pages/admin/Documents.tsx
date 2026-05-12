import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, Trash2, ExternalLink } from "lucide-react";
import { toast } from "sonner";
import CrudTable from "@/components/admin/CrudTable";

type Doc = { id: string; employee_id: string; doc_type: string; doc_url: string | null; notes: string | null };
type Employee = { id: string; name: string };

const empty = { employee_id: "", doc_type: "Offer Letter", doc_url: "", notes: "" };

const Documents = () => {
  const [rows, setRows] = useState<(Doc & { employee_name: string })[]>([]);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState(empty);

  const load = async () => {
    const [d, e] = await Promise.all([
      supabase.from("employee_documents").select("*").order("created_at", { ascending: false }),
      supabase.from("employees").select("id,name").order("name"),
    ]);
    const emps = (e.data as Employee[]) || [];
    setEmployees(emps);
    const map = new Map(emps.map((x) => [x.id, x.name]));
    setRows(((d.data as Doc[]) || []).map((r) => ({ ...r, employee_name: map.get(r.employee_id) || "—" })));
  };
  useEffect(() => { load(); }, []);

  const save = async () => {
    if (!form.employee_id || !form.doc_type) return toast.error("Employee and type required.");
    const { error } = await supabase.from("employee_documents").insert({ ...form, doc_url: form.doc_url || null, notes: form.notes || null });
    if (error) return toast.error(error.message);
    toast.success("Saved");
    setOpen(false); setForm(empty); load();
  };

  const remove = async (id: string) => {
    if (!confirm("Delete?")) return;
    await supabase.from("employee_documents").delete().eq("id", id);
    load();
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold">Documents</h1>
          <p className="text-muted-foreground">Store employee documents (offer letters, IDs, contracts).</p>
        </div>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild><Button className="bg-gradient-primary text-primary-foreground border-0"><Plus className="w-4 h-4 mr-2" />Add document</Button></DialogTrigger>
          <DialogContent>
            <DialogHeader><DialogTitle>New document</DialogTitle></DialogHeader>
            <div className="space-y-4">
              <div>
                <Label>Employee</Label>
                <Select value={form.employee_id} onValueChange={(v) => setForm({ ...form, employee_id: v })}>
                  <SelectTrigger><SelectValue placeholder="Pick employee" /></SelectTrigger>
                  <SelectContent>{employees.map((e) => <SelectItem key={e.id} value={e.id}>{e.name}</SelectItem>)}</SelectContent>
                </Select>
              </div>
              <div>
                <Label>Type</Label>
                <Select value={form.doc_type} onValueChange={(v) => setForm({ ...form, doc_type: v })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Offer Letter">Offer Letter</SelectItem>
                    <SelectItem value="Aadhaar">Aadhaar</SelectItem>
                    <SelectItem value="PAN">PAN</SelectItem>
                    <SelectItem value="Resume">Resume</SelectItem>
                    <SelectItem value="Contract">Contract</SelectItem>
                    <SelectItem value="Bank Details">Bank Details</SelectItem>
                    <SelectItem value="Other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div><Label>Link / URL</Label><Input value={form.doc_url} onChange={(e) => setForm({ ...form, doc_url: e.target.value })} placeholder="https://..." /></div>
              <div><Label>Notes</Label><Input value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} /></div>
              <Button onClick={save} className="w-full bg-gradient-primary text-primary-foreground border-0">Save</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
      <CrudTable
        rows={rows}
        columns={[
          { header: "Employee", render: (r) => <span className="font-medium">{r.employee_name}</span> },
          { header: "Type", render: (r) => r.doc_type },
          { header: "Link", render: (r) => r.doc_url ? <a href={r.doc_url} target="_blank" rel="noreferrer" className="text-primary inline-flex items-center gap-1 hover:underline">Open <ExternalLink className="w-3 h-3" /></a> : "—" },
          { header: "Notes", render: (r) => r.notes || "—" },
          { header: "", className: "w-12 text-right", render: (r) => <Button size="icon" variant="ghost" onClick={() => remove(r.id)}><Trash2 className="w-4 h-4 text-destructive" /></Button> },
        ]}
      />
    </div>
  );
};

export default Documents;