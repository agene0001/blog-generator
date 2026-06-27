-- blog-creator2 schema. Run this in the Supabase SQL editor (or via the CLI).
-- Safe to run more than once.

-- ---------- posts table ----------
create table if not exists public.posts (
    id         uuid primary key default gen_random_uuid(),
    user_id    uuid not null references auth.users (id) on delete cascade,
    title      text,
    prompt     text,
    content    text not null,
    image_url  text,
    created_at timestamptz not null default now()
);

create index if not exists posts_user_id_created_at_idx
    on public.posts (user_id, created_at desc);

alter table public.posts enable row level security;

drop policy if exists "select own posts" on public.posts;
create policy "select own posts" on public.posts
    for select to authenticated using (auth.uid() = user_id);

drop policy if exists "insert own posts" on public.posts;
create policy "insert own posts" on public.posts
    for insert to authenticated with check (auth.uid() = user_id);

drop policy if exists "delete own posts" on public.posts;
create policy "delete own posts" on public.posts
    for delete to authenticated using (auth.uid() = user_id);

-- ---------- image storage ----------
insert into storage.buckets (id, name, public)
values ('blog-images', 'blog-images', true)
on conflict (id) do nothing;

drop policy if exists "public read blog images" on storage.objects;
create policy "public read blog images" on storage.objects
    for select using (bucket_id = 'blog-images');

-- Authenticated users may upload only into their own "<user_id>/..." folder.
drop policy if exists "users upload own blog images" on storage.objects;
create policy "users upload own blog images" on storage.objects
    for insert to authenticated
    with check (
        bucket_id = 'blog-images'
        and (storage.foldername(name))[1] = auth.uid()::text
    );
