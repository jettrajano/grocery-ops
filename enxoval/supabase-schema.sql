-- Enxoval em Conta: sincronização privada por grupo familiar.
-- Execute este arquivo uma vez no SQL Editor do projeto Supabase.
begin;

create table if not exists public.enxoval_households (
  id uuid primary key default gen_random_uuid(),
  name text not null default 'Enxoval da família',
  owner_id uuid not null unique references auth.users(id) on delete cascade,
  created_at timestamptz not null default now()
);

create table if not exists public.enxoval_household_members (
  household_id uuid not null references public.enxoval_households(id) on delete cascade,
  user_id uuid not null unique references auth.users(id) on delete cascade,
  role text not null check (role in ('owner', 'member')),
  created_at timestamptz not null default now(),
  primary key (household_id, user_id)
);

create table if not exists public.enxoval_products (
  household_id uuid not null references public.enxoval_households(id) on delete cascade,
  id text not null,
  name text not null check (length(name) between 1 and 100),
  category text not null default 'Outros' check (length(category) <= 40),
  priority text not null default 'Baixa' check (priority in ('Alta', 'Média', 'Baixa')),
  target_week integer check (target_week is null or target_week > 0),
  responsible text not null default '' check (length(responsible) <= 40),
  preferred_store text not null default '' check (length(preferred_store) <= 80),
  product_link text not null default '' check (length(product_link) <= 1000),
  reference_price numeric(12,2) check (reference_price is null or reference_price > 0),
  custom boolean not null default false,
  updated_at timestamptz not null default now(),
  primary key (household_id, id)
);

create table if not exists public.enxoval_observations (
  household_id uuid not null,
  id text not null,
  product_id text not null,
  store text not null check (length(store) between 1 and 80),
  price numeric(12,2) not null check (price > 0),
  source text not null default '' check (length(source) <= 80),
  link text not null default '' check (length(link) <= 1000),
  notes text not null default '' check (length(notes) <= 160),
  observed_at timestamptz not null,
  updated_at timestamptz not null default now(),
  is_deleted boolean not null default false,
  primary key (household_id, id),
  constraint enxoval_observations_product_fk
    foreign key (household_id, product_id)
    references public.enxoval_products (household_id, id)
    on delete cascade
);

create index if not exists enxoval_products_household_name_idx
  on public.enxoval_products (household_id, name);
create index if not exists enxoval_observations_household_product_date_idx
  on public.enxoval_observations (household_id, product_id, observed_at desc);

create or replace function public.is_enxoval_household_member(target_household_id uuid)
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1
    from public.enxoval_household_members as member
    where member.household_id = target_household_id
      and member.user_id = auth.uid()
  );
$$;

create or replace function public.is_enxoval_household_owner()
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1
    from public.enxoval_household_members as member
    where member.user_id = auth.uid()
      and member.role = 'owner'
  );
$$;

create or replace function public.ensure_enxoval_household()
returns uuid
language plpgsql
security definer
set search_path = pg_catalog, public
as $$
declare
  current_user_id uuid := auth.uid();
  current_household_id uuid;
begin
  if current_user_id is null then
    raise exception 'Authentication required' using errcode = '28000';
  end if;

  select member.household_id
    into current_household_id
    from public.enxoval_household_members as member
    where member.user_id = current_user_id
    limit 1;

  if current_household_id is not null then
    return current_household_id;
  end if;

  -- Only the first account can create the family. Other accounts must be linked by its owner.
  perform pg_catalog.pg_advisory_xact_lock(721045001);

  select member.household_id
    into current_household_id
    from public.enxoval_household_members as member
    where member.user_id = current_user_id
    limit 1;

  if current_household_id is not null then
    return current_household_id;
  end if;

  if exists (select 1 from public.enxoval_households) then
    raise exception 'This account has not been linked to the family list yet' using errcode = '42501';
  end if;

  insert into public.enxoval_households (name, owner_id)
    values ('Enxoval da família', current_user_id)
    returning id into current_household_id;

  insert into public.enxoval_household_members (household_id, user_id, role)
    values (current_household_id, current_user_id, 'owner');

  return current_household_id;
end;
$$;

-- Only the family owner can link an already confirmed Auth account by its email.
create or replace function public.add_enxoval_household_member_by_email(target_email text)
returns void
language plpgsql
security definer
set search_path = pg_catalog, public, auth
as $$
declare
  current_user_id uuid := auth.uid();
  current_household_id uuid;
  target_user_id uuid;
  existing_household_id uuid;
  normalized_email text := lower(btrim(coalesce(target_email, '')));
