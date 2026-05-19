
-- ENUMS
CREATE TYPE public.app_role AS ENUM ('super_admin','branch_manager','agent','driver','customer');
CREATE TYPE public.parcel_status AS ENUM ('registered','stored','in_transit','arrived_hub','ready_for_pickup','out_for_delivery','delivered','returned','lost');
CREATE TYPE public.parcel_category AS ENUM ('documents','electronics','clothing','food','fragile','medical','other');
CREATE TYPE public.lang AS ENUM ('en','am');

-- BRANCHES
CREATE TABLE public.branches (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  code TEXT NOT NULL UNIQUE,
  city TEXT NOT NULL,
  region TEXT NOT NULL,
  address TEXT,
  phone TEXT,
  lat NUMERIC,
  lng NUMERIC,
  capacity INT NOT NULL DEFAULT 1000,
  current_load INT NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- PROFILES
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT,
  phone TEXT,
  fan_number TEXT UNIQUE,
  language public.lang NOT NULL DEFAULT 'en',
  branch_id UUID REFERENCES public.branches(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- USER ROLES (separate for security)
CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role public.app_role NOT NULL,
  branch_id UUID REFERENCES public.branches(id),
  UNIQUE (user_id, role)
);

-- Security definer role checker
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role public.app_role)
RETURNS BOOLEAN LANGUAGE SQL STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT EXISTS (SELECT 1 FROM public.user_roles WHERE user_id=_user_id AND role=_role)
$$;

CREATE OR REPLACE FUNCTION public.is_staff(_user_id UUID)
RETURNS BOOLEAN LANGUAGE SQL STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id=_user_id AND role IN ('super_admin','branch_manager','agent','driver')
  )
$$;

-- PARCELS
CREATE TABLE public.parcels (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tracking_code TEXT NOT NULL UNIQUE,
  qr_token TEXT NOT NULL UNIQUE,
  secret_code TEXT NOT NULL,
  sender_id UUID REFERENCES auth.users(id),
  sender_name TEXT NOT NULL,
  sender_phone TEXT NOT NULL,
  receiver_name TEXT NOT NULL,
  receiver_phone TEXT NOT NULL,
  origin_branch_id UUID NOT NULL REFERENCES public.branches(id),
  destination_branch_id UUID NOT NULL REFERENCES public.branches(id),
  category public.parcel_category NOT NULL DEFAULT 'other',
  weight_kg NUMERIC NOT NULL DEFAULT 1,
  fragile BOOLEAN NOT NULL DEFAULT false,
  declared_value NUMERIC DEFAULT 0,
  price_etb NUMERIC NOT NULL DEFAULT 0,
  status public.parcel_status NOT NULL DEFAULT 'registered',
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  delivered_at TIMESTAMPTZ
);
CREATE INDEX ON public.parcels (status);
CREATE INDEX ON public.parcels (tracking_code);

