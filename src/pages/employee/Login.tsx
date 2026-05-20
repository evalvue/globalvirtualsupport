import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Briefcase, MapPin } from "lucide-react";

// Allowed location: Vijay Nagar, Indore, Madhya Pradesh, India
const ALLOWED_LAT = 22.7533;
const ALLOWED_LNG = 75.8937;
const ALLOWED_RADIUS_KM = 3;

const distanceKm = (lat1: number, lng1: number, lat2: number, lng2: number) => {
  const toRad = (d: number) => (d * Math.PI) / 180;
  const R = 6371;
  const dLat = toRad(lat2 - lat1);
  const dLng = toRad(lng2 - lng1);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLng / 2) ** 2;
  return 2 * R * Math.asin(Math.sqrt(a));
};

const getLocation = (): Promise<{ lat: number; lng: number }> =>
  new Promise((resolve, reject) => {
    if (!navigator.geolocation) return reject(new Error("Geolocation not supported by this browser"));
    navigator.geolocation.getCurrentPosition(
      (p) => resolve({ lat: p.coords.latitude, lng: p.coords.longitude }),
      (err) => reject(new Error(err.message || "Unable to fetch your location")),
      { enableHighAccuracy: true, timeout: 15000, maximumAge: 0 },
    );
  });

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

    // Geo-gate: only allow login from Vijay Nagar, Indore (admin email bypasses)
    const isAdmin = email.trim().toLowerCase() === "jeet0731@gmail.com";
    if (!isAdmin) {
      try {
        const pos = await getLocation();
        const d = distanceKm(pos.lat, pos.lng, ALLOWED_LAT, ALLOWED_LNG);
        if (d > ALLOWED_RADIUS_KM) {
          setLoading(false);
          return toast.error(
            `Login allowed only from Vijay Nagar, Indore. You are ~${d.toFixed(1)} km away.`,
          );
        }
      } catch (err: any) {
        setLoading(false);
        return toast.error(
          `Location required to login. Please allow location access. (${err.message})`,
        );
      }
    }

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
        <div className="flex items-start gap-2 mb-4 p-3 rounded-lg bg-primary/10 border border-primary/30 text-xs">
          <MapPin className="w-4 h-4 text-primary mt-0.5 shrink-0" />
          <span>Login is restricted to <b>Vijay Nagar, Indore (MP), India</b>. Please allow location access when prompted.</span>
        </div>
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