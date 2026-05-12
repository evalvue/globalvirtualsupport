import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";

type Ann = { id: string; title: string; body: string; posted_at: string };

const Announcements = () => {
  const [rows, setRows] = useState<Ann[]>([]);
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ title: "", body: "" });

  const load = async () => {
    const { data } = await supabase.from("announcements").select("*").order("posted_at", { ascending: false });
    setRows((data as Ann[]) || []);
  };
  useEffect(() => { load(); }, []);

  const save = async () => {
    if (!form.title || !form.body) return toast.error("Title and body required.");
    const { error } = await supabase.from("announcements").insert(form);
    if (error) return toast.error(error.message);
    toast.success("Announcement posted");
    setOpen(false); setForm({ title: "", body: "" }); load();
  };

  const remove = async (id: string) => {
    if (!confirm("Delete?")) return;
    await supabase.from("announcements").delete().eq("id", id);
    load();
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold">Announcements</h1>
          <p className="text-muted-foreground">Post company-wide notices.</p>
        </div>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild><Button className="bg-gradient-primary text-primary-foreground border-0"><Plus className="w-4 h-4 mr-2" />New post</Button></DialogTrigger>
          <DialogContent>
            <DialogHeader><DialogTitle>New announcement</DialogTitle></DialogHeader>
            <div className="space-y-4">
              <div><Label>Title</Label><Input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} /></div>
              <div><Label>Body</Label><Textarea rows={5} value={form.body} onChange={(e) => setForm({ ...form, body: e.target.value })} /></div>
              <Button onClick={save} className="w-full bg-gradient-primary text-primary-foreground border-0">Post</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
      {rows.length === 0 ? <div className="text-muted-foreground text-sm">No announcements yet.</div> : (
        <div className="space-y-3">
          {rows.map((a) => (
            <article key={a.id} className="glass rounded-2xl p-5">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h3 className="font-semibold text-lg">{a.title}</h3>
                  <div className="text-xs text-muted-foreground mb-2">{new Date(a.posted_at).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}</div>
                  <p className="text-sm text-foreground/85 whitespace-pre-wrap">{a.body}</p>
                </div>
                <Button size="icon" variant="ghost" onClick={() => remove(a.id)}><Trash2 className="w-4 h-4 text-destructive" /></Button>
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
};

export default Announcements;