CREATE TABLE IF NOT EXISTS public.qr_records (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  treatment_cycle_id uuid NOT NULL UNIQUE REFERENCES public.treatment_cycles(id) ON DELETE CASCADE,
  qr_token text NOT NULL UNIQUE,
  device_serial text NOT NULL,
  cycle_number integer NOT NULL,
  treated_at timestamptz NOT NULL,
  outcome text NOT NULL CHECK (outcome IN ('VERIFIED','REJECTED')),
  inlet_summary jsonb NOT NULL,
  outlet_summary jsonb NOT NULL,
  stages_completed text[] NOT NULL,
  filter_health jsonb,
  firmware_version text,
  record_hash text NOT NULL,
  disclaimer text NOT NULL DEFAULT 'This is a treatment record from a JalSafe Mini device. It records the device measurements at the time of treatment. It is NOT a substitute for accredited laboratory water testing.',
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX idx_qr_token ON public.qr_records(qr_token);

COMMENT ON TABLE public.qr_records IS 'Public verification records linked to QR codes. Readable by anyone for water safety verification.';
