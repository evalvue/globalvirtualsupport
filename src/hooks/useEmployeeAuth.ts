import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import type { User } from "@supabase/supabase-js";

export type EmployeeProfile = {
  id: string;
  name: string;
  mobile: string;
  email: string | null;
  role: string | null;
  department: string | null;
  dob: string | null;
  avatar_url: string | null;
  about: string | null;
  joining_date: string | null;
  base_salary: number;
  monthly_target: number;
  user_id: string | null;
};

export function useEmployeeAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [employee, setEmployee] = useState<EmployeeProfile | null>(null);
  const [isEmployee, setIsEmployee] = useState(false);
  const [loading, setLoading] = useState(true);

  const loadProfile = async (uid: string) => {
    const { data: role } = await supabase
      .from("user_roles")
      .select("role")
      .eq("user_id", uid)
      .eq("role", "employee")
      .maybeSingle();
    setIsEmployee(!!role);
    const { data: emp } = await supabase
      .from("employees")
      .select("*")
      .eq("user_id", uid)
      .maybeSingle();
    setEmployee((emp as EmployeeProfile) ?? null);
    setLoading(false);
  };

  useEffect(() => {
    const { data: sub } = supabase.auth.onAuthStateChange((_e, session) => {
      setUser(session?.user ?? null);
      if (session?.user) {
        setTimeout(() => loadProfile(session.user.id), 0);
      } else {
        setIsEmployee(false);
        setEmployee(null);
        setLoading(false);
      }
    });
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      if (!session) setLoading(false);
    });
    return () => sub.subscription.unsubscribe();
  }, []);

  const refresh = async () => {
    if (user) await loadProfile(user.id);
  };

  const signOut = async () => {
    await supabase.auth.signOut();
  };

  return { user, employee, isEmployee, loading, signOut, refresh };
}