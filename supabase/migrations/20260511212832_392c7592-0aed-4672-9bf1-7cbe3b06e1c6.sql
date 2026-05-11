
CREATE TABLE public.proposal_decisions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  slug TEXT NOT NULL UNIQUE,
  decision TEXT NOT NULL,
  name TEXT,
  decided_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  CONSTRAINT proposal_decisions_decision_check CHECK (decision IN ('accepted', 'declined'))
);

ALTER TABLE public.proposal_decisions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view proposal decisions"
ON public.proposal_decisions FOR SELECT
USING (true);

CREATE POLICY "Anyone can insert proposal decisions"
ON public.proposal_decisions FOR INSERT
WITH CHECK (true);

CREATE POLICY "Anyone can update proposal decisions"
ON public.proposal_decisions FOR UPDATE
USING (true);

CREATE POLICY "Anyone can delete proposal decisions"
ON public.proposal_decisions FOR DELETE
USING (true);

CREATE OR REPLACE FUNCTION public.update_proposal_decisions_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

CREATE TRIGGER update_proposal_decisions_updated_at
BEFORE UPDATE ON public.proposal_decisions
FOR EACH ROW
EXECUTE FUNCTION public.update_proposal_decisions_updated_at();