begin
  if current_user_id is null then
    raise exception 'Authentication required' using errcode = '28000';
  end if;
  if normalized_email = '' or length(normalized_email) > 254 then
    raise exception 'Enter a valid email address' using errcode = '22023';
  end if;

  select member.household_id
    into current_household_id
    from public.enxoval_household_members as member
    where member.user_id = current_user_id
      and member.role = 'owner'
    limit 1;

  if current_household_id is null then
    raise exception 'Only the family owner can link accounts' using errcode = '42501';
  end if;

  select account.id
    into target_user_id
    from auth.users as account
    where lower(account.email) = normalized_email
      and account.email_confirmed_at is not null
    limit 1;

  if target_user_id is null then
    raise exception 'Nenhuma conta confirmada foi encontrada para esse e-mail' using errcode = 'P0001';
  end if;
  if target_user_id = current_user_id then
    raise exception 'A conta do responsável já tem acesso' using errcode = 'P0001';
  end if;

  select member.household_id
    into existing_household_id
    from public.enxoval_household_members as member
    where member.user_id = target_user_id
    limit 1;

  if existing_household_id = current_household_id then
    raise exception 'Essa conta já faz parte da lista' using errcode = 'P0001';
  end if;
  if existing_household_id is not null then
    raise exception 'Essa conta já está vinculada a outra lista familiar' using errcode = 'P0001';
  end if;

  insert into public.enxoval_household_members (household_id, user_id, role)
    values (current_household_id, target_user_id, 'member');
end;
$$;

-- Remove the earlier UUID-based helper so the owner links accounts by email through the app.
drop function if exists public.add_enxoval_household_member(uuid);

alter table public.enxoval_households enable row level security;
alter table public.enxoval_household_members enable row level security;
alter table public.enxoval_products enable row level security;
alter table public.enxoval_observations enable row level security;

drop policy if exists enxoval_household_read_member on public.enxoval_households;
create policy enxoval_household_read_member
  on public.enxoval_households for select to authenticated
  using (public.is_enxoval_household_member(id));

drop policy if exists enxoval_members_read_self on public.enxoval_household_members;
create policy enxoval_members_read_self
  on public.enxoval_household_members for select to authenticated
  using (user_id = (select auth.uid()));

drop policy if exists enxoval_products_member_access on public.enxoval_products;
create policy enxoval_products_member_access
  on public.enxoval_products for all to authenticated
  using (public.is_enxoval_household_member(household_id))
  with check (public.is_enxoval_household_member(household_id));

drop policy if exists enxoval_observations_member_access on public.enxoval_observations;
create policy enxoval_observations_member_access
  on public.enxoval_observations for all to authenticated
  using (public.is_enxoval_household_member(household_id))
  with check (public.is_enxoval_household_member(household_id));

revoke all on table public.enxoval_households from public, anon, authenticated;
revoke all on table public.enxoval_household_members from public, anon, authenticated;
revoke all on table public.enxoval_products from public, anon, authenticated;
revoke all on table public.enxoval_observations from public, anon, authenticated;

grant usage on schema public to authenticated;
grant select on table public.enxoval_households to authenticated;
grant select on table public.enxoval_household_members to authenticated;
grant select, insert, update, delete on table public.enxoval_products to authenticated;
grant select, insert, update, delete on table public.enxoval_observations to authenticated;

revoke all on function public.is_enxoval_household_member(uuid) from public, anon;
revoke all on function public.ensure_enxoval_household() from public, anon;
revoke all on function public.is_enxoval_household_owner() from public, anon;
revoke all on function public.add_enxoval_household_member_by_email(text) from public, anon;
grant execute on function public.is_enxoval_household_member(uuid) to authenticated;
grant execute on function public.ensure_enxoval_household() to authenticated;
grant execute on function public.is_enxoval_household_owner() to authenticated;
grant execute on function public.add_enxoval_household_member_by_email(text) to authenticated;

do $$
begin
  if exists (select 1 from pg_publication where pubname = 'supabase_realtime') then
    if not exists (
      select 1 from pg_publication_tables
      where pubname = 'supabase_realtime' and schemaname = 'public' and tablename = 'enxoval_products'
    ) then
      execute 'alter publication supabase_realtime add table public.enxoval_products';
    end if;
    if not exists (
      select 1 from pg_publication_tables
      where pubname = 'supabase_realtime' and schemaname = 'public' and tablename = 'enxoval_observations'
    ) then
      execute 'alter publication supabase_realtime add table public.enxoval_observations';
    end if;
  end if;
end
$$;

commit;
