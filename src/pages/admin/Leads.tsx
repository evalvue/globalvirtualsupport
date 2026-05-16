import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import CrudTable from "@/components/admin/CrudTable";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "@/hooks/use-toast";
import { Trash2, Mail, Phone } from "lucide-react";

type Lead = {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  company: string | null;
  service_category: string | null;
  budget: string | null;
  message: string | null;
  source_page: string | null;
  status: string;
  created_at: string;
};

const STATUSES = ["new", "contacted", "qualified", "won", "lost"];

const AdminLeads = () => {
  const [rows, setRows] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    setLoading(true);
    const { data, error } = await supabase.from("leads").select("*").order("created_at", { ascending: false });
    if (error) toast({ title: "Failed to load", description: error.message, variant: "destructive" });
    setRows((data as Lead[]) ?? []);
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const updateStatus = async (id: string, status: string) => {
    const { error } = await supabase.from("leads").update({ status }).eq("id", id);
    if (error) return toast({ title: "Update failed", description: error.message, variant: "destructive" });
    setRows((r) => r.map((x) => (x.id === id ? { ...x, status } : x)));
  };

  const remove = async (id: string) => {
    if (!confirm("Delete this lead?")) return;
    const { error } = await supabase.from("leads").delete().eq("id", id);
    if (error) return toast({ title: "Delete failed", description: error.message, variant: "destructive" });
    setRows((r) => r.filter((x) => x.id !== id));
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold">Leads</h1>
          <p className="text-muted-foreground text-sm">All inquiries from the Software Development pages.</p>
        </div>
        <Button variant="outline" onClick={load} disabled={loading}>Refresh</Button>
      </div>

      <CrudTable<Lead>
        rows={rows}
        empty={loading ? "Loading..." : "No leads yet."}
        columns={[
          {
            header: "Contact",
            render: (r) => (
              <div className="min-w-[200px]">
                <div className="font-medium">{r.name}</div>
                {r.company && <div className="text-xs text-muted-foreground">{r.company}</div>}
                <a href={`mailto:${r.email}`} className="text-xs text-primary flex items-center gap-1 mt-1"><Mail className="w-3 h-3" />{r.email}</a>
                {r.phone && <a href={`tel:${r.phone}`} className="text-xs text-primary flex items-center gap-1"><Phone className="w-3 h-3" />{r.phone}</a>}
              </div>
            ),
          },
          { header: "Service", render: (r) => <span className="text-sm">{r.service_category ?? "—"}</span> },
          { header: "Budget", render: (r) => <span className="text-sm">{r.budget ?? "—"}</span> },
          {
            header: "Message",
            render: (r) => <div className="text-sm text-muted-foreground max-w-xs whitespace-pre-wrap">{r.message}</div>,
          },
          { header: "Source", render: (r) => <span className="text-xs text-muted-foreground">{r.source_page ?? "—"}</span> },
          {
            header: "Date",
            render: (r) => <span className="text-xs text-muted-foreground">{new Date(r.created_at).toLocaleString()}</span>,
          },
          {
            header: "Status",
            render: (r) => (
              <Select value={r.status} onValueChange={(v) => updateStatus(r.id, v)}>
                <SelectTrigger className="h-8 w-32"><SelectValue /></SelectTrigger>
                <SelectContent>
                  {STATUSES.map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}
                </SelectContent>
              </Select>
            ),
          },
          {
            header: "",
            render: (r) => (
              <Button size="icon" variant="ghost" onClick={() => remove(r.id)}>
                <Trash2 className="w-4 h-4 text-destructive" />
              </Button>
            ),
          },
        ]}
      />
    </div>
  );
};

export default AdminLeads;