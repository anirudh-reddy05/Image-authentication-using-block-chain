CREATE TABLE public.certificates (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  analysis_id UUID REFERENCES public.analyses(id) ON DELETE CASCADE NOT NULL,
  file_name TEXT NOT NULL,
  hash TEXT NOT NULL,
  truth_score INTEGER NOT NULL,
  verdict TEXT NOT NULL,
  certificate_data JSONB NOT NULL DEFAULT '{}'::jsonb,
  blockchain_tx TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.certificates ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public insert on certificates" ON public.certificates FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public read on certificates" ON public.certificates FOR SELECT USING (true);

ALTER PUBLICATION supabase_realtime ADD TABLE public.certificates;