CREATE TABLE IF NOT EXISTS public.safety_events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  device_id uuid NOT NULL REFERENCES public.devices(id) ON DELETE CASCADE,
  treatment_cycle_id uuid REFERENCES public.treatment_cycles(id) ON DELETE SET NULL,
  from_state text NOT NULL,
  to_state text NOT NULL,
  trigger text NOT NULL,
  rejection_code text,
  sensor_snapshot jsonb,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX idx_safety_device_time ON public.safety_events(device_id, created_at);

COMMENT ON TABLE public.safety_events IS 'Immutable log of every safety state transition for auditing.';
