CREATE TABLE IF NOT EXISTS public.filter_status (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  device_id uuid NOT NULL REFERENCES public.devices(id) ON DELETE CASCADE,
  cartridge_type text NOT NULL CHECK (cartridge_type IN ('SEDIMENT','CARBON','UF','UV','TDS_MODULE')),
  cartridge_color text NOT NULL CHECK (cartridge_color IN ('RED','BLACK','BLUE','VIOLET','YELLOW')),
  installed_at timestamptz NOT NULL DEFAULT now(),
  expected_lifespan_litres integer,
  litres_processed integer NOT NULL DEFAULT 0,
  health_percentage numeric(5,2) NOT NULL DEFAULT 100 CHECK (health_percentage >= 0 AND health_percentage <= 100),
  flow_rate_initial numeric(8,2),
  flow_rate_current numeric(8,2),
  last_cleaning_at timestamptz,
  replacement_due boolean NOT NULL DEFAULT false,
  replaced_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX idx_filter_device_type ON public.filter_status(device_id, cartridge_type);

CREATE TRIGGER filter_status_updated_at
  BEFORE UPDATE ON public.filter_status
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();

COMMENT ON TABLE public.filter_status IS 'Tracks health and lifespan of modular filter cartridges.';
