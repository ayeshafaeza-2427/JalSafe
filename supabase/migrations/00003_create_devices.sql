CREATE TABLE IF NOT EXISTS public.devices (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  serial_number text UNIQUE NOT NULL,
  name text NOT NULL,
  community_id uuid REFERENCES public.communities(id) ON DELETE SET NULL,
  status text NOT NULL DEFAULT 'ACTIVE' CHECK (status IN ('ACTIVE', 'INACTIVE', 'MAINTENANCE', 'DECOMMISSIONED')),
  firmware_version text NOT NULL DEFAULT '1.0.0',
  location_lat numeric(10,7),
  location_lon numeric(10,7),
  installed_at timestamptz,
  last_seen_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX idx_devices_community ON public.devices(community_id);
CREATE INDEX idx_devices_status ON public.devices(status);
CREATE INDEX idx_devices_serial ON public.devices(serial_number);

CREATE TRIGGER devices_updated_at
  BEFORE UPDATE ON public.devices
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();

COMMENT ON TABLE public.devices IS 'Master registry of JalSafe Mini hardware units.';
