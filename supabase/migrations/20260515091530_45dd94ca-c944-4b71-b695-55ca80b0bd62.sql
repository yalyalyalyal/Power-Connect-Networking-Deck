
-- Public users table (mirrors auth.users emails)
create table public.users (
  id uuid primary key references auth.users(id) on delete cascade,
  email text not null,
  created_at timestamptz not null default now()
);
alter table public.users enable row level security;
create policy "users_select_own" on public.users for select to authenticated using (auth.uid() = id);

-- Auto-insert into public.users on signup
create or replace function public.handle_new_user()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  insert into public.users (id, email) values (new.id, new.email)
  on conflict (id) do nothing;
  return new;
end; $$;
create trigger on_auth_user_created after insert on auth.users
for each row execute function public.handle_new_user();

-- Bookmarks
create table public.bookmarks (
  user_id uuid not null references auth.users(id) on delete cascade,
  profile_id text not null,
  created_at timestamptz not null default now(),
  primary key (user_id, profile_id)
);
alter table public.bookmarks enable row level security;
create policy "bm_select_own" on public.bookmarks for select to authenticated using (auth.uid() = user_id);
create policy "bm_insert_own" on public.bookmarks for insert to authenticated with check (auth.uid() = user_id);
create policy "bm_delete_own" on public.bookmarks for delete to authenticated using (auth.uid() = user_id);

-- Rejections
create table public.rejections (
  user_id uuid not null references auth.users(id) on delete cascade,
  profile_id text not null,
  created_at timestamptz not null default now(),
  primary key (user_id, profile_id)
);
alter table public.rejections enable row level security;
create policy "rj_select_own" on public.rejections for select to authenticated using (auth.uid() = user_id);
create policy "rj_insert_own" on public.rejections for insert to authenticated with check (auth.uid() = user_id);
create policy "rj_delete_own" on public.rejections for delete to authenticated using (auth.uid() = user_id);
