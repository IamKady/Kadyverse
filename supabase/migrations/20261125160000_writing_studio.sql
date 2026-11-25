create extension if not exists pgcrypto;

create table if not exists public.studio_owner (
  singleton boolean primary key default true check (singleton),
  owner_id uuid not null unique references auth.users (id) on delete cascade
);

alter table public.studio_owner enable row level security;
revoke all on public.studio_owner from anon, authenticated;
grant select on public.studio_owner to authenticated;
grant select on public.studio_owner to anon;

create policy "Owner can read own studio membership"
  on public.studio_owner for select to authenticated
  using (owner_id = (select auth.uid()));

create table if not exists public.writing_entries (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null references auth.users (id) on delete cascade,
  slug text not null,
  title text not null default '',
  subtitle text not null default '',
  content text not null default '',
  excerpt text not null default '',
  dimension text not null default 'The Journey'
    check (dimension in ('The Mind', 'The Heart', 'The World', 'The Imagination', 'The Journey')),
  tags text[] not null default '{}',
  entry_date date not null default current_date,
  cover_image_url text not null default ''
    check (cover_image_url = '' or cover_image_url ~* '^https?://[^[:space:]]+$'),
  published boolean not null default false,
  published_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (owner_id, slug)
);

alter table public.writing_entries enable row level security;
revoke all on public.writing_entries from anon, authenticated;
grant select on public.writing_entries to anon, authenticated;
grant insert, update, delete on public.writing_entries to authenticated;

create policy "Published writing is public and all owner writing is private"
  on public.writing_entries for select to anon, authenticated
  using (
    published
    or (
      owner_id = (select auth.uid())
      and exists (
        select 1 from public.studio_owner
        where studio_owner.owner_id = (select auth.uid())
      )
    )
  );

create policy "Only the studio owner can create writing"
  on public.writing_entries for insert to authenticated
  with check (
    owner_id = (select auth.uid())
    and exists (
      select 1 from public.studio_owner
      where studio_owner.owner_id = (select auth.uid())
    )
  );

create policy "Only the studio owner can edit writing"
  on public.writing_entries for update to authenticated
  using (
    owner_id = (select auth.uid())
    and exists (
      select 1 from public.studio_owner
      where studio_owner.owner_id = (select auth.uid())
    )
  )
  with check (
    owner_id = (select auth.uid())
    and exists (
      select 1 from public.studio_owner
      where studio_owner.owner_id = (select auth.uid())
    )
  );

create policy "Only the studio owner can delete writing"
  on public.writing_entries for delete to authenticated
  using (
    owner_id = (select auth.uid())
    and exists (
      select 1 from public.studio_owner
      where studio_owner.owner_id = (select auth.uid())
    )
  );

create table if not exists public.writing_revisions (
  id bigint generated always as identity primary key,
  entry_id uuid not null references public.writing_entries (id) on delete cascade,
  owner_id uuid not null references auth.users (id) on delete cascade,
  snapshot jsonb not null,
  created_at timestamptz not null default now()
);

alter table public.writing_revisions enable row level security;
revoke all on public.writing_revisions from anon, authenticated;
grant select on public.writing_revisions to authenticated;

create policy "Only the studio owner can read writing history"
  on public.writing_revisions for select to authenticated
  using (
    owner_id = (select auth.uid())
    and exists (
      select 1 from public.studio_owner
      where studio_owner.owner_id = (select auth.uid())
    )
  );

create or replace function public.touch_writing_entry()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  new.updated_at := now();
  return new;
end;
$$;

create trigger writing_entries_touch_updated_at
  before update on public.writing_entries
  for each row execute function public.touch_writing_entry();

create or replace function public.capture_writing_revision()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  insert into public.writing_revisions (entry_id, owner_id, snapshot)
  values (old.id, old.owner_id, to_jsonb(old));
  return new;
end;
$$;

revoke all on function public.capture_writing_revision() from public, anon, authenticated;

create trigger writing_entries_capture_revision
  before update on public.writing_entries
  for each row execute function public.capture_writing_revision();
