CREATE TABLE IF NOT EXISTS public.audit_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES public.profiles(id),
  device_id uuid REFERENCES public.devices(id) ON DELETE SET NULL,
  action text NOT NULL,
  entity_type text,
  entity_id uuid,
  old_values jsonb,
  new_values jsonb,
  ip_address text,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX idx_audit_user_time ON public.audit_logs(user_id, created_at);
CREATE INDEX idx_audit_device_time ON public.audit_logs(device_id, created_at);
CREATE INDEX idx_audit_action ON public.audit_logs(action);

COMMENT ON TABLE public.audit_logs IS 'Immutable audit trail. No UPDATE or DELETE allowed for non-service roles.';
