import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import Index from "./pages/Index.tsx";
import NotFound from "./pages/NotFound.tsx";
import ServicesPage from "./pages/ServicesPage";
import AboutPage from "./pages/AboutPage";
import IndustriesPage from "./pages/IndustriesPage";
import GlobalPage from "./pages/GlobalPage";
import HowToConnectPage from "./pages/HowToConnectPage";
import ContactPage from "./pages/ContactPage";
import SoftwareDevelopmentPage from "./pages/SoftwareDevelopmentPage";
import SoftwareCategoryPage from "./pages/SoftwareCategoryPage";
import AdminLayout from "./components/admin/AdminLayout";
import AdminLogin from "./pages/admin/Login";
import AdminDashboard from "./pages/admin/Dashboard";
import AdminSiteSettings from "./pages/admin/SiteSettings";
import AdminCandidates from "./pages/admin/Candidates";
import AdminInterviews from "./pages/admin/Interviews";
import AdminEmployees from "./pages/admin/Employees";
import AdminAttendance from "./pages/admin/Attendance";
import AdminSalary from "./pages/admin/Salary";
import AdminLeaves from "./pages/admin/Leaves";
import AdminHolidays from "./pages/admin/Holidays";
import AdminAnnouncements from "./pages/admin/Announcements";
import AdminDepartments from "./pages/admin/Departments";
import AdminDocuments from "./pages/admin/Documents";
import AdminLeads from "./pages/admin/Leads";
import AdminAchievements from "./pages/admin/Achievements";
import EmployeeLayout from "./components/employee/EmployeeLayout";
import EmployeeLogin from "./pages/employee/Login";
import EmployeeDashboard from "./pages/employee/Dashboard";
import EmployeeAttendance from "./pages/employee/Attendance";
import EmployeeLeave from "./pages/employee/Leave";
import EmployeeTasks from "./pages/employee/Tasks";
import EmployeeProfile from "./pages/employee/Profile";
import EmployeeTeam from "./pages/employee/Team";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/services" element={<ServicesPage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/industries" element={<IndustriesPage />} />
          <Route path="/global-presence" element={<GlobalPage />} />
          <Route path="/how-to-connect" element={<HowToConnectPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/software-development" element={<SoftwareDevelopmentPage />} />
          <Route path="/software-development/:slug" element={<SoftwareCategoryPage />} />

          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<AdminDashboard />} />
            <Route path="site-settings" element={<AdminSiteSettings />} />
            <Route path="candidates" element={<AdminCandidates />} />
            <Route path="interviews" element={<AdminInterviews />} />
            <Route path="employees" element={<AdminEmployees />} />
            <Route path="attendance" element={<AdminAttendance />} />
            <Route path="salary" element={<AdminSalary />} />
            <Route path="leaves" element={<AdminLeaves />} />
            <Route path="holidays" element={<AdminHolidays />} />
            <Route path="announcements" element={<AdminAnnouncements />} />
            <Route path="departments" element={<AdminDepartments />} />
            <Route path="documents" element={<AdminDocuments />} />
            <Route path="leads" element={<AdminLeads />} />
            <Route path="achievements" element={<AdminAchievements />} />
          </Route>

          <Route path="/employee/login" element={<EmployeeLogin />} />
          <Route path="/employee" element={<EmployeeLayout />}>
            <Route index element={<EmployeeDashboard />} />
            <Route path="attendance" element={<EmployeeAttendance />} />
            <Route path="leave" element={<EmployeeLeave />} />
            <Route path="tasks" element={<EmployeeTasks />} />
            <Route path="profile" element={<EmployeeProfile />} />
            <Route path="team" element={<EmployeeTeam />} />
          </Route>

          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
