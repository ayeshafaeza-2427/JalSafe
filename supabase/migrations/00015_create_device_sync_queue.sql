CREATE TABLE IF NOT EXISTS public.device_sync_queue (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  device_id uuid NOT NULL REFERENCES public.devices(id) ON DELETE CASCADE,
  operation_type text NOT NULL,
  payload jsonb NOT NULL,
  client_timestamp timestamptz NOT NULL,
  idempotency_key text NOT NULL UNIQUE,
  status text NOT NULL DEFAULT 'PENDING' CHECK (status IN ('PENDING','PROCESSING','PROCESSED','FAILED','CONFLICT')),
  error_message text,
  retry_count integer NOT NULL DEFAULT 0,
  processed_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX idx_sync_device_status ON public.device_sync_queue(device_id, status);
CREATE INDEX idx_sync_idempotency ON public.device_sync_queue(idempotency_key);

COMMENT ON TABLE public.device_sync_queue IS 'Offline-to-cloud sync buffer for batched device data.';
