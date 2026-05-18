import { useEffect, useMemo, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useEmployeeAuth } from "@/hooks/useEmployeeAuth";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Cake, Coffee, LogIn, LogOut, Trophy, Megaphone } from "lucide-react";

type TimeLog = { id: string; event_type: string; event_at: string };

const fmtDur = (ms: number) => {
  if (ms < 0) ms = 0;
  const h = Math.floor(ms / 3600000);
  const m = Math.floor((ms % 3600000) / 60000);
  return `${h}h ${m}m`;
};

const todayISO = () => new Date().toISOString().slice(0, 10);

const EmployeeDashboard = () => {
  const { employee } = useEmployeeAuth();
  const [logs, setLogs] = useState<TimeLog[]>([]);
  const [tick, setTick] = useState(0);
  const [birthdays, setBirthdays] = useState<{ name: string; avatar_url: string | null }[]>([]);
  const [achiever, setAchiever] = useState<{ name: string; avatar_url: string | null; title: string } | null>(null);
  const [announcements, setAnnouncements] = useState<{ id: string; title: string; body: string; posted_at: string }[]>([]);

  const loadLogs = async () => {
    if (!employee) return;
    const start = new Date(); start.setHours(0, 0, 0, 0);
    const { data } = await supabase
      .from("time_logs")
      .select("id,event_type,event_at")
      .eq("employee_id", employee.id)
      .gte("event_at", start.toISOString())
      .order("event_at");
    setLogs((data as TimeLog[]) || []);
  };

  const loadExtras = async () => {
    const t = new Date();
    const mm = String(t.getMonth() + 1).padStart(2, "0");
    const dd = String(t.getDate()).padStart(2, "0");
    const { data: emps } = await supabase
      .from("employees")
      .select("name,avatar_url,dob")
      .not("dob", "is", null);
    setBirthdays(
      (emps || [])
        .filter((e: any) => e.dob && e.dob.slice(5) === `${mm}-${dd}`)
        .map((e: any) => ({ name: e.name, avatar_url: e.avatar_url })),
    );

    const monthStart = `${t.getFullYear()}-${mm}-01`;
    const { data: ach } = await supabase
      .from("achievements")
      .select("title, employee_id")
      .gte("month", monthStart)
      .order("month", { ascending: false })
      .limit(1);
    if (ach && ach[0]) {
      const { data: emp } = await supabase
        .from("employees")
        .select("name,avatar_url")
        .eq("id", ach[0].employee_id)
        .maybeSingle();
      if (emp) setAchiever({ name: (emp as any).name, avatar_url: (emp as any).avatar_url, title: ach[0].title });
    }

    const { data: anns } = await supabase
      .from("announcements")
      .select("id,title,body,posted_at")
      .order("posted_at", { ascending: false })
      .limit(3);
    setAnnouncements((anns as any) || []);
  };

  useEffect(() => { loadLogs(); loadExtras(); }, [employee?.id]);
  useEffect(() => { const i = setInterval(() => setTick((t) => t + 1), 30000); return () => clearInterval(i); }, []);

  const { onClock, onBreak, workedMs, breakMs } = useMemo(() => {
    let onClock = false, onBreak = false, workedMs = 0, breakMs = 0;
    let lastClockIn: Date | null = null, lastBreakStart: Date | null = null;
    for (const l of logs) {
      const at = new Date(l.event_at);
      if (l.event_type === "clock_in") { onClock = true; lastClockIn = at; }
      else if (l.event_type === "clock_out" && lastClockIn) {
        workedMs += at.getTime() - lastClockIn.getTime(); lastClockIn = null; onClock = false;
      } else if (l.event_type === "break_start") { onBreak = true; lastBreakStart = at; }
      else if (l.event_type === "break_end" && lastBreakStart) {
        breakMs += at.getTime() - lastBreakStart.getTime(); lastBreakStart = null; onBreak = false;
      }
    }
    const now = new Date();
    if (lastClockIn) workedMs += now.getTime() - lastClockIn.getTime();
    if (lastBreakStart) breakMs += now.getTime() - lastBreakStart.getTime();
    // subtract break from worked
    workedMs = Math.max(0, workedMs - breakMs);
    return { onClock, onBreak, workedMs, breakMs };
  }, [logs, tick]);

  const log = async (event_type: string) => {
    if (!employee) return;
    const { error } = await supabase.from("time_logs").insert({ employee_id: employee.id, event_type });
    if (error) return toast.error(error.message);
    toast.success(event_type.replace("_", " "));
    loadLogs();
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Hi {employee?.name?.split(" ")[0]} 👋</h1>
        <p className="text-muted-foreground">{new Date().toDateString()}</p>
      </div>

      {birthdays.length > 0 && (
        <div className="glass border border-primary/30 rounded-xl p-4 flex items-center gap-3">
          <Cake className="w-5 h-5 text-primary" />
          <div>
            <div className="font-semibold">🎉 Birthday today!</div>
            <div className="text-sm text-muted-foreground">
              Wish {birthdays.map((b) => b.name).join(", ")} a very happy birthday.
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="glass rounded-xl p-5 border border-border">
          <div className="text-xs text-muted-foreground">Worked today</div>
          <div className="text-3xl font-bold mt-1">{fmtDur(workedMs)}</div>
          <div className="text-xs text-muted-foreground mt-1">{onClock ? "Currently clocked in" : "Clocked out"}</div>
        </div>
        <div className="glass rounded-xl p-5 border border-border">
          <div className="text-xs text-muted-foreground">Break today</div>
          <div className="text-3xl font-bold mt-1">{fmtDur(breakMs)}</div>
          <div className="text-xs text-muted-foreground mt-1">{onBreak ? "On a break" : "Not on break"}</div>
        </div>
        <div className="glass rounded-xl p-5 border border-border">
          <div className="text-xs text-muted-foreground">Events logged</div>
          <div className="text-3xl font-bold mt-1">{logs.length}</div>
          <div className="text-xs text-muted-foreground mt-1">today</div>
        </div>
      </div>

      <div className="flex flex-wrap gap-2">
        {!onClock && (
          <Button onClick={() => log("clock_in")} className="bg-gradient-primary text-primary-foreground border-0">
            <LogIn className="w-4 h-4 mr-2" /> Clock in
          </Button>
        )}
        {onClock && !onBreak && (
          <Button onClick={() => log("break_start")} variant="outline">
            <Coffee className="w-4 h-4 mr-2" /> Start break
          </Button>
        )}
        {onBreak && (
          <Button onClick={() => log("break_end")} variant="outline">
            <Coffee className="w-4 h-4 mr-2" /> End break
          </Button>
        )}
        {onClock && (
          <Button onClick={() => log("clock_out")} variant="destructive">
            <LogOut className="w-4 h-4 mr-2" /> Clock out
          </Button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {achiever && (
          <div className="glass rounded-xl p-5 border border-border">
            <div className="flex items-center gap-2 mb-3"><Trophy className="w-5 h-5 text-primary" /><h2 className="font-semibold">This Month's {achiever.title}</h2></div>
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-muted overflow-hidden flex items-center justify-center text-lg font-bold">
                {achiever.avatar_url ? <img src={achiever.avatar_url} alt={achiever.name} className="w-full h-full object-cover" /> : achiever.name[0]}
              </div>
              <div className="font-semibold">{achiever.name}</div>
            </div>
          </div>
        )}
        <div className="glass rounded-xl p-5 border border-border">
          <div className="flex items-center gap-2 mb-3"><Megaphone className="w-5 h-5 text-primary" /><h2 className="font-semibold">Announcements</h2></div>
          {announcements.length === 0 && <div className="text-sm text-muted-foreground">No announcements.</div>}
          <div className="space-y-3">
            {announcements.map((a) => (
              <div key={a.id}>
                <div className="font-medium text-sm">{a.title}</div>
                <div className="text-xs text-muted-foreground">{a.posted_at}</div>
                <div className="text-sm">{a.body}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="glass rounded-xl p-5 border border-border">
        <h2 className="font-semibold mb-3">Today's events</h2>
        {logs.length === 0 ? (
          <div className="text-sm text-muted-foreground">No events yet today.</div>
        ) : (
          <ul className="space-y-1 text-sm">
            {logs.map((l) => (
              <li key={l.id} className="flex justify-between">
                <span className="capitalize">{l.event_type.replace("_", " ")}</span>
                <span className="text-muted-foreground">{new Date(l.event_at).toLocaleTimeString()}</span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default EmployeeDashboard;