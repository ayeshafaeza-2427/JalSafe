-- Seed global default thresholds (device_id = NULL means global)
-- Outlet thresholds (stricter)
INSERT INTO public.threshold_configs (device_id, parameter, min_value, max_value, unit, is_inlet) VALUES
  (NULL, 'ph', 6.5, 8.5, 'pH', false),
  (NULL, 'tds', 0, 500, 'mg/L', false),
  (NULL, 'turbidity', 0, 1, 'NTU', false),
  (NULL, 'temperature', 5, 45, '°C', false),
  (NULL, 'flow', 5, 20, 'L/h', false);

-- Inlet thresholds (wider range)
INSERT INTO public.threshold_configs (device_id, parameter, min_value, max_value, unit, is_inlet) VALUES
  (NULL, 'ph', 4.0, 10.0, 'pH', true),
  (NULL, 'tds', 0, 2000, 'mg/L', true),
  (NULL, 'turbidity', 0, 50, 'NTU', true),
  (NULL, 'temperature', 2, 50, '°C', true),
  (NULL, 'flow', 2, 30, 'L/h', true);
