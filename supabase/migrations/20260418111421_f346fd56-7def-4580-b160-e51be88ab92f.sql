ALTER TABLE public.clients
ADD COLUMN IF NOT EXISTS intake_sections jsonb NOT NULL DEFAULT '[]'::jsonb;

COMMENT ON COLUMN public.clients.intake_sections IS 'Lijst van zichtbare intake-sectie IDs. Lege array = alle secties zichtbaar.';