-- TRACKING EVENTS
CREATE TABLE public.tracking_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  parcel_id UUID NOT NULL REFERENCES public.parcels(id) ON DELETE CASCADE,
  status public.parcel_status NOT NULL,
  branch_id UUID REFERENCES public.branches(id),
  note TEXT,
  actor_id UUID REFERENCES auth.users(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX ON public.tracking_events (parcel_id, created_at DESC);

-- VERIFICATIONS (audit)
CREATE TABLE public.verifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  parcel_id UUID NOT NULL REFERENCES public.parcels(id) ON DELETE CASCADE,
  agent_id UUID REFERENCES auth.users(id),
  qr_ok BOOLEAN NOT NULL,
  secret_ok BOOLEAN NOT NULL,
  released BOOLEAN NOT NULL DEFAULT false,
  ip TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ENABLE RLS
ALTER TABLE public.branches ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.parcels ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tracking_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.verifications ENABLE ROW LEVEL SECURITY;

-- POLICIES
-- Branches: public read (so anyone can pick origin/destination)
CREATE POLICY "branches readable" ON public.branches FOR SELECT USING (true);
CREATE POLICY "branches admin write" ON public.branches FOR ALL TO authenticated
  USING (public.has_role(auth.uid(),'super_admin'))
  WITH CHECK (public.has_role(auth.uid(),'super_admin'));

-- Profiles
CREATE POLICY "profiles self read" ON public.profiles FOR SELECT TO authenticated
  USING (auth.uid()=id OR public.is_staff(auth.uid()));
CREATE POLICY "profiles self update" ON public.profiles FOR UPDATE TO authenticated
  USING (auth.uid()=id) WITH CHECK (auth.uid()=id);
CREATE POLICY "profiles self insert" ON public.profiles FOR INSERT TO authenticated
  WITH CHECK (auth.uid()=id);

-- User roles
CREATE POLICY "roles self read" ON public.user_roles FOR SELECT TO authenticated
  USING (auth.uid()=user_id OR public.has_role(auth.uid(),'super_admin'));
CREATE POLICY "roles admin write" ON public.user_roles FOR ALL TO authenticated
  USING (public.has_role(auth.uid(),'super_admin'))
  WITH CHECK (public.has_role(auth.uid(),'super_admin'));

-- Parcels: customers see their own (as sender/receiver match), staff see all
CREATE POLICY "parcels owner read" ON public.parcels FOR SELECT TO authenticated
  USING (sender_id=auth.uid() OR public.is_staff(auth.uid()));
CREATE POLICY "parcels customer create" ON public.parcels FOR INSERT TO authenticated
  WITH CHECK (sender_id=auth.uid() OR public.is_staff(auth.uid()));
CREATE POLICY "parcels staff update" ON public.parcels FOR UPDATE TO authenticated
  USING (public.is_staff(auth.uid())) WITH CHECK (public.is_staff(auth.uid()));

-- Tracking events: anyone authenticated can read events for a parcel they can read; staff insert
CREATE POLICY "events read" ON public.tracking_events FOR SELECT TO authenticated
  USING (
    public.is_staff(auth.uid()) OR
    EXISTS (SELECT 1 FROM public.parcels p WHERE p.id=parcel_id AND p.sender_id=auth.uid())
  );
CREATE POLICY "events staff insert" ON public.tracking_events FOR INSERT TO authenticated
  WITH CHECK (public.is_staff(auth.uid()));

-- Verifications: staff only
CREATE POLICY "verif staff" ON public.verifications FOR ALL TO authenticated
  USING (public.is_staff(auth.uid())) WITH CHECK (public.is_staff(auth.uid()));

-- updated_at trigger
CREATE OR REPLACE FUNCTION public.tg_set_updated_at()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
BEGIN NEW.updated_at = now(); RETURN NEW; END $$;
CREATE TRIGGER parcels_updated BEFORE UPDATE ON public.parcels
  FOR EACH ROW EXECUTE FUNCTION public.tg_set_updated_at();

-- Auto-create profile + customer role on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, phone, fan_number, language)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'full_name', split_part(NEW.email,'@',1)),
    NEW.raw_user_meta_data->>'phone',
    'FAN-' || upper(substr(replace(NEW.id::text,'-',''),1,8)),
    COALESCE((NEW.raw_user_meta_data->>'language')::public.lang,'en')
  );
  INSERT INTO public.user_roles (user_id, role) VALUES (NEW.id,'customer');
  RETURN NEW;
END $$;

CREATE TRIGGER on_auth_user_created
AFTER INSERT ON auth.users
FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Realtime
ALTER PUBLICATION supabase_realtime ADD TABLE public.parcels;
ALTER PUBLICATION supabase_realtime ADD TABLE public.tracking_events;
ALTER TABLE public.parcels REPLICA IDENTITY FULL;
ALTER TABLE public.tracking_events REPLICA IDENTITY FULL;
