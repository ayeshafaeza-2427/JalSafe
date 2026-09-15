-- Communities table for grouping devices and users by location
CREATE TABLE IF NOT EXISTS public.communities (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  district text,
  state text,
  location_lat numeric(10,7),
  location_lon numeric(10,7),
  created_at timestamptz NOT NULL DEFAULT now()
);

COMMENT ON TABLE public.communities IS 'Groups devices and users by geographic community/village.';
