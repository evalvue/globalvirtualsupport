import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Cake, Trophy } from "lucide-react";

type Emp = { id: string; name: string; avatar_url: string | null; dob: string | null; department: string | null };
type Ach = { id: string; month: string; title: string; description: string | null; employee_id: string };

const monthName = (m: number) => ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"][m];

const EmployeeTeam = () => {
  const [emps, setEmps] = useState<Emp[]>([]);
  const [achievements, setAchievements] = useState<(Ach & { employee?: Emp })[]>([]);

  useEffect(() => {
    (async () => {
      const { data: e } = await supabase.from("employees").select("id,name,avatar_url,dob,department").eq("active", true).order("name");
      const list = (e as Emp[]) || [];
      setEmps(list);
      const { data: a } = await supabase.from("achievements").select("*").order("month", { ascending: false }).limit(12);
      const byId = Object.fromEntries(list.map((x) => [x.id, x]));
      setAchievements(((a as Ach[]) || []).map((x) => ({ ...x, employee: byId[x.employee_id] })));
    })();
  }, []);

  const today = new Date();
  const thisMonth = today.getMonth();
  const todayKey = `${String(today.getMonth() + 1).padStart(2, "0")}-${String(today.getDate()).padStart(2, "0")}`;

  const upcoming = emps
    .filter((e) => e.dob)
    .map((e) => ({ ...e, mmdd: e.dob!.slice(5) }))
    .filter((e) => Number(e.mmdd.slice(0, 2)) - 1 === thisMonth)
    .sort((a, b) => a.mmdd.localeCompare(b.mmdd));

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Team</h1>
        <p className="text-muted-foreground">Birthdays & best achievers across the team.</p>
      </div>

      <div className="glass rounded-xl p-5 border border-border">
        <div className="flex items-center gap-2 mb-3"><Cake className="w-5 h-5 text-primary" /><h2 className="font-semibold">Birthdays this month — {monthName(thisMonth)}</h2></div>
        {upcoming.length === 0 && <div className="text-sm text-muted-foreground">No birthdays this month.</div>}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {upcoming.map((e) => (
            <div key={e.id} className={`rounded-lg p-3 border ${e.mmdd === todayKey ? "border-primary bg-primary/10" : "border-border bg-muted/30"}`}>
              <div className="flex items-center gap-2">
                <div className="w-10 h-10 rounded-full bg-muted overflow-hidden flex items-center justify-center font-bold">
                  {e.avatar_url ? <img src={e.avatar_url} alt={e.name} className="w-full h-full object-cover" /> : e.name[0]}
                </div>
                <div>
                  <div className="font-medium text-sm">{e.name}</div>
                  <div className="text-xs text-muted-foreground">{monthName(Number(e.mmdd.slice(0,2))-1)} {Number(e.mmdd.slice(3))}{e.mmdd === todayKey ? " 🎉" : ""}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="glass rounded-xl p-5 border border-border">
        <div className="flex items-center gap-2 mb-3"><Trophy className="w-5 h-5 text-primary" /><h2 className="font-semibold">Best Achievers</h2></div>
        {achievements.length === 0 && <div className="text-sm text-muted-foreground">No achievements yet.</div>}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {achievements.map((a) => (
            <div key={a.id} className="rounded-lg p-4 border border-border bg-muted/30">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-muted overflow-hidden flex items-center justify-center font-bold">
                  {a.employee?.avatar_url ? <img src={a.employee.avatar_url} alt="" className="w-full h-full object-cover" /> : a.employee?.name[0] ?? "?"}
                </div>
                <div>
                  <div className="font-semibold">{a.employee?.name ?? "Unknown"}</div>
                  <div className="text-xs text-muted-foreground">{a.title} · {a.month.slice(0, 7)}</div>
                </div>
              </div>
              {a.description && <div className="text-sm text-muted-foreground mt-2">{a.description}</div>}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default EmployeeTeam;