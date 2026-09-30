-- Perfiles, roles y compromiso de registro.
-- WhatsApp y teléfono viven en profile_direct_contacts para que RLS
-- pueda ocultarlos hasta un match aceptado. Las políticas de fila no
-- ocultan columnas.

create extension if not exists pgcrypto;

create type public.city as enum ('pereira', 'dosquebradas');
create type public.app_role as enum ('organizer', 'venue_sponsor', 'local_sponsor', 'moderator');
create type public.need_type as enum ('venue', 'products', 'food', 'equipment', 'services', 'diffusion');

create or replace function public.slugify(p_value text)
returns text
language plpgsql
immutable
as $$
declare
  v text;
begin
  v := lower(coalesce(p_value, ''));
  v := translate(v, 'áéíóúüñàèìòùäëïöâêîôãõç', 'aeiouunaeiouaeioaeioaoc');
  v := regexp_replace(v, '[^a-z0-9]+', '-', 'g');
  v := regexp_replace(v, '(^-+|-+$)', '', 'g');
  v := left(v, 60);
  if v = '' then
    v := 'perfil';
  end if;
  return v;
end;
$$;

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create table public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  display_name text not null check (char_length(display_name) between 2 and 80),
  slug text not null unique check (slug ~ '^[a-z0-9]+(?:-[a-z0-9]+)*$'),
  email text not null,
  instagram text check (instagram is null or char_length(instagram) between 1 and 100),
  website text check (website is null or website ~* '^https?://'),
  city public.city,
  contribution_types public.need_type[] not null default '{}',
  contribution_description text check (
    contribution_description is null or char_length(contribution_description) <= 2000
  ),
  disaffiliated_at timestamptz,
  hidden_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index profiles_city_idx on public.profiles (city);

create table public.profile_direct_contacts (
  profile_id uuid primary key references public.profiles (id) on delete cascade,
  whatsapp text check (whatsapp is null or whatsapp ~ '^\+?[0-9]{7,15}$'),
  phone text check (phone is null or phone ~ '^\+?[0-9]{7,15}$'),
  updated_at timestamptz not null default now()
);

create table public.profile_roles (
  profile_id uuid not null references public.profiles (id) on delete cascade,
  role public.app_role not null,
  created_at timestamptz not null default now(),
  primary key (profile_id, role)
);

create index profile_roles_profile_id_idx on public.profile_roles (profile_id);

create table public.registration_commitments (
  profile_id uuid primary key references public.profiles (id) on delete cascade,
  privacy_version text not null,
  commitment_version text not null,
  accepted_at timestamptz not null default now()
);

create or replace function public.is_moderator()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.profile_roles
    where profile_id = auth.uid()
      and role = 'moderator'
  );
$$;

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  v_name text;
begin
  v_name := coalesce(nullif(new.raw_user_meta_data ->> 'display_name', ''), split_part(new.email, '@', 1));
  if char_length(v_name) < 2 then
    v_name := 'Persona';
  end if;
  insert into public.profiles (id, display_name, slug, email)
  values (
    new.id,
    left(v_name, 80),
    public.slugify(v_name) || '-' || left(replace(new.id::text, '-', ''), 6),
    new.email
  );
  insert into public.profile_direct_contacts (profile_id) values (new.id);
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

create trigger profiles_updated_at
  before update on public.profiles
  for each row execute function public.set_updated_at();

create trigger direct_contacts_updated_at
  before update on public.profile_direct_contacts
  for each row execute function public.set_updated_at();

alter table public.profiles enable row level security;
alter table public.profiles force row level security;
alter table public.profile_direct_contacts enable row level security;
alter table public.profile_direct_contacts force row level security;
alter table public.profile_roles enable row level security;
alter table public.profile_roles force row level security;
alter table public.registration_commitments enable row level security;
alter table public.registration_commitments force row level security;

create policy profiles_select_anon on public.profiles
  for select to anon
  using (disaffiliated_at is null and hidden_at is null);

create policy profiles_select_auth on public.profiles
  for select to authenticated
  using (
    id = (select auth.uid())
    or (select public.is_moderator())
    or (disaffiliated_at is null and hidden_at is null)
  );

create or replace function public.protect_profile_governance()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  if not public.is_moderator() then
    new.disaffiliated_at := old.disaffiliated_at;
    new.hidden_at := old.hidden_at;
    new.id := old.id;
  end if;
  return new;
end;
$$;

create trigger profiles_protect_governance
  before update on public.profiles
  for each row execute function public.protect_profile_governance();

create policy profiles_update_own on public.profiles
  for update to authenticated
  using (id = (select auth.uid()) and disaffiliated_at is null)
  with check (id = (select auth.uid()));

-- La lectura tras un match aceptado se añade en 0004, cuando existe matches.
create policy direct_select on public.profile_direct_contacts
  for select to authenticated
  using (profile_id = (select auth.uid()) or (select public.is_moderator()));

create policy direct_update_own on public.profile_direct_contacts
  for update to authenticated
  using (profile_id = (select auth.uid()))
  with check (profile_id = (select auth.uid()));

create policy roles_select on public.profile_roles
  for select to anon, authenticated
  using (true);

create policy roles_insert_self on public.profile_roles
  for insert to authenticated
  with check (
    profile_id = (select auth.uid())
    and role in ('organizer', 'venue_sponsor', 'local_sponsor')
  );

create policy roles_delete_self on public.profile_roles
  for delete to authenticated
  using (
    profile_id = (select auth.uid())
    and role <> 'moderator'
  );

create policy commitment_select_own on public.registration_commitments
  for select to authenticated
  using (profile_id = (select auth.uid()) or (select public.is_moderator()));

create policy commitment_insert_own on public.registration_commitments
  for insert to authenticated
  with check (profile_id = (select auth.uid()));

grant select on public.profiles to anon, authenticated;
grant update on public.profiles to authenticated;
grant select, update on public.profile_direct_contacts to authenticated;
grant select on public.profile_roles to anon, authenticated;
grant insert, delete on public.profile_roles to authenticated;
grant select, insert on public.registration_commitments to authenticated;
grant execute on function public.is_moderator() to authenticated;
grant execute on function public.slugify(text) to anon, authenticated;
