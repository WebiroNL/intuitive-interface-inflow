-- Maak email optioneel en voeg nieuwe velden toe
ALTER TABLE public.clients
  ALTER COLUMN email DROP NOT NULL,
  ADD COLUMN IF NOT EXISTS first_name text,
  ADD COLUMN IF NOT EXISTS last_name text,
  ADD COLUMN IF NOT EXISTS address_street text,
  ADD COLUMN IF NOT EXISTS address_postal text,
  ADD COLUMN IF NOT EXISTS address_city text,
  ADD COLUMN IF NOT EXISTS address_country text DEFAULT 'NL',
  ADD COLUMN IF NOT EXISTS activation_token text,
  ADD COLUMN IF NOT EXISTS activation_expires_at timestamptz,
  ADD COLUMN IF NOT EXISTS activated_at timestamptz;

-- Unieke index op activation_token (alleen waar token bestaat)
CREATE UNIQUE INDEX IF NOT EXISTS clients_activation_token_uniq
  ON public.clients(activation_token)
  WHERE activation_token IS NOT NULL;

-- Unieke index op telefoon (alleen waar telefoon bestaat)
CREATE UNIQUE INDEX IF NOT EXISTS clients_phone_uniq
  ON public.clients(phone)
  WHERE phone IS NOT NULL AND phone <> '';

-- Index voor email lookup
CREATE INDEX IF NOT EXISTS clients_email_idx
  ON public.clients(lower(email))
  WHERE email IS NOT NULL AND email <> '';
