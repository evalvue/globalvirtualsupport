
-- 1. Extend employees first
ALTER TABLE public.employees
  ADD COLUMN IF NOT EXISTS user_id uuid UNIQUE,
  ADD COLUMN IF NOT EXISTS dob date,
  ADD COLUMN IF NOT EXISTS avatar_url text,
  ADD COLUMN IF NOT EXISTS about text,
  ADD COLUMN IF NOT EXISTS monthly_target numeric NOT NULL DEFAULT 0;

-- 2. helper
CREATE OR REPLACE FUNCTION public.current_employee_id()
RETURNS uuid LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT id FROM public.employees WHERE user_id = auth.uid() LIMIT 1
$$;

CREATE POLICY "Employees view all employees"
ON public.employees FOR SELECT TO authenticated
USING (public.has_role(auth.uid(), 'employee') OR public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Employees update own profile"
ON public.employees FOR UPDATE TO authenticated
USING (user_id = auth.uid()) WITH CHECK (user_id = auth.uid());

-- 3. time_logs
CREATE TABLE public.time_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  employee_id uuid NOT NULL,
  event_type text NOT NULL CHECK (event_type IN ('clock_in','clock_out','break_start','break_end')),
  event_at timestamptz NOT NULL DEFAULT now(),
  notes text,
  created_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX idx_time_logs_emp_date ON public.time_logs(employee_id, event_at);
ALTER TABLE public.time_logs ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Admins manage time logs" ON public.time_logs FOR ALL TO authenticated
USING (public.has_role(auth.uid(),'admin')) WITH CHECK (public.has_role(auth.uid(),'admin'));
CREATE POLICY "Employees insert own time logs" ON public.time_logs FOR INSERT TO authenticated
WITH CHECK (employee_id = public.current_employee_id());
CREATE POLICY "Employees view own time logs" ON public.time_logs FOR SELECT TO authenticated
USING (employee_id = public.current_employee_id() OR public.has_role(auth.uid(),'admin'));

-- 4. work_logs
CREATE TABLE public.work_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  employee_id uuid NOT NULL,
  log_date date NOT NULL DEFAULT CURRENT_DATE,
  tasks_completed integer NOT NULL DEFAULT 0,
  customers_handled integer NOT NULL DEFAULT 0,
  notes text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE(employee_id, log_date)
);
ALTER TABLE public.work_logs ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Admins manage work logs" ON public.work_logs FOR ALL TO authenticated
USING (public.has_role(auth.uid(),'admin')) WITH CHECK (public.has_role(auth.uid(),'admin'));
CREATE POLICY "Employees view all work logs" ON public.work_logs FOR SELECT TO authenticated
USING (public.has_role(auth.uid(),'employee') OR public.has_role(auth.uid(),'admin'));
CREATE POLICY "Employees insert own work logs" ON public.work_logs FOR INSERT TO authenticated
WITH CHECK (employee_id = public.current_employee_id());
CREATE POLICY "Employees update own work logs" ON public.work_logs FOR UPDATE TO authenticated
USING (employee_id = public.current_employee_id())
WITH CHECK (employee_id = public.current_employee_id());
CREATE TRIGGER work_logs_updated BEFORE UPDATE ON public.work_logs
FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- 5. achievements
CREATE TABLE public.achievements (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  employee_id uuid NOT NULL,
  month date NOT NULL,
  title text NOT NULL DEFAULT 'Best Achiever',
  description text,
  created_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.achievements ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Admins manage achievements" ON public.achievements FOR ALL TO authenticated
USING (public.has_role(auth.uid(),'admin')) WITH CHECK (public.has_role(auth.uid(),'admin'));
CREATE POLICY "Anyone signed in views achievements" ON public.achievements FOR SELECT TO authenticated
USING (public.has_role(auth.uid(),'employee') OR public.has_role(auth.uid(),'admin'));

-- 6. attendance/leaves access for employees
CREATE POLICY "Employees view own attendance" ON public.attendance FOR SELECT TO authenticated
USING (employee_id = public.current_employee_id() OR public.has_role(auth.uid(),'admin'));
CREATE POLICY "Employees insert own attendance" ON public.attendance FOR INSERT TO authenticated
WITH CHECK (employee_id = public.current_employee_id());
CREATE POLICY "Employees view own leaves" ON public.leaves FOR SELECT TO authenticated
USING (employee_id = public.current_employee_id() OR public.has_role(auth.uid(),'admin'));
CREATE POLICY "Employees request own leaves" ON public.leaves FOR INSERT TO authenticated
WITH CHECK (employee_id = public.current_employee_id());

-- 7. read holidays & announcements
CREATE POLICY "Anyone signed in views holidays" ON public.holidays FOR SELECT TO authenticated USING (true);
CREATE POLICY "Anyone signed in views announcements" ON public.announcements FOR SELECT TO authenticated USING (true);
