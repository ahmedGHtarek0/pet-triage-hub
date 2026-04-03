
-- Patients table (combines owner + animal + medical case)
CREATE TABLE public.patients (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  owner_name TEXT NOT NULL,
  owner_phone TEXT NOT NULL,
  owner_national_id TEXT,
  animal_species TEXT NOT NULL DEFAULT 'Dog',
  animal_sex TEXT NOT NULL DEFAULT 'Male',
  animal_age TEXT,
  animal_weight TEXT,
  animal_diagnosis TEXT,
  case_category TEXT,
  case_type TEXT[] DEFAULT '{}',
  case_sub_type TEXT[] DEFAULT '{}',
  status TEXT NOT NULL DEFAULT 'Stable' CHECK (status IN ('Improving', 'Stable', 'Critical', 'Euthanized')),
  photos TEXT[] DEFAULT '{}',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Treatments table
CREATE TABLE public.treatments (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  patient_id UUID NOT NULL REFERENCES public.patients(id) ON DELETE CASCADE,
  date TEXT NOT NULL,
  staff TEXT,
  drugs TEXT[] DEFAULT '{}',
  times TEXT[] DEFAULT '{}',
  notes TEXT,
  photos TEXT[] DEFAULT '{}',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Vital signs table
CREATE TABLE public.vital_signs (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  patient_id UUID NOT NULL REFERENCES public.patients(id) ON DELETE CASCADE,
  date TEXT NOT NULL,
  time TEXT NOT NULL,
  temp TEXT,
  food TEXT,
  drink TEXT,
  urine TEXT,
  stool TEXT,
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Activity log
CREATE TABLE public.activity_log (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  patient_id UUID,
  action TEXT NOT NULL,
  details TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Site content (single row)
CREATE TABLE public.site_content (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  hero_title TEXT NOT NULL DEFAULT 'Pet Planet',
  hero_subtitle TEXT NOT NULL DEFAULT 'Veterinary Clinic',
  hero_video_url TEXT NOT NULL DEFAULT '/videos/hero-bg.mp4',
  about_text TEXT NOT NULL DEFAULT 'Welcome to Pet Planet Veterinary Clinic, led by Dr. Khaled Nasser. We provide comprehensive veterinary services with state-of-the-art facilities and compassionate care for your beloved pets.',
  about_images TEXT[] DEFAULT ARRAY['/images/doctor.jpg'],
  services JSONB NOT NULL DEFAULT '[
    {"title":"Treatment","description":"Advanced medical treatment for all conditions including viral infections, chronic diseases, and emergency care.","icon":"Heart","image":"/images/service-treatment.jpg"},
    {"title":"Surgery","description":"State-of-the-art surgical procedures from routine spaying/neutering to complex orthopedic operations.","icon":"Scissors","image":"/images/service-surgery.jpg"},
    {"title":"Vaccination","description":"Complete vaccination programs to protect your pets against common and dangerous diseases.","icon":"Syringe","image":"/images/service-vaccination.jpg"}
  ]',
  gallery JSONB NOT NULL DEFAULT '[
    {"type":"image","url":"/images/gallery-1.jpg"},
    {"type":"image","url":"/images/gallery-2.jpg"},
    {"type":"image","url":"/images/doctor.jpg"},
    {"type":"video","url":"/videos/gallery-1.mp4"},
    {"type":"video","url":"/videos/gallery-2.mp4"}
  ]',
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Create indexes
CREATE INDEX idx_treatments_patient ON public.treatments(patient_id);
CREATE INDEX idx_vital_signs_patient ON public.vital_signs(patient_id);
CREATE INDEX idx_activity_log_patient ON public.activity_log(patient_id);
CREATE INDEX idx_patients_phone ON public.patients(owner_phone);

-- Enable RLS on all tables
ALTER TABLE public.patients ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.treatments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.vital_signs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.activity_log ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.site_content ENABLE ROW LEVEL SECURITY;

-- Site content is publicly readable (it's the public website)
CREATE POLICY "Site content is publicly readable"
  ON public.site_content FOR SELECT
  USING (true);

-- All tables: allow full access via anon key (admin auth is handled in app code)
-- Patients
CREATE POLICY "Allow all access to patients"
  ON public.patients FOR ALL
  USING (true)
  WITH CHECK (true);

-- Treatments
CREATE POLICY "Allow all access to treatments"
  ON public.treatments FOR ALL
  USING (true)
  WITH CHECK (true);

-- Vital signs
CREATE POLICY "Allow all access to vital_signs"
  ON public.vital_signs FOR ALL
  USING (true)
  WITH CHECK (true);

-- Activity log
CREATE POLICY "Allow all access to activity_log"
  ON public.activity_log FOR ALL
  USING (true)
  WITH CHECK (true);

-- Site content write
CREATE POLICY "Allow all write to site_content"
  ON public.site_content FOR ALL
  USING (true)
  WITH CHECK (true);

-- Updated_at trigger function
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

CREATE TRIGGER update_patients_updated_at
  BEFORE UPDATE ON public.patients
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_site_content_updated_at
  BEFORE UPDATE ON public.site_content
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Insert default site content row
INSERT INTO public.site_content (hero_title, hero_subtitle, hero_video_url) VALUES ('Pet Planet', 'Veterinary Clinic', '/videos/hero-bg.mp4');

-- Insert default patients
INSERT INTO public.patients (owner_name, owner_phone, owner_national_id, animal_species, animal_sex, animal_age, animal_weight, animal_diagnosis, case_category, case_type, case_sub_type, status) VALUES
  ('Mahmoud Hefny', '01124783322', '281103XXXX', 'Dog', 'Female', '1.5', '', 'Vomiting case', 'Viral infection', ARRAY['Adeno Virus', 'Canine Distemper'], ARRAY['Glaucoma', 'Off food'], 'Euthanized'),
  ('Ahmed Ali', '01098765432', '290501XXXX', 'Cat', 'Male', '3', '4.5', 'Urinary blockage', 'Urinary', ARRAY['FLUTD'], ARRAY['Crystals', 'Straining'], 'Improving'),
  ('Sara Mohamed', '01234567890', '950812XXXX', 'Dog', 'Male', '5', '25', 'Fracture - hind leg', 'Orthopedic', ARRAY['Fracture'], ARRAY['Femur', 'Post-trauma'], 'Stable');
