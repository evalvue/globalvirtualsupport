## Plan: Multi-page website + Admin Panel

### Public Pages (separate routes, all linked via Navbar/Footer)
- `/` — Home (current hero + summary sections)
- `/services` — Full services list with descriptions, benefits per service
- `/about` — Company story, mission, team
- `/industries` — BPO, Call Center, Dispatching, Logistics etc.
- `/global-presence` — Map + global offices
- `/how-to-connect` — Steps to onboard
- `/contact` — Contact form, phone, address

Navbar links update to use React Router `<Link>` instead of hash anchors.

### Admin Panel (protected, Lovable Cloud auth)
- **Login**: Google OAuth only. Restrict access to `jeet0731@gmail.com` (others see "Access denied").
- Routes under `/admin/*` with sidebar layout:
  - `/admin/login`
  - `/admin/dashboard` — stats: total candidates, employees, today's interviews, monthly payroll
  - `/admin/site-settings` — edit site **mobile number** and **address** (saved in DB, used across public site)
  - `/admin/candidates` — CRUD (name, mobile, email, position, status: pending/pass/fail, joining date)
  - `/admin/interviews` — schedule (candidate, date/time, interviewer, mode, notes, result)
  - `/admin/employees` — HR add employee (name, mobile, email, role, department, salary, joining date)
  - `/admin/attendance` — daily mark present/absent/half-day per employee, monthly view
  - `/admin/salary` — monthly salary calc (base + present days + bonus − deductions), mark paid

### Backend (Lovable Cloud)
Tables (all with RLS — only admin user can access):
- `site_settings` (singleton: mobile, address, email) — public read, admin write
- `candidates`
- `interviews` (FK candidate)
- `employees`
- `attendance` (FK employee, date, status)
- `salaries` (FK employee, month, base, bonus, deduction, net, paid)
- `admin_users` (allowlist of admin emails) + `has_admin_role()` security definer function

Public site reads `site_settings` for phone/address (Navbar, Contact, Footer).

### Tech notes
- Enable Lovable Cloud → Google OAuth provider.
- React Router nested routes; `AdminLayout` with sidebar; `RequireAdmin` guard.
- shadcn `Table`, `Dialog`, `Form` + zod for all CRUD.
- Keep current 3D globe / dark theme design system.

After approval I'll enable Cloud, create migrations, build pages.
