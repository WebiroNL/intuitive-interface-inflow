CREATE TABLE public.app_settings (
  key TEXT PRIMARY KEY,
  value TEXT,
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_by UUID
);

ALTER TABLE public.app_settings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "App settings are viewable by everyone"
ON public.app_settings
FOR SELECT
USING (true);

CREATE POLICY "Admins can insert app settings"
ON public.app_settings
FOR INSERT
TO authenticated
WITH CHECK (public.has_role(_user_id => auth.uid(), _role => 'admin'::public.app_role));

CREATE POLICY "Admins can update app settings"
ON public.app_settings
FOR UPDATE
TO authenticated
USING (public.has_role(_user_id => auth.uid(), _role => 'admin'::public.app_role))
WITH CHECK (public.has_role(_user_id => auth.uid(), _role => 'admin'::public.app_role));

CREATE POLICY "Admins can delete app settings"
ON public.app_settings
FOR DELETE
TO authenticated
USING (public.has_role(_user_id => auth.uid(), _role => 'admin'::public.app_role));

CREATE TRIGGER update_app_settings_updated_at
BEFORE UPDATE ON public.app_settings
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

INSERT INTO public.app_settings (key, value) VALUES
  ('partner_dashboard_version', '1.0.0'),
  ('client_dashboard_version', '1.0.0')
ON CONFLICT (key) DO NOTHING;