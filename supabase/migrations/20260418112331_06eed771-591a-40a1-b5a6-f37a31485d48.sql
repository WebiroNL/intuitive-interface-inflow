ALTER TABLE public.clients
  ADD COLUMN IF NOT EXISTS visible_menus jsonb NOT NULL DEFAULT '["__all__"]'::jsonb;

UPDATE public.clients
  SET visible_menus = '["__all__"]'::jsonb
  WHERE visible_menus IS NULL OR jsonb_typeof(visible_menus) <> 'array';