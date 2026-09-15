CREATE TABLE IF NOT EXISTS public.threshold_configs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  device_id uuid REFERENCES public.devices(id) ON DELETE CASCADE,
  parameter text NOT NULL CHECK (parameter IN ('ph','tds','turbidity','temperature','flow')),
  min_value numeric(10,4),
  max_value numeric(10,4),
  unit text,
  is_inlet boolean NOT NULL DEFAULT false,
  updated_at timestamptz NOT NULL DEFAULT now(),
  updated_by uuid REFERENCES public.profiles(id),
  UNIQUE(device_id, parameter, is_inlet)
);

CREATE INDEX idx_thresholds_device ON public.threshold_configs(device_id);

CREATE TRIGGER threshold_configs_updated_at
  BEFORE UPDATE ON public.threshold_configs
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();

COMMENT ON TABLE public.threshold_configs IS 'Configurable safety thresholds per device. NULL device_id = global defaults.';
