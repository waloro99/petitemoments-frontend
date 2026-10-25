-- =====================================================================
-- Petite Moments GT · Esquema de base de datos (Supabase / Postgres)
-- Ejecutar en Supabase → SQL Editor. Es idempotente: puede correrse de nuevo.
-- =====================================================================

-- ---------------------------------------------------------------------
-- Tablas
-- ---------------------------------------------------------------------
create table if not exists public.categories (
  key         text primary key check (key ~ '^[a-z0-9-]+$'),
  label       text not null check (char_length(label) between 1 and 80),
  sort_order  int  not null default 0,
  created_at  timestamptz not null default now()
);

create table if not exists public.products (
  id              uuid primary key default gen_random_uuid(),
  slug            text not null unique check (slug ~ '^[a-z0-9-]+$'),
  name            text not null check (char_length(name) between 1 and 120),
  category_key    text not null references public.categories(key) on update cascade on delete restrict,
  occasions       text[] not null default '{}',
  styles          text[] not null default '{}',
  budget          text not null default 'cotizar' check (budget in ('economico','medio','premium','cotizar')),
  price_label     text not null default 'A cotizar',
  badge           text,
  blurb           text not null default '',
  long_desc       text not null default '',
  recomendado     text not null default '',
  incluye         text[] not null default '{}',
  personalizable  text[] not null default '{}',
  opcionales      text[] not null default '{}',
  tiempo          text not null default '',
  images          text[] not null default '{}',
  active          boolean not null default true,
  featured        boolean not null default false,
  sort_order      int not null default 0,
  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now()
);
create index if not exists products_category_idx on public.products(category_key);
create index if not exists products_active_sort_idx on public.products(active, sort_order);

create table if not exists public.gallery_items (
  id          uuid primary key default gen_random_uuid(),
  title       text not null check (char_length(title) between 1 and 120),
  occasion    text not null,
  product_id  uuid references public.products(id) on delete set null,
  image_url   text not null,
  height      int  not null default 250 check (height between 160 and 360),
  sort_order  int  not null default 0,
  created_at  timestamptz not null default now()
);
create index if not exists gallery_product_idx on public.gallery_items(product_id);

create table if not exists public.reviews (
  id          uuid primary key default gen_random_uuid(),
  product_id  uuid not null references public.products(id) on delete cascade,
  name        text not null check (char_length(name) between 1 and 60),
  stars       smallint not null check (stars between 1 and 5),
  body        text not null check (char_length(body) between 1 and 1200),
  status      text not null default 'pending' check (status in ('published','pending')),
  ip_hash     text,
  created_at  timestamptz not null default now()
);
create index if not exists reviews_product_status_idx on public.reviews(product_id, status);
create index if not exists reviews_ip_idx on public.reviews(ip_hash, created_at);

create table if not exists public.leads (
  id            uuid primary key default gen_random_uuid(),
  nombre        text not null,
  whatsapp      text not null,
  correo        text,
  fecha         date,
  hora          time,
  tipo          text not null,
  invitados     text,
  zona          text,
  lugar         text,
  servicio      text,
  estilo        text,
  presupuesto   text,
  comentarios   text,
  contacto      text,
  product_slug  text,
  status        text not null default 'nuevo' check (status in ('nuevo','contactado','cerrado')),
  ip_hash       text,
  created_at    timestamptz not null default now()
);
create index if not exists leads_created_idx on public.leads(created_at desc);
create index if not exists leads_ip_idx on public.leads(ip_hash, created_at);

-- Lista blanca de administradores (usuarios de Supabase Auth).
create table if not exists public.admin_users (
  user_id     uuid primary key references auth.users(id) on delete cascade,
  email       text,
  created_at  timestamptz not null default now()
);

-- ---------------------------------------------------------------------
-- Funciones y triggers
-- ---------------------------------------------------------------------
create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (select 1 from public.admin_users where user_id = auth.uid());
$$;

-- Regla de moderación aplicada en la base: al insertar, 4★+ se publica y <4 queda pendiente.
-- (Aprobar una pendiente es un UPDATE, que solo puede hacer un admin.)
create or replace function public.reviews_enforce_status()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  new.status := case when new.stars >= 4 then 'published' else 'pending' end;
  return new;
