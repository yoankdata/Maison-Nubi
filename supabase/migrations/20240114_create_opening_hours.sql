-- Création de la table des horaires
create table if not exists public.opening_hours (
  id uuid default gen_random_uuid() primary key,
  profile_id uuid references public.profiles(id) on delete cascade not null,
  day_of_week integer not null check (day_of_week between 0 and 6), -- 0=Dimanche, 1=Lundi, ...
  open_time time,
  close_time time,
  is_closed boolean default false,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  
  -- Contrainte d'unicité : un seul créneau par jour par profil (pour simplifier v1)
  constraint opening_hours_profile_day_key unique(profile_id, day_of_week)
);

-- Activation RLS
alter table public.opening_hours enable row level security;

-- Politiques de sécurité
create policy "Horaires visibles par tous"
  on public.opening_hours for select
  using (true);

create policy "Modification uniquement par le propriétaire du profil"
  on public.opening_hours for all
  using (auth.uid() = profile_id);

-- Index pour les perfs
create index opening_hours_profile_id_idx on public.opening_hours(profile_id);
