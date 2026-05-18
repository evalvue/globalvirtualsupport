import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Briefcase } from "lucide-react";

const EmployeeLogin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) navigate("/employee", { replace: true });
    });
  }, [navigate]);

  const signIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    setLoading(false);
    if (error) return toast.error(error.message);
    toast.success("Welcome back!");
    navigate("/employee");
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-6 bg-background">
      <div className="glass rounded-2xl p-8 w-full max-w-md border border-border">
        <div className="flex items-center gap-2 mb-6">
          <Briefcase className="w-6 h-6 text-primary" />
          <h1 className="text-2xl font-bold">Employee Login</h1>
        </div>
        <p className="text-sm text-muted-foreground mb-6">
          Use the email & password your admin has shared with you.
        </p>
        <form onSubmit={signIn} className="space-y-4">
          <div>
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} />
          </div>
          <div>
            <Label htmlFor="password">Password</Label>
            <Input id="password" type="password" required value={password} onChange={(e) => setPassword(e.target.value)} />
          </div>
          <Button type="submit" disabled={loading} className="w-full bg-gradient-primary text-primary-foreground border-0">
            {loading ? "Signing in..." : "Sign in"}
          </Button>
        </form>
        <div className="mt-6 text-xs text-muted-foreground text-center">
          Admin? <Link to="/admin/login" className="text-primary underline">Go to admin login</Link>
        </div>
      </div>
    </div>
  );
};

export default EmployeeLogin;