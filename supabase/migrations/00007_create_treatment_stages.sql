CREATE TABLE IF NOT EXISTS public.treatment_stages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  treatment_cycle_id uuid NOT NULL REFERENCES public.treatment_cycles(id) ON DELETE CASCADE,
  stage_type text NOT NULL CHECK (stage_type IN ('SENSING','SEDIMENT','CARBON','UF','UV','VERIFICATION')),
  stage_order integer NOT NULL,
  status text NOT NULL DEFAULT 'PENDING' CHECK (status IN ('PENDING','IN_PROGRESS','COMPLETED','FAILED','SKIPPED')),
  started_at timestamptz,
  completed_at timestamptz,
  duration_seconds numeric(6,1),
  failure_reason text,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE(treatment_cycle_id, stage_type)
);

CREATE INDEX idx_stages_cycle ON public.treatment_stages(treatment_cycle_id);

COMMENT ON TABLE public.treatment_stages IS 'Individual stage records within a treatment cycle.';
