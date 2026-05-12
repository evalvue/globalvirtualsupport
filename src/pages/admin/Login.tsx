import { Button } from "@/components/ui/button";
import { Globe } from "lucide-react";
import { lovable } from "@/integrations/lovable";
import { toast } from "sonner";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";

const Login = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) navigate("/admin", { replace: true });
    });
  }, [navigate]);

  const onGoogle = async () => {
    setLoading(true);
    const result = await lovable.auth.signInWithOAuth("google", {
      redirect_uri: `${window.location.origin}/admin`,
    });
    if (result.error) {
      toast.error("Sign-in failed. Please try again.");
      setLoading(false);
      return;
    }
    if (result.redirected) return;
    navigate("/admin", { replace: true });
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-6 bg-gradient-hero">
      <div className="glass rounded-3xl p-10 max-w-md w-full text-center shadow-elevated">
        <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-primary/10 border border-primary/30 mb-6">
          <Globe className="w-7 h-7 text-primary" />
        </div>
        <h1 className="text-3xl font-bold mb-2">Admin Sign In</h1>
        <p className="text-muted-foreground mb-8 text-sm">
          Authorized Google account only. Use <span className="text-foreground">jeet0731@gmail.com</span>.
        </p>
        <Button
          onClick={onGoogle}
          disabled={loading}
          size="lg"
          className="w-full bg-gradient-primary text-primary-foreground border-0 shadow-glow hover:opacity-90"
        >
          {loading ? "Redirecting..." : "Continue with Google"}
        </Button>
      </div>
    </div>
  );
};

export default Login;