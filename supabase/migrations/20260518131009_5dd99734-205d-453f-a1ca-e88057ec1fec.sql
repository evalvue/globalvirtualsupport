-- 1. Add 'employee' to role enum
ALTER TYPE public.app_role ADD VALUE IF NOT EXISTS 'employee';
