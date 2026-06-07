ALTER TABLE public.showcase_items
ADD COLUMN IF NOT EXISTS preview_image_url TEXT,
ADD COLUMN IF NOT EXISTS preview_video_url TEXT;