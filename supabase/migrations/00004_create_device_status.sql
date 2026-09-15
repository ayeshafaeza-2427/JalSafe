CREATE TABLE IF NOT EXISTS public.device_status (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  device_id uuid NOT NULL UNIQUE REFERENCES public.devices(id) ON DELETE CASCADE,
  safety_state text NOT NULL DEFAULT 'IDLE' CHECK (safety_state IN ('IDLE','SOURCE_CHECK','PRE_TREATMENT','PURIFYING','VERIFYING','VERIFIED','REJECTED','HOLD','MAINTENANCE','ERROR')),
  solenoid_state text NOT NULL DEFAULT 'LOCKED' CHECK (solenoid_state IN ('LOCKED','UNLOCKED','FAULT')),
  pump_active boolean NOT NULL DEFAULT false,
  battery_level numeric(5,2) CHECK (battery_level >= 0 AND battery_level <= 100),
  solar_charging boolean NOT NULL DEFAULT false,
  solar_voltage numeric(5,2),
  network_status text NOT NULL DEFAULT 'ONLINE' CHECK (network_status IN ('ONLINE','OFFLINE')),
  uv_health numeric(5,2) CHECK (uv_health >= 0 AND uv_health <= 100),
  calibration_status text NOT NULL DEFAULT 'VALID' CHECK (calibration_status IN ('VALID','EXPIRING','EXPIRED')),
  calibration_expires_at timestamptz,
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TRIGGER device_status_updated_at
  BEFORE UPDATE ON public.device_status
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();

COMMENT ON TABLE public.device_status IS 'Current operational snapshot of each device (one row per device).';
