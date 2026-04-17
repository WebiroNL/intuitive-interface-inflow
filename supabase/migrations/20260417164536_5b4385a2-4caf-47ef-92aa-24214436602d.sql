-- Clients table
CREATE TABLE public.clients (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID UNIQUE,
  slug TEXT NOT NULL UNIQUE,
  company_name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  contact_person TEXT,
  logo_url TEXT,
  contract_duration TEXT,
  monthly_fee NUMERIC DEFAULT 0,
  active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_clients_slug ON public.clients(slug);
CREATE INDEX idx_clients_user_id ON public.clients(user_id);

-- Monthly data
CREATE TABLE public.monthly_data (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id UUID NOT NULL REFERENCES public.clients(id) ON DELETE CASCADE,
  year INTEGER NOT NULL,
  month INTEGER NOT NULL CHECK (month BETWEEN 1 AND 12),
  google_spend NUMERIC DEFAULT 0,
  google_clicks INTEGER DEFAULT 0,
  google_conversions INTEGER DEFAULT 0,
  google_ctr NUMERIC DEFAULT 0,
  google_cpc NUMERIC DEFAULT 0,
  meta_spend NUMERIC DEFAULT 0,
  meta_clicks INTEGER DEFAULT 0,
  meta_conversions INTEGER DEFAULT 0,
  meta_ctr NUMERIC DEFAULT 0,
  meta_cpc NUMERIC DEFAULT 0,
  tiktok_spend NUMERIC DEFAULT 0,
  tiktok_clicks INTEGER DEFAULT 0,
  tiktok_conversions INTEGER DEFAULT 0,
  tiktok_ctr NUMERIC DEFAULT 0,
  tiktok_cpc NUMERIC DEFAULT 0,
  total_leads INTEGER DEFAULT 0,
  cpa NUMERIC DEFAULT 0,
  roas NUMERIC DEFAULT 0,
  webiro_fee NUMERIC DEFAULT 0,
  insights TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(client_id, year, month)
);

CREATE INDEX idx_monthly_data_client ON public.monthly_data(client_id, year, month);

-- Invoices
CREATE TABLE public.invoices (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id UUID NOT NULL REFERENCES public.clients(id) ON DELETE CASCADE,
  invoice_number TEXT NOT NULL,
  amount NUMERIC NOT NULL DEFAULT 0,
  status TEXT NOT NULL DEFAULT 'open',
  invoice_date DATE NOT NULL DEFAULT CURRENT_DATE,
  due_date DATE,
  file_url TEXT,
  description TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_invoices_client ON public.invoices(client_id);

-- Contracts
CREATE TABLE public.contracts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id UUID NOT NULL REFERENCES public.clients(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  file_url TEXT,
  start_date DATE,
  end_date DATE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_contracts_client ON public.contracts(client_id);

-- Client files
CREATE TABLE public.client_files (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id UUID NOT NULL REFERENCES public.clients(id) ON DELETE CASCADE,
  category TEXT NOT NULL DEFAULT 'document',
  name TEXT NOT NULL,
  file_url TEXT NOT NULL,
  file_size INTEGER,
  mime_type TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_client_files_client ON public.client_files(client_id);

-- Activity log
CREATE TABLE public.activity_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id UUID NOT NULL REFERENCES public.clients(id) ON DELETE CASCADE,
  type TEXT NOT NULL DEFAULT 'update',
  title TEXT NOT NULL,
  description TEXT,
  occurred_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_activity_client ON public.activity_log(client_id, occurred_at DESC);

-- Helper: get client_id for current user
CREATE OR REPLACE FUNCTION public.get_my_client_id()
RETURNS UUID
LANGUAGE SQL
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT id FROM public.clients WHERE user_id = auth.uid() LIMIT 1;
$$;

-- Enable RLS
ALTER TABLE public.clients ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.monthly_data ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.invoices ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.contracts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.client_files ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.activity_log ENABLE ROW LEVEL SECURITY;

-- Clients policies
CREATE POLICY "Admins manage clients" ON public.clients FOR ALL TO authenticated
  USING (has_role(auth.uid(), 'admin')) WITH CHECK (has_role(auth.uid(), 'admin'));
CREATE POLICY "Clients view own record" ON public.clients FOR SELECT TO authenticated
  USING (user_id = auth.uid());

-- Monthly data policies
CREATE POLICY "Admins manage monthly_data" ON public.monthly_data FOR ALL TO authenticated
  USING (has_role(auth.uid(), 'admin')) WITH CHECK (has_role(auth.uid(), 'admin'));
CREATE POLICY "Clients view own monthly_data" ON public.monthly_data FOR SELECT TO authenticated
  USING (client_id = public.get_my_client_id());

-- Invoices policies
CREATE POLICY "Admins manage invoices" ON public.invoices FOR ALL TO authenticated
  USING (has_role(auth.uid(), 'admin')) WITH CHECK (has_role(auth.uid(), 'admin'));
CREATE POLICY "Clients view own invoices" ON public.invoices FOR SELECT TO authenticated
  USING (client_id = public.get_my_client_id());

-- Contracts policies
CREATE POLICY "Admins manage contracts" ON public.contracts FOR ALL TO authenticated
  USING (has_role(auth.uid(), 'admin')) WITH CHECK (has_role(auth.uid(), 'admin'));
CREATE POLICY "Clients view own contracts" ON public.contracts FOR SELECT TO authenticated
  USING (client_id = public.get_my_client_id());

-- Files policies
CREATE POLICY "Admins manage client_files" ON public.client_files FOR ALL TO authenticated
  USING (has_role(auth.uid(), 'admin')) WITH CHECK (has_role(auth.uid(), 'admin'));
CREATE POLICY "Clients view own files" ON public.client_files FOR SELECT TO authenticated
  USING (client_id = public.get_my_client_id());

-- Activity policies
CREATE POLICY "Admins manage activity_log" ON public.activity_log FOR ALL TO authenticated
  USING (has_role(auth.uid(), 'admin')) WITH CHECK (has_role(auth.uid(), 'admin'));
CREATE POLICY "Clients view own activity" ON public.activity_log FOR SELECT TO authenticated
  USING (client_id = public.get_my_client_id());

-- Triggers for updated_at
CREATE TRIGGER update_clients_updated_at BEFORE UPDATE ON public.clients
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_monthly_data_updated_at BEFORE UPDATE ON public.monthly_data
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Storage bucket for client assets
INSERT INTO storage.buckets (id, name, public) VALUES ('client-assets', 'client-assets', false)
ON CONFLICT (id) DO NOTHING;

-- Storage policies: admins all, clients only own folder (folder = client slug or id)
CREATE POLICY "Admins all client-assets" ON storage.objects FOR ALL TO authenticated
  USING (bucket_id = 'client-assets' AND has_role(auth.uid(), 'admin'))
  WITH CHECK (bucket_id = 'client-assets' AND has_role(auth.uid(), 'admin'));

CREATE POLICY "Clients read own client-assets" ON storage.objects FOR SELECT TO authenticated
  USING (
    bucket_id = 'client-assets'
    AND (storage.foldername(name))[1] = (SELECT id::text FROM public.clients WHERE user_id = auth.uid() LIMIT 1)
  );