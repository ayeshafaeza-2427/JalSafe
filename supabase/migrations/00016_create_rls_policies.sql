-- Helper functions for RLS
CREATE OR REPLACE FUNCTION public.get_user_role()
RETURNS text AS $$
  SELECT role FROM public.profiles WHERE id = auth.uid();
$$ LANGUAGE sql STABLE SECURITY DEFINER;

CREATE OR REPLACE FUNCTION public.get_user_community()
RETURNS uuid AS $$
  SELECT community_id FROM public.profiles WHERE id = auth.uid();
$$ LANGUAGE sql STABLE SECURITY DEFINER;

-- Enable RLS on all tables
ALTER TABLE public.communities ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.devices ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.device_status ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.threshold_configs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.treatment_cycles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.treatment_stages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sensor_readings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.safety_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.alerts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.filter_status ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.maintenance_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.qr_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.device_sync_queue ENABLE ROW LEVEL SECURITY;

-- PROFILES
CREATE POLICY "Admins can do anything on profiles" ON public.profiles FOR ALL USING (public.get_user_role() = 'ADMIN');
CREATE POLICY "Users can view own profile" ON public.profiles FOR SELECT USING (id = auth.uid());
CREATE POLICY "Users can update own profile" ON public.profiles FOR UPDATE USING (id = auth.uid()) WITH CHECK (id = auth.uid());

-- COMMUNITIES
CREATE POLICY "Admins full access to communities" ON public.communities FOR ALL USING (public.get_user_role() = 'ADMIN');
CREATE POLICY "Authenticated users can view communities" ON public.communities FOR SELECT USING (auth.uid() IS NOT NULL);

-- DEVICES
CREATE POLICY "Admins full access to devices" ON public.devices FOR ALL USING (public.get_user_role() = 'ADMIN');
CREATE POLICY "Technicians can view and update devices" ON public.devices FOR SELECT USING (public.get_user_role() = 'TECHNICIAN');
CREATE POLICY "Technicians can update devices" ON public.devices FOR UPDATE USING (public.get_user_role() = 'TECHNICIAN');
CREATE POLICY "Community users see own devices" ON public.devices FOR SELECT USING (
  public.get_user_role() IN ('COMMUNITY_OPERATOR','VIEWER') AND community_id = public.get_user_community()
);

-- DEVICE_STATUS
CREATE POLICY "Admins full access to device_status" ON public.device_status FOR ALL USING (public.get_user_role() = 'ADMIN');
CREATE POLICY "Technicians can view/update device_status" ON public.device_status FOR SELECT USING (public.get_user_role() = 'TECHNICIAN');
CREATE POLICY "Technicians can update device_status" ON public.device_status FOR UPDATE USING (public.get_user_role() = 'TECHNICIAN');
CREATE POLICY "Technicians can insert device_status" ON public.device_status FOR INSERT WITH CHECK (public.get_user_role() = 'TECHNICIAN');
CREATE POLICY "Community users see own device_status" ON public.device_status FOR SELECT USING (
  public.get_user_role() IN ('COMMUNITY_OPERATOR','VIEWER') AND device_id IN (SELECT id FROM public.devices WHERE community_id = public.get_user_community())
);

-- THRESHOLD_CONFIGS
CREATE POLICY "Admins full access to thresholds" ON public.threshold_configs FOR ALL USING (public.get_user_role() = 'ADMIN');
CREATE POLICY "Others can read thresholds" ON public.threshold_configs FOR SELECT USING (auth.uid() IS NOT NULL);

-- TREATMENT_CYCLES
CREATE POLICY "Admins full access to cycles" ON public.treatment_cycles FOR ALL USING (public.get_user_role() = 'ADMIN');
CREATE POLICY "Technicians can view/insert cycles" ON public.treatment_cycles FOR SELECT USING (public.get_user_role() = 'TECHNICIAN');
CREATE POLICY "Technicians can insert cycles" ON public.treatment_cycles FOR INSERT WITH CHECK (public.get_user_role() IN ('ADMIN','TECHNICIAN','COMMUNITY_OPERATOR'));
CREATE POLICY "Technicians can update cycles" ON public.treatment_cycles FOR UPDATE USING (public.get_user_role() IN ('ADMIN','TECHNICIAN'));
CREATE POLICY "Community users see own cycles" ON public.treatment_cycles FOR SELECT USING (
  public.get_user_role() IN ('COMMUNITY_OPERATOR','VIEWER') AND device_id IN (SELECT id FROM public.devices WHERE community_id = public.get_user_community())
);
CREATE POLICY "Community operators can insert cycles" ON public.treatment_cycles FOR INSERT WITH CHECK (
  public.get_user_role() = 'COMMUNITY_OPERATOR' AND device_id IN (SELECT id FROM public.devices WHERE community_id = public.get_user_community())
);

-- TREATMENT_STAGES
CREATE POLICY "Admins full access to stages" ON public.treatment_stages FOR ALL USING (public.get_user_role() = 'ADMIN');
CREATE POLICY "Authenticated can view stages" ON public.treatment_stages FOR SELECT USING (auth.uid() IS NOT NULL);
CREATE POLICY "Auth users can insert stages" ON public.treatment_stages FOR INSERT WITH CHECK (public.get_user_role() IN ('ADMIN','TECHNICIAN','COMMUNITY_OPERATOR'));

