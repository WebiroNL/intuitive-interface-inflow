DELETE FROM public.website_intakes WHERE client_id NOT IN (SELECT id FROM public.clients);
DELETE FROM public.marketing_intakes WHERE client_id NOT IN (SELECT id FROM public.clients);
DELETE FROM public.service_onboardings WHERE client_id IS NOT NULL AND client_id NOT IN (SELECT id FROM public.clients);