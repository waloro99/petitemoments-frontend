-- =====================================================================
-- Permisos de la API (Data API) para proyectos nuevos de Supabase, que ya no
-- otorgan acceso automático a las tablas. Idempotente: se puede correr varias veces.
-- (La seguridad fila por fila la siguen controlando las políticas RLS.)
-- =====================================================================
grant usage on schema public to anon, authenticated, service_role;

-- Lectura pública (RLS filtra: productos activos, reseñas publicadas)
grant select on public.categories, public.products, public.gallery_items to anon, authenticated;
revoke select on public.reviews from anon, authenticated;
grant select (id, product_id, name, stars, body, status, created_at) on public.reviews to anon, authenticated;

-- Servidor (clave secreta): lectura y escritura completas
grant all on all tables in schema public to service_role;
alter default privileges in schema public grant all on tables to service_role;

-- Funciones usadas por las políticas RLS
grant execute on function public.is_admin() to anon, authenticated, service_role;
