
CREATE TABLE public.analyses (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  file_name TEXT NOT NULL,
  hash TEXT NOT NULL,
  truth_score INTEGER NOT NULL,
  verdict TEXT NOT NULL CHECK (verdict IN ('authentic', 'suspicious', 'manipulated')),
  hash_match BOOLEAN NOT NULL DEFAULT false,
  metadata_flags JSONB DEFAULT '[]',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.analyses ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public read on analyses" ON public.analyses FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "Allow public insert on analyses" ON public.analyses FOR INSERT TO anon, authenticated WITH CHECK (true);
