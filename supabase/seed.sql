-- ─────────────────────────────────────────────────────────────────────────────
-- supabase/seed.sql
-- Seed script for Praxis OS Database.
-- ─────────────────────────────────────────────────────────────────────────────

-- 1. Profiles Table
CREATE TABLE IF NOT EXISTS public.profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  username text UNIQUE,
  role text,
  level integer DEFAULT 1,
  total_xp integer DEFAULT 0,
  onboarding_completed boolean DEFAULT false,
  os_tutorial_completed boolean DEFAULT false,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now()
);

-- 2. Scenarios Table
CREATE TABLE IF NOT EXISTS public.scenarios (
  id text PRIMARY KEY,
  slug text UNIQUE,
  title text NOT NULL,
  description text,
  story jsonb,
  type text,
  category text,
  difficulty text,
  estimated_duration_minutes integer,
  tags text[],
  ticket jsonb,
  repo_initial jsonb,
  checkpoints jsonb,
  events jsonb,
  ai_team jsonb,
  debrief jsonb,
  environment_config jsonb,
  is_published boolean DEFAULT false,
  version integer DEFAULT 1,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now()
);

-- 3. Scenario Progress Table
CREATE TABLE IF NOT EXISTS public.scenario_progress (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  scenario_id text REFERENCES public.scenarios(id) ON DELETE CASCADE,
  status text DEFAULT 'not_started',
  started_at timestamp with time zone DEFAULT now(),
  completed_at timestamp with time zone,
  checkpoints_passed text[] DEFAULT '{}',
  current_checkpoint_id text,
  current_code_state jsonb DEFAULT '{}',
  xp_earned integer DEFAULT 0,
  debrief_data jsonb DEFAULT '{}',
  UNIQUE(user_id, scenario_id)
);

-- RLS (Basic)
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.scenarios ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.scenario_progress ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own profile" ON public.profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update their own profile" ON public.profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Anyone can view published scenarios" ON public.scenarios FOR SELECT USING (is_published = true);
CREATE POLICY "Users can view their own progress" ON public.scenario_progress FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own progress" ON public.scenario_progress FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own progress" ON public.scenario_progress FOR UPDATE USING (auth.uid() = user_id);

-- Sample Scenario (SCN-008 - Modernizing Praxis OS)
INSERT INTO public.scenarios (id, slug, title, description, type, category, difficulty, estimated_duration_minutes, is_published)
VALUES (
  'SCN-008',
  'modernizing-praxis-os',
  'Modernizing Praxis OS Architecture',
  'The current Praxis OS shell is starting to feel its age. Your mission is to transition the state management to a unified store-driven architecture and enforce strict type safety across the shell components.',
  'complex',
  'frontend',
  'intermediate',
  45,
  true
) ON CONFLICT (id) DO NOTHING;
