CREATE TABLE IF NOT EXISTS public.sensor_readings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  device_id uuid NOT NULL REFERENCES public.devices(id) ON DELETE CASCADE,
  treatment_cycle_id uuid REFERENCES public.treatment_cycles(id) ON DELETE SET NULL,
  reading_point text NOT NULL CHECK (reading_point IN ('INLET','OUTLET')),
  ph numeric(5,2),
  tds numeric(8,2),
  turbidity numeric(8,4),
  temperature numeric(5,2),
  flow_rate numeric(8,2),
  is_valid boolean NOT NULL DEFAULT true,
  recorded_at timestamptz NOT NULL,
  synced_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX idx_readings_device_time ON public.sensor_readings(device_id, recorded_at);
CREATE INDEX idx_readings_cycle ON public.sensor_readings(treatment_cycle_id);

COMMENT ON TABLE public.sensor_readings IS 'Time-series telemetry of water quality sensor data.';
