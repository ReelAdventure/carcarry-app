-- ============================================
-- CarCarry — Schéma Supabase V1
-- Conciergerie Automobile
-- ============================================

-- Profiles (extension de auth.users)
CREATE TABLE public.profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  role TEXT NOT NULL CHECK (role IN ('client', 'carcarry_admin', 'carcarry_team', 'partner')) DEFAULT 'client',
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  phone TEXT,
  email TEXT,
  address TEXT,
  city TEXT,
  postal_code TEXT,
  canton TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own profile" ON profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "CarCarry team can view all profiles" ON profiles FOR SELECT USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('carcarry_admin', 'carcarry_team'))
);

-- Vehicles
CREATE TABLE public.vehicles (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  owner_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  make TEXT NOT NULL,
  model TEXT NOT NULL,
  version TEXT,
  year INTEGER NOT NULL,
  vin TEXT,
  license_plate TEXT NOT NULL,
  mileage INTEGER DEFAULT 0,
  color TEXT,
  fuel_type TEXT CHECK (fuel_type IN ('essence', 'diesel', 'hybride', 'electrique', 'gpl', 'autre')),
  transmission TEXT CHECK (transmission IN ('manuelle', 'automatique', 'semi-automatique')),
  purchase_date DATE,
  last_service_date DATE,
  next_service_date DATE,
  last_mfk_date DATE,
  next_mfk_date DATE,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.vehicles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Owners can view own vehicles" ON vehicles FOR SELECT USING (auth.uid() = owner_id);
CREATE POLICY "Owners can insert vehicles" ON vehicles FOR INSERT WITH CHECK (auth.uid() = owner_id);
CREATE POLICY "Owners can update own vehicles" ON vehicles FOR UPDATE USING (auth.uid() = owner_id);
CREATE POLICY "Team can view all vehicles" ON vehicles FOR SELECT USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('carcarry_admin', 'carcarry_team'))
);

-- Vehicle documents
CREATE TABLE public.vehicle_documents (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  vehicle_id UUID REFERENCES public.vehicles(id) ON DELETE CASCADE NOT NULL,
  document_type TEXT NOT NULL,
  file_url TEXT NOT NULL,
  file_name TEXT NOT NULL,
  uploaded_at TIMESTAMPTZ DEFAULT NOW()
);

-- Service requests
CREATE TABLE public.service_requests (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  client_id UUID REFERENCES public.profiles(id) NOT NULL,
  vehicle_id UUID REFERENCES public.vehicles(id) NOT NULL,
  category TEXT NOT NULL CHECK (category IN ('entretien','reparation','pneus','mfk','nettoyage','carrosserie','transport','sinistre','autre')),
  urgency TEXT NOT NULL CHECK (urgency IN ('basse','normale','haute','urgente')) DEFAULT 'normale',
  status TEXT NOT NULL CHECK (status IN ('nouveau','analyse','devis_en_cours','en_attente_client','planifie','pris_en_charge','intervention_en_cours','termine','annule')) DEFAULT 'nouveau',
  title TEXT NOT NULL,
  description TEXT,
  preferred_dates TEXT[],
  preferred_location TEXT,
  pickup_needed BOOLEAN DEFAULT FALSE,
  replacement_vehicle_needed BOOLEAN DEFAULT FALSE,
  assigned_team_member UUID REFERENCES public.profiles(id),
  assigned_partner_id UUID REFERENCES public.partners(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.service_requests ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Clients can view own requests" ON service_requests FOR SELECT USING (auth.uid() = client_id);
CREATE POLICY "Clients can insert requests" ON service_requests FOR INSERT WITH CHECK (auth.uid() = client_id);
CREATE POLICY "Team can view all requests" ON service_requests FOR ALL USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('carcarry_admin', 'carcarry_team'))
);

-- Request photos
CREATE TABLE public.request_photos (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  request_id UUID REFERENCES public.service_requests(id) ON DELETE CASCADE NOT NULL,
  file_url TEXT NOT NULL,
  uploaded_at TIMESTAMPTZ DEFAULT NOW()
);

-- Partners
CREATE TABLE public.partners (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('garage','pneumatique','carrosserie','detailing','depannage','transport')),
  contact_name TEXT,
  phone TEXT,
  email TEXT,
  address TEXT,
  city TEXT,
  postal_code TEXT,
  canton TEXT,
  coverage_area TEXT,
  internal_notes TEXT,
  average_delay_days INTEGER,
  quality_score DECIMAL(3,1),
  missions_count INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.partners ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Team can manage partners" ON partners FOR ALL USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('carcarry_admin', 'carcarry_team'))
);

-- Partner quotes
CREATE TABLE public.partner_quotes (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  request_id UUID REFERENCES public.service_requests(id) ON DELETE CASCADE NOT NULL,
  partner_id UUID REFERENCES public.partners(id) NOT NULL,
  amount DECIMAL(10,2) NOT NULL,
  currency TEXT DEFAULT 'CHF',
  description TEXT,
  estimated_duration TEXT,
  status TEXT CHECK (status IN ('en_attente','accepte','refuse')) DEFAULT 'en_attente',
  document_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Interventions
CREATE TABLE public.interventions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  request_id UUID REFERENCES public.service_requests(id) NOT NULL,
  vehicle_id UUID REFERENCES public.vehicles(id) NOT NULL,
  partner_id UUID REFERENCES public.partners(id),
  start_date TIMESTAMPTZ,
  end_date TIMESTAMPTZ,
  status TEXT CHECK (status IN ('planifie','en_cours','termine','annule')) DEFAULT 'planifie',
  final_cost DECIMAL(10,2),
  summary TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Intervention documents
CREATE TABLE public.intervention_documents (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  intervention_id UUID REFERENCES public.interventions(id) ON DELETE CASCADE NOT NULL,
  document_type TEXT NOT NULL,
  file_url TEXT NOT NULL,
  file_name TEXT NOT NULL,
  uploaded_at TIMESTAMPTZ DEFAULT NOW()
);

-- Notifications
CREATE TABLE public.notifications (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  type TEXT CHECK (type IN ('info','success','warning','error')) DEFAULT 'info',
  read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users see own notifications" ON notifications FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can update own notifications" ON notifications FOR UPDATE USING (auth.uid() = user_id);

-- Activity logs
CREATE TABLE public.activity_logs (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id),
  entity_type TEXT NOT NULL,
  entity_id UUID NOT NULL,
  action TEXT NOT NULL,
  details TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Trigger: auto-create profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, first_name, last_name)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'first_name', ''),
    COALESCE(NEW.raw_user_meta_data->>'last_name', '')
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Trigger: auto-update updated_at on service_requests
CREATE OR REPLACE FUNCTION public.update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER service_requests_updated_at
  BEFORE UPDATE ON public.service_requests
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();