-- SENSOR_READINGS
CREATE POLICY "Admins full access to readings" ON public.sensor_readings FOR ALL USING (public.get_user_role() = 'ADMIN');
CREATE POLICY "Auth users can view readings" ON public.sensor_readings FOR SELECT USING (auth.uid() IS NOT NULL);
CREATE POLICY "Auth users can insert readings" ON public.sensor_readings FOR INSERT WITH CHECK (public.get_user_role() IN ('ADMIN','TECHNICIAN','COMMUNITY_OPERATOR'));

-- SAFETY_EVENTS
CREATE POLICY "Admins full access to safety_events" ON public.safety_events FOR ALL USING (public.get_user_role() = 'ADMIN');
CREATE POLICY "Technicians can view safety_events" ON public.safety_events FOR SELECT USING (public.get_user_role() = 'TECHNICIAN');
CREATE POLICY "Auth users can insert safety_events" ON public.safety_events FOR INSERT WITH CHECK (public.get_user_role() IN ('ADMIN','TECHNICIAN','COMMUNITY_OPERATOR'));

-- ALERTS
CREATE POLICY "Admins full access to alerts" ON public.alerts FOR ALL USING (public.get_user_role() = 'ADMIN');
CREATE POLICY "Technicians can view/update alerts" ON public.alerts FOR SELECT USING (public.get_user_role() = 'TECHNICIAN');
CREATE POLICY "Technicians can insert alerts" ON public.alerts FOR INSERT WITH CHECK (public.get_user_role() IN ('ADMIN','TECHNICIAN','COMMUNITY_OPERATOR'));
CREATE POLICY "Technicians can update alerts" ON public.alerts FOR UPDATE USING (public.get_user_role() = 'TECHNICIAN');
CREATE POLICY "Community users can view own alerts" ON public.alerts FOR SELECT USING (
  public.get_user_role() IN ('COMMUNITY_OPERATOR','VIEWER') AND device_id IN (SELECT id FROM public.devices WHERE community_id = public.get_user_community())
);
CREATE POLICY "Community operators can acknowledge alerts" ON public.alerts FOR UPDATE USING (
  public.get_user_role() = 'COMMUNITY_OPERATOR' AND device_id IN (SELECT id FROM public.devices WHERE community_id = public.get_user_community())
);

-- FILTER_STATUS
CREATE POLICY "Admins full access to filter_status" ON public.filter_status FOR ALL USING (public.get_user_role() = 'ADMIN');
CREATE POLICY "Technicians full access to filter_status" ON public.filter_status FOR ALL USING (public.get_user_role() = 'TECHNICIAN');
CREATE POLICY "Community users can view own filter_status" ON public.filter_status FOR SELECT USING (
  public.get_user_role() IN ('COMMUNITY_OPERATOR','VIEWER') AND device_id IN (SELECT id FROM public.devices WHERE community_id = public.get_user_community())
);

-- MAINTENANCE_RECORDS
CREATE POLICY "Admins full access to maintenance" ON public.maintenance_records FOR ALL USING (public.get_user_role() = 'ADMIN');
CREATE POLICY "Technicians can view/insert maintenance" ON public.maintenance_records FOR SELECT USING (public.get_user_role() = 'TECHNICIAN');
CREATE POLICY "Technicians can insert maintenance" ON public.maintenance_records FOR INSERT WITH CHECK (public.get_user_role() = 'TECHNICIAN');
CREATE POLICY "Community users can view own maintenance" ON public.maintenance_records FOR SELECT USING (
  public.get_user_role() IN ('COMMUNITY_OPERATOR','VIEWER') AND device_id IN (SELECT id FROM public.devices WHERE community_id = public.get_user_community())
);

-- QR_RECORDS - PUBLIC ACCESS
CREATE POLICY "Anyone can view QR records" ON public.qr_records FOR SELECT USING (true);
CREATE POLICY "Auth users can insert QR records" ON public.qr_records FOR INSERT WITH CHECK (public.get_user_role() IN ('ADMIN','TECHNICIAN','COMMUNITY_OPERATOR'));

-- AUDIT_LOGS - APPEND ONLY
CREATE POLICY "Admins can view audit logs" ON public.audit_logs FOR SELECT USING (public.get_user_role() = 'ADMIN');
CREATE POLICY "Auth users can insert audit logs" ON public.audit_logs FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);
-- NO UPDATE OR DELETE POLICIES - append only

-- DEVICE_SYNC_QUEUE
CREATE POLICY "Admins full access to sync_queue" ON public.device_sync_queue FOR ALL USING (public.get_user_role() = 'ADMIN');
CREATE POLICY "Auth users can insert to sync_queue" ON public.device_sync_queue FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);
CREATE POLICY "Auth users can view own sync_queue" ON public.device_sync_queue FOR SELECT USING (auth.uid() IS NOT NULL);