end;
$$;

drop trigger if exists reviews_enforce_status on public.reviews;
create trigger reviews_enforce_status
  before insert on public.reviews
  for each row execute function public.reviews_enforce_status();

create or replace function public.touch_updated_at()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  new.updated_at := now();
  return new;
end;
$$;

drop trigger if exists products_touch on public.products;
create trigger products_touch
  before update on public.products
  for each row execute function public.touch_updated_at();

-- ---------------------------------------------------------------------
-- Row Level Security
-- ---------------------------------------------------------------------
alter table public.categories    enable row level security;
alter table public.products      enable row level security;
alter table public.gallery_items enable row level security;
alter table public.reviews       enable row level security;
alter table public.leads         enable row level security;
alter table public.admin_users   enable row level security;

-- Categorías: lectura pública, escritura solo admin
drop policy if exists "categories_read" on public.categories;
create policy "categories_read" on public.categories for select using (true);
drop policy if exists "categories_admin" on public.categories;
create policy "categories_admin" on public.categories for all to authenticated
  using (public.is_admin()) with check (public.is_admin());

-- Productos: el público solo ve activos; admin ve y edita todo
drop policy if exists "products_read" on public.products;
create policy "products_read" on public.products for select using (active or public.is_admin());
drop policy if exists "products_admin" on public.products;
create policy "products_admin" on public.products for all to authenticated
  using (public.is_admin()) with check (public.is_admin());

-- Galería
drop policy if exists "gallery_read" on public.gallery_items;
create policy "gallery_read" on public.gallery_items for select using (true);
drop policy if exists "gallery_admin" on public.gallery_items;
create policy "gallery_admin" on public.gallery_items for all to authenticated
  using (public.is_admin()) with check (public.is_admin());

-- Reseñas: el público solo lee publicadas. Las inserta el servidor (clave secreta,
-- con validación y rate limit). Aprobar/eliminar: solo admin.
drop policy if exists "reviews_read" on public.reviews;
create policy "reviews_read" on public.reviews for select using (status = 'published' or public.is_admin());
drop policy if exists "reviews_admin_update" on public.reviews;
create policy "reviews_admin_update" on public.reviews for update to authenticated
  using (public.is_admin()) with check (public.is_admin());
drop policy if exists "reviews_admin_delete" on public.reviews;
create policy "reviews_admin_delete" on public.reviews for delete to authenticated
  using (public.is_admin());

-- Leads: privados. Los inserta el servidor; solo admin los lee y gestiona.
drop policy if exists "leads_admin" on public.leads;
create policy "leads_admin" on public.leads for all to authenticated
  using (public.is_admin()) with check (public.is_admin());

-- Admins: cada usuario puede comprobar si él mismo es admin.
drop policy if exists "admin_users_self" on public.admin_users;
create policy "admin_users_self" on public.admin_users for select to authenticated
  using (user_id = auth.uid());

-- La IP hasheada no se expone por la API pública (solo columnas permitidas).
revoke select on public.reviews from anon, authenticated;
grant select (id, product_id, name, stars, body, status, created_at) on public.reviews to anon, authenticated;

-- ---------------------------------------------------------------------
-- Storage: bucket público "media" (lectura pública por URL, escritura solo admin)
-- ---------------------------------------------------------------------
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('media', 'media', true, 10485760, array['image/jpeg','image/png','image/webp','image/avif'])
on conflict (id) do update set public = excluded.public,
  file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;

drop policy if exists "media_admin_select" on storage.objects;
create policy "media_admin_select" on storage.objects for select to authenticated
  using (bucket_id = 'media' and public.is_admin());
drop policy if exists "media_admin_insert" on storage.objects;
create policy "media_admin_insert" on storage.objects for insert to authenticated
  with check (bucket_id = 'media' and public.is_admin());
drop policy if exists "media_admin_update" on storage.objects;
create policy "media_admin_update" on storage.objects for update to authenticated
  using (bucket_id = 'media' and public.is_admin());
drop policy if exists "media_admin_delete" on storage.objects;
create policy "media_admin_delete" on storage.objects for delete to authenticated
  using (bucket_id = 'media' and public.is_admin());
