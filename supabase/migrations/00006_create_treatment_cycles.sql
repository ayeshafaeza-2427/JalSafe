CREATE TABLE IF NOT EXISTS public.treatment_cycles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  device_id uuid NOT NULL REFERENCES public.devices(id) ON DELETE CASCADE,
  cycle_number integer NOT NULL,
  started_at timestamptz NOT NULL,
  ended_at timestamptz,
  outcome text NOT NULL DEFAULT 'IN_PROGRESS' CHECK (outcome IN ('IN_PROGRESS','VERIFIED','REJECTED','ABORTED')),
  rejection_reason text,
  rejection_detail text,
  volume_treated_ml integer,
  inlet_ph numeric(5,2),
  inlet_tds numeric(8,2),
  inlet_turbidity numeric(8,4),
  inlet_temperature numeric(5,2),
  inlet_flow numeric(8,2),
  outlet_ph numeric(5,2),
  outlet_tds numeric(8,2),
  outlet_turbidity numeric(8,4),
  outlet_temperature numeric(5,2),
  outlet_flow numeric(8,2),
  uv_health_at_cycle numeric(5,2),
  battery_at_start numeric(5,2),
  battery_at_end numeric(5,2),
  firmware_version text,
  previous_hash text,
  current_hash text,
  hash_verified boolean NOT NULL DEFAULT false,
  sync_status text NOT NULL DEFAULT 'LOCAL' CHECK (sync_status IN ('LOCAL','SYNCING','SYNCED','FAILED')),
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE(device_id, cycle_number)
);

CREATE INDEX idx_cycles_device_time ON public.treatment_cycles(device_id, started_at);
CREATE INDEX idx_cycles_outcome ON public.treatment_cycles(outcome);
CREATE INDEX idx_cycles_sync_status ON public.treatment_cycles(sync_status);

COMMENT ON TABLE public.treatment_cycles IS 'Core table for each purification cycle with hash chaining for tamper evidence.';
