-- Voer dit uit in de Supabase SQL editor van je project.

create table if not exists profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  volledige_naam text,
  role text not null default 'student' check (role in ('student', 'admin')),
  created_at timestamptz not null default now()
);

create table if not exists courses (
  id uuid primary key default gen_random_uuid(),
  titel text not null,
  beschrijving text,
  prijs_cent integer not null default 0, -- prijs in eurocenten
  afbeelding_url text,
  gepubliceerd boolean not null default false,
  created_at timestamptz not null default now()
);

create table if not exists lessons (
  id uuid primary key default gen_random_uuid(),
  course_id uuid not null references courses(id) on delete cascade,
  titel text not null,
  volgorde integer not null default 0,
  cloudflare_video_uid text not null, -- video-ID uit Cloudflare Stream
  duur_seconden integer,
  gratis_preview boolean not null default false,
  created_at timestamptz not null default now()
);

create table if not exists enrollments (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  course_id uuid not null references courses(id) on delete cascade,
  stripe_payment_id text,
  created_at timestamptz not null default now(),
  unique (user_id, course_id)
);

create table if not exists lesson_progress (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  lesson_id uuid not null references lessons(id) on delete cascade,
  voltooid boolean not null default false,
  updated_at timestamptz not null default now(),
  unique (user_id, lesson_id)
);

-- Nieuwe gebruiker krijgt automatisch een profiel
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, volledige_naam)
  values (new.id, new.raw_user_meta_data ->> 'volledige_naam');
  return new;
end;
$$ language plpgsql security definer;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- Row Level Security
alter table profiles enable row level security;
alter table courses enable row level security;
alter table lessons enable row level security;
alter table enrollments enable row level security;
alter table lesson_progress enable row level security;

create policy "Profiel: eigen rij lezen" on profiles for select using (auth.uid() = id);
create policy "Profiel: eigen rij bijwerken" on profiles for update using (auth.uid() = id);

-- Beveiliging: voorkomt dat een gebruiker via de update-policy hierboven
-- zijn eigen 'role' naar 'admin' zet. Alleen wijzigingen via de service-role
-- key (bv. handmatig in Supabase, of vanuit een trusted server-route) mogen
-- de rol aanpassen.
create or replace function public.voorkom_zelf_promotie_tot_admin()
returns trigger as $$
begin
  if new.role is distinct from old.role and auth.role() <> 'service_role' then
    new.role := old.role;
  end if;
  return new;
end;
$$ language plpgsql security definer;

drop trigger if exists blokkeer_rol_wijziging on profiles;
create trigger blokkeer_rol_wijziging
  before update on profiles
  for each row execute procedure public.voorkom_zelf_promotie_tot_admin();

create policy "Cursussen: gepubliceerde cursussen zichtbaar" on courses
  for select using (gepubliceerd = true);

create policy "Lessen: zichtbaar bij gepubliceerde cursus" on lessons
  for select using (
    exists (select 1 from courses c where c.id = course_id and c.gepubliceerd = true)
  );

-- Admins mogen cursussen en lessen volledig beheren (toevoegen/bewerken/verwijderen),
-- ook al is de cursus nog niet gepubliceerd.
create policy "Cursussen: admins beheren" on courses
  for all
  using (exists (select 1 from profiles p where p.id = auth.uid() and p.role = 'admin'))
  with check (exists (select 1 from profiles p where p.id = auth.uid() and p.role = 'admin'));

create policy "Lessen: admins beheren" on lessons
  for all
  using (exists (select 1 from profiles p where p.id = auth.uid() and p.role = 'admin'))
  with check (exists (select 1 from profiles p where p.id = auth.uid() and p.role = 'admin'));

create policy "Inschrijvingen: eigen rijen" on enrollments
  for select using (auth.uid() = user_id);

create policy "Voortgang: eigen rijen lezen" on lesson_progress
  for select using (auth.uid() = user_id);
create policy "Voortgang: eigen rijen schrijven" on lesson_progress
  for insert with check (auth.uid() = user_id);
create policy "Voortgang: eigen rijen bijwerken" on lesson_progress
  for update using (auth.uid() = user_id);
