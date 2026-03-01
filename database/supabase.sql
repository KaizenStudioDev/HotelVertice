-- Boutique Hotel Reservation System - Initial Schema

-- 1. Create Room Types
CREATE TABLE IF NOT EXISTS public.room_types (
    id SERIAL PRIMARY KEY,
    name VARCHAR(50) NOT NULL,
    description TEXT,
    base_price DECIMAL(10, 2) NOT NULL,
    capacity INT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Create Rooms
CREATE TABLE IF NOT EXISTS public.rooms (
    id SERIAL PRIMARY KEY,
    room_number VARCHAR(10) UNIQUE NOT NULL,
    type_id INT REFERENCES public.room_types(id),
    floor INT,
    view_type VARCHAR(50),
    status VARCHAR(20) DEFAULT 'available',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. Create Reservations
CREATE TABLE IF NOT EXISTS public.reservations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id),
    room_id INT REFERENCES public.rooms(id),
    check_in DATE NOT NULL,
    check_out DATE NOT NULL,
    status VARCHAR(20) DEFAULT 'confirmed',
    total_price DECIMAL(10, 2),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    CONSTRAINT date_check CHECK (check_out > check_in)
);

-- 4. Create Profiles Table (for user roles)
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    full_name TEXT,
    role VARCHAR(20) DEFAULT 'guest' CHECK (role IN ('guest', 'receptionist', 'admin')),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security (RLS)
ALTER TABLE public.room_types ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.rooms ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reservations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- --- POLICIES (Idempotent) ---

-- 1. Policies for room_types
DO $$ 
BEGIN
    DROP POLICY IF EXISTS "Public read room_types" ON public.room_types;
    CREATE POLICY "Public read room_types" ON public.room_types FOR SELECT USING (true);
END $$;

-- 2. Policies for rooms
DO $$ 
BEGIN
    DROP POLICY IF EXISTS "Public read rooms" ON public.rooms;
    CREATE POLICY "Public read rooms" ON public.rooms FOR SELECT USING (true);
END $$;

-- 3. Policies for reservations
DO $$ 
BEGIN
    DROP POLICY IF EXISTS "Users can view their own reservations" ON public.reservations;
    CREATE POLICY "Users can view their own reservations" ON public.reservations FOR SELECT USING (auth.uid() = user_id);

    DROP POLICY IF EXISTS "Users can create reservations" ON public.reservations;
    CREATE POLICY "Users can create reservations" ON public.reservations FOR INSERT WITH CHECK (auth.uid() = user_id);
END $$;

-- 4. Policies for profiles
DO $$ 
BEGIN
    DROP POLICY IF EXISTS "Public profiles are viewable by everyone" ON public.profiles;
    CREATE POLICY "Public profiles are viewable by everyone" ON public.profiles FOR SELECT USING (true);

    DROP POLICY IF EXISTS "Users can update their own profile" ON public.profiles;
    CREATE POLICY "Users can update their own profile" ON public.profiles FOR UPDATE USING (auth.uid() = id);
END $$;

-- --- TRIGGERS (Idempotent) ---

-- Function to create profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.profiles (id, full_name, role)
    VALUES (new.id, new.raw_user_meta_data->>'full_name', COALESCE(new.raw_user_meta_data->>'role', 'guest'));
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger logic
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'on_auth_user_created') THEN
        CREATE TRIGGER on_auth_user_created
            AFTER INSERT ON auth.users
            FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
    END IF;
END $$;

-- --- SEED DATA (Idempotent) ---
INSERT INTO public.room_types (name, description, base_price, capacity)
SELECT 'Estándar', 'Habitación cómoda con servicios básicos', 150000, 2
WHERE NOT EXISTS (SELECT 1 FROM public.room_types WHERE name = 'Estándar');

INSERT INTO public.room_types (name, description, base_price, capacity)
SELECT 'Suite', 'Habitación de lujo con vista al mar y minibar', 350000, 2
WHERE NOT EXISTS (SELECT 1 FROM public.room_types WHERE name = 'Suite');

INSERT INTO public.room_types (name, description, base_price, capacity)
SELECT 'Familiar', 'Habitación amplia para grupos o familias', 500000, 4
WHERE NOT EXISTS (SELECT 1 FROM public.room_types WHERE name = 'Familiar');
