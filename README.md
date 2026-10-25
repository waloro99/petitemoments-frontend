# Petite Moments GT · Sitio web + panel administrativo

Sitio de catálogo y cotización para **Petite Moments GT** (decoración con globos, sorpresas, repostería, fotografía, inflables y paquetes en Ciudad de Guatemala). La conversión principal es WhatsApp (**+502 4227-8353**) y la secundaria, el formulario/correo. Incluye un panel para que la dueña administre el contenido sin depender de un desarrollador.

**Stack:** Next.js 16 (App Router, Cache Components) · TypeScript · Tailwind CSS 4 · Supabase (Postgres + Auth + Storage) · `next/font` · `next/image` · listo para Vercel.

---

## Rutas

| Ruta | Qué hace |
|---|---|
| `/` | Home: hero, categorías, guía "no sé qué necesito", trabajos destacados, proceso, confianza, CTA |
| `/catalogo` | Catálogo con filtros combinables **en la URL**: `?categoria=globos&ocasion=infantil&estilo=elegante&presupuesto=medio` |
| `/producto/[slug]` | Detalle con carrusel, qué incluye, personalización, CTA de WhatsApp/correo/formulario y reseñas |
| `/galeria` | Masonry de trabajos reales, filtro `?ocasion=`, lightbox con reseñas del producto vinculado |
| `/cotizar` | Formulario → guarda el lead, avisa por correo y ofrece continuar por WhatsApp. Acepta `?producto=slug` |
| `/admin` | Panel (protegido): Productos · Categorías · Galería · Reseñas · Cotizaciones |
| `/admin/login` | Ingreso con correo y contraseña (Supabase Auth) |
| `/sitemap.xml`, `/robots.txt`, `/opengraph-image` | SEO |

## Reglas de negocio clave

- **Reseñas:** con 4★ o más se publican al instante; con menos de 4 quedan **pendientes** hasta que se aprueben en el panel. La regla se aplica en el servidor (Server Action) **y** en la base (trigger `reviews_enforce_status`), así que no depende del navegador. El promedio y los conteos usan solo reseñas publicadas. Anti-spam: campo trampa (honeypot) + máximo 3 reseñas por hora por IP (hasheada).
- **Galería ↔ reseñas:** cada foto puede vincularse a un producto; las reseñas publicadas de ese producto aparecen en el badge y el lightbox de la foto.
- **Cotizaciones:** se guardan en `leads` (máx. 5 por hora por IP), se envía aviso por correo con Resend (si está configurado) y el cliente continúa por WhatsApp con el mensaje armado.
- **Seguridad del panel:** Supabase Auth (contraseña hasheada, sesión en cookie httpOnly), `src/proxy.ts` protege `/admin`, y además cada acción del servidor verifica que el usuario esté en `admin_users`. Las políticas RLS impiden escribir a quien no sea admin aunque llame a la API directamente.

## Estructura

```
src/
  app/                 Rutas (páginas, actions.ts públicas, admin/actions.ts del panel, sitemap, robots, OG)
  components/          UI: site/ (navbar, footer), product/, gallery/, quote/, admin/
  lib/
    config.ts          Datos del negocio, ocasiones, estilos, presupuestos, opciones del formulario
    data.ts            Lectura pública cacheada ("use cache" + tag "catalog")
    seed.ts            Datos del prototipo (modo demo y generación del SQL)
    supabase/          Clientes (público, sesión, secreto, navegador)
    whatsapp.ts        Enlaces y mensajes precargados de WhatsApp/correo
    seo.ts             JSON-LD LocalBusiness / Breadcrumb
  proxy.ts             Protección de /admin y refresco de sesión
supabase/
  schema.sql           Tablas, RLS, triggers, bucket de Storage
  seed.sql             8 categorías, 12 productos, 12 fotos, reseñas de muestra
  setup.sql            schema + seed en un solo archivo (lo que se pega en Supabase)
scripts/build-seed-sql.ts   Regenera seed.sql/setup.sql desde src/lib/seed.ts
```

---

## 1. Correr en local

Requisitos: **Node.js 20.9+** (probado con Node 22).

```bash
npm install
cp .env.example .env.local     # en Windows: copy .env.example .env.local
npm run dev                    # http://localhost:3000
```

Sin variables de Supabase el sitio arranca en **modo demo**: muestra los datos del prototipo, los formularios responden pero no guardan, y `/admin` se ve en solo lectura.

