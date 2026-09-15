CREATE TABLE IF NOT EXISTS public.maintenance_records (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  device_id uuid NOT NULL REFERENCES public.devices(id) ON DELETE CASCADE,
  performed_by uuid NOT NULL REFERENCES public.profiles(id),
  maintenance_type text NOT NULL CHECK (maintenance_type IN ('FILTER_REPLACEMENT','UV_MAINTENANCE','SENSOR_CALIBRATION','INSPECTION','CLEANING','BACKWASH','GENERAL')),
  cartridge_type text,
  description text,
  parts_replaced text[],
  next_due_at timestamptz,
  performed_at timestamptz NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX idx_maintenance_device_time ON public.maintenance_records(device_id, performed_at);

COMMENT ON TABLE public.maintenance_records IS 'Log of all maintenance activities performed on devices.';
