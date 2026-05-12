import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Users, CalendarCheck, Briefcase, DollarSign } from "lucide-react";

const Dashboard = () => {
  const [stats, setStats] = useState({ candidates: 0, employees: 0, todayInterviews: 0, monthlyPayroll: 0 });

  useEffect(() => {
    (async () => {
      const today = new Date().toISOString().slice(0, 10);
      const [c, e, i, s] = await Promise.all([
        supabase.from("candidates").select("*", { count: "exact", head: true }),
        supabase.from("employees").select("*", { count: "exact", head: true }).eq("active", true),
        supabase.from("interviews").select("*", { count: "exact", head: true }).gte("scheduled_at", today + "T00:00:00").lt("scheduled_at", today + "T23:59:59"),
        supabase.from("salaries").select("net").gte("month", new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString().slice(0,10)),
      ]);
      const payroll = (s.data || []).reduce((sum: number, r: { net: number }) => sum + Number(r.net || 0), 0);
      setStats({ candidates: c.count || 0, employees: e.count || 0, todayInterviews: i.count || 0, monthlyPayroll: payroll });
    })();
  }, []);

  const cards = [
    { label: "Total Candidates", value: stats.candidates, icon: Users },
    { label: "Active Employees", value: stats.employees, icon: Briefcase },
    { label: "Today's Interviews", value: stats.todayInterviews, icon: CalendarCheck },
    { label: "Monthly Payroll", value: `$${stats.monthlyPayroll.toLocaleString()}`, icon: DollarSign },
  ];

  return (
    <div>
      <h1 className="text-3xl font-bold mb-2">Dashboard</h1>
      <p className="text-muted-foreground mb-8">Welcome back. Here's a snapshot of your operations.</p>
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {cards.map((c) => (
          <div key={c.label} className="glass rounded-2xl p-6">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs text-muted-foreground uppercase tracking-wider">{c.label}</span>
              <c.icon className="w-5 h-5 text-primary" />
            </div>
            <div className="text-3xl font-bold text-gradient">{c.value}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Dashboard;