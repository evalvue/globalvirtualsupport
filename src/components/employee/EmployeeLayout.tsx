import { NavLink, Outlet, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  CalendarCheck,
  PalmtreeIcon,
  ClipboardList,
  UserCircle,
  Users,
  LogOut,
  Briefcase,
} from "lucide-react";
import { useEmployeeAuth } from "@/hooks/useEmployeeAuth";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";

const items = [
  { to: "/employee", label: "Dashboard", icon: LayoutDashboard, end: true },
  { to: "/employee/attendance", label: "Attendance", icon: CalendarCheck },
  { to: "/employee/leave", label: "Leave", icon: PalmtreeIcon },
  { to: "/employee/tasks", label: "Tasks & Customers", icon: ClipboardList },
  { to: "/employee/team", label: "Team & Achievers", icon: Users },
  { to: "/employee/profile", label: "My Profile", icon: UserCircle },
];

const EmployeeLayout = () => {
  const { user, isEmployee, isAdmin, employee, loading, signOut } = useEmployeeAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && !user) navigate("/employee/login", { replace: true });
  }, [loading, user, navigate]);

  if (loading)
    return <div className="min-h-screen flex items-center justify-center text-muted-foreground">Loading...</div>;
  if (!user) return null;
  const hasAccess = isAdmin || (isEmployee && !!employee);
  if (!hasAccess) {
    return (
      <div className="min-h-screen flex items-center justify-center px-6">
        <div className="glass rounded-2xl p-8 max-w-md text-center">
          <h2 className="text-2xl font-bold mb-2">Access denied</h2>
          <p className="text-muted-foreground mb-6">
            Your account ({user.email}) is not linked to any employee profile. Please contact your admin.
          </p>
          <Button onClick={signOut} variant="outline">Sign out</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex bg-background">
      <aside className="w-60 border-r border-border bg-card/40 backdrop-blur-md flex flex-col">
        <div className="p-6 flex items-center gap-2 border-b border-border">
          <Briefcase className="w-5 h-5 text-primary" />
          <span className="font-semibold">Employee CRM</span>
        </div>
        <nav className="flex-1 p-3 space-y-1">
          {items.map((it) => (
            <NavLink
              key={it.to}
              to={it.to}
              end={it.end}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors ${
                  isActive
                    ? "bg-primary/15 text-primary border border-primary/30"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted/40"
                }`
              }
            >
              <it.icon className="w-4 h-4" />
              {it.label}
            </NavLink>
          ))}
        </nav>
        <div className="p-3 border-t border-border">
          <div className="text-xs text-muted-foreground px-3 mb-1 truncate">
            {employee?.name ?? (isAdmin ? "Admin" : "")}
          </div>
          <div className="text-xs text-muted-foreground px-3 mb-2 truncate">{user.email}</div>
          {isAdmin && (
            <Button asChild variant="outline" size="sm" className="w-full justify-start mb-2">
              <a href="/admin">Go to Admin Panel</a>
            </Button>
          )}
          <Button onClick={signOut} variant="ghost" size="sm" className="w-full justify-start">
            <LogOut className="w-4 h-4 mr-2" /> Sign out
          </Button>
        </div>
      </aside>
      <main className="flex-1 overflow-auto">
        <div className="p-6 md:p-8 max-w-6xl mx-auto">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default EmployeeLayout;