## 2. Conectar la base de datos (Supabase)

1. Crea un proyecto en [supabase.com](https://supabase.com) (región sugerida: la más cercana, p. ej. `us-east-1`).
2. **SQL Editor → New query**: pega el contenido de `supabase/setup.sql` y ejecútalo. Crea tablas, políticas RLS, el trigger de reseñas, el bucket `media` y carga los datos semilla. Se puede volver a correr sin duplicar datos.
3. **Project Settings → API Keys**: copia a `.env.local`
   - `NEXT_PUBLIC_SUPABASE_URL` (Project URL)
   - `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` (publishable / anon)
   - `SUPABASE_SECRET_KEY` (secret / service_role) — solo servidor
4. **Authentication → Sign In / Providers**: desactiva *Allow new users to sign up* (el panel no necesita registro público).
5. **Authentication → Users → Add user → Create new user**: correo y contraseña de la dueña, marcando *Auto Confirm User*.
6. Dale permisos de administradora (SQL Editor):
   ```sql
   insert into public.admin_users (user_id, email)
   select id, email from auth.users where email = 'correo-de-la-duena@ejemplo.com';
   ```
7. Reinicia `npm run dev` y entra a `/admin/login`.

> Las **reseñas semilla son de muestra**. Antes de publicar: `delete from public.reviews;` o cárgalas reales con autorización.

## 3. Aviso por correo de cotizaciones (opcional)

1. Crea cuenta en [resend.com](https://resend.com), verifica el dominio (`petitemomentsgt.com`) y genera una API key.
2. Define `RESEND_API_KEY`, `RESEND_FROM` (p. ej. `Petite Moments <cotizaciones@petitemomentsgt.com>`) y `LEAD_NOTIFY_EMAIL`.
3. Sin dominio verificado, Resend solo permite enviar a tu propio correo con `onboarding@resend.dev`.

Si no configuras Resend, las cotizaciones igual se guardan y se ven en el panel (pestaña **Cotizaciones**).

## 4. Desplegar en Vercel

1. Sube el repo a GitHub e impórtalo en [vercel.com/new](https://vercel.com/new) (framework: Next.js, sin cambios de build).
2. En **Settings → Environment Variables** agrega las mismas variables de `.env.local`, con `NEXT_PUBLIC_SITE_URL` = dominio final (afecta canonical, sitemap y datos estructurados).
3. Deploy. El build lee el catálogo de Supabase para prerenderizar las páginas: **ejecuta `setup.sql` antes del primer deploy**.
4. Dominio propio: **Settings → Domains**. Luego en Supabase → *Authentication → URL Configuration* pon ese dominio como *Site URL*.
5. Registra el sitio en Google Search Console y envía `https://tu-dominio/sitemap.xml`.

## Cómo se actualiza el contenido

Las páginas públicas se sirven estáticas y cacheadas (tag `catalog`, vida de 1 h). Cada cambio desde el panel (y cada reseña publicada) invalida ese tag con `updateTag`, así que el sitio se actualiza de inmediato.

## Scripts

| Comando | Uso |
|---|---|
| `npm run dev` | Desarrollo |
| `npm run build` / `npm start` | Producción local |
| `npm run lint` / `npm run typecheck` | Calidad |
| `npm run db:seed-sql` | Regenera `supabase/seed.sql` y `setup.sql` desde `src/lib/seed.ts` |

## Imágenes

- Se suben desde el panel; el navegador las reduce a máx. 2000 px en **WebP** antes de subirlas al bucket `media`, y `next/image` las sirve en AVIF/WebP con `srcset` y lazy loading.
- Formato sugerido: vertical **4:5** (cards y detalle) o cuadrado 1:1. La primera imagen de cada producto es la portada (se puede cambiar con "Portada").
- Mientras no haya fotos reales, se usan los fondos decorativos del prototipo (`placeholder:N`).

## Pendientes de confirmar con la clienta

- Correo real del negocio (hoy `hola@petitemomentsgt.com`, placeholder).
- Logo definitivo (el actual es un wordmark provisional) y fotografía real.
- Precios "Desde Q___" (son de muestra) y cifras del hero (+400 celebraciones, 24 h).
- Horario y zona de cobertura exactos (`src/lib/config.ts`).
- Páginas del brief aún sin diseño: Servicios, Paquetes, Nosotros, FAQ y Contacto.
