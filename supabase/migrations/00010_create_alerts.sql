CREATE TABLE IF NOT EXISTS public.alerts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  device_id uuid NOT NULL REFERENCES public.devices(id) ON DELETE CASCADE,
  treatment_cycle_id uuid REFERENCES public.treatment_cycles(id) ON DELETE SET NULL,
  severity text NOT NULL CHECK (severity IN ('CRITICAL','WARNING','INFO')),
  category text NOT NULL CHECK (category IN ('SAFETY','MAINTENANCE','SENSOR','BATTERY','NETWORK','CALIBRATION')),
  title text NOT NULL,
  message text NOT NULL,
  rejection_code text,
  status text NOT NULL DEFAULT 'ACTIVE' CHECK (status IN ('ACTIVE','ACKNOWLEDGED','RESOLVED')),
  acknowledged_by uuid REFERENCES public.profiles(id),
  acknowledged_at timestamptz,
  resolved_by uuid REFERENCES public.profiles(id),
  resolved_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX idx_alerts_device_status ON public.alerts(device_id, status);
CREATE INDEX idx_alerts_severity ON public.alerts(severity);
CREATE INDEX idx_alerts_created ON public.alerts(created_at);

COMMENT ON TABLE public.alerts IS 'System notifications for safety events, maintenance, and operational warnings.';
