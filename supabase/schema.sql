-- Librook – Supabase schema
-- Run this in the Supabase SQL editor after creating a project.

-- Books table: each row is one book owned by a user.
-- The full book object is stored in the `data` jsonb column to avoid
-- schema migrations when the client-side book shape evolves.
create table if not exists public.books (
  id        text        not null,
  user_id   uuid        references auth.users(id) on delete cascade not null,
  data      jsonb       not null default '{}',
  updated_at timestamptz default now(),
  primary key (user_id, id)
);

alter table public.books enable row level security;

create policy "Users manage own books"
  on public.books for all
  using  (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- Goals table: one row per user, stores the annual reading goal count.
create table if not exists public.goals (
  user_id    uuid    references auth.users(id) on delete cascade primary key,
  count      integer not null default 0,
  updated_at timestamptz default now()
);

alter table public.goals enable row level security;

create policy "Users manage own goal"
  on public.goals for all
  using  (auth.uid() = user_id)
  with check (auth.uid() = user_id);
