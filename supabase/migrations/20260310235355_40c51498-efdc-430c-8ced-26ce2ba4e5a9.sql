
CREATE TABLE public.moodboard_results (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at timestamptz NOT NULL DEFAULT now(),
  quiz_answers jsonb NOT NULL DEFAULT '{}'::jsonb,
  ai_result jsonb DEFAULT NULL,
  naam text DEFAULT NULL,
  email text DEFAULT NULL,
  telefoon text DEFAULT NULL,
  bedrijfsnaam text DEFAULT NULL,
  status text DEFAULT 'nieuw',
  notities text DEFAULT NULL,
  lead_id uuid REFERENCES public.leads(id) ON DELETE SET NULL DEFAULT NULL
);

ALTER TABLE public.moodboard_results ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can insert moodboard results"
ON public.moodboard_results
FOR INSERT
TO anon, authenticated
WITH CHECK (true);

CREATE POLICY "Admins can manage moodboard results"
ON public.moodboard_results
FOR ALL
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));
