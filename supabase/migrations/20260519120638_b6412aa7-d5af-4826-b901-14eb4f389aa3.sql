
CREATE TABLE IF NOT EXISTS public.employee_tasks (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  employee_id uuid NOT NULL,
  title text NOT NULL,
  description text,
  status text NOT NULL DEFAULT 'todo',
  priority text NOT NULL DEFAULT 'medium',
  due_date date,
  completed_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.employee_tasks ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins manage employee_tasks" ON public.employee_tasks
  FOR ALL TO authenticated
  USING (has_role(auth.uid(), 'admin'::app_role))
  WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Employees view own tasks" ON public.employee_tasks
  FOR SELECT TO authenticated
  USING (employee_id = current_employee_id() OR has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Employees insert own tasks" ON public.employee_tasks
  FOR INSERT TO authenticated
  WITH CHECK (employee_id = current_employee_id());

CREATE POLICY "Employees update own tasks" ON public.employee_tasks
  FOR UPDATE TO authenticated
  USING (employee_id = current_employee_id())
  WITH CHECK (employee_id = current_employee_id());

CREATE POLICY "Employees delete own tasks" ON public.employee_tasks
  FOR DELETE TO authenticated
  USING (employee_id = current_employee_id());

CREATE TRIGGER employee_tasks_updated_at
  BEFORE UPDATE ON public.employee_tasks
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
