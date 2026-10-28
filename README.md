# Petite Moments GT · Sitio web + panel administrativo

Sitio de catálogo y cotización para **Petite Moments GT** (globos, cake toppers, sorpresas, centros de mesa, juegos y detalles personalizados para celebraciones en Ciudad de Guatemala). La conversión principal es WhatsApp (**+502 4227-8353**) y la secundaria, el formulario/correo. Incluye un panel para que la dueña administre el contenido sin depender de un desarrollador.

**Stack:** Next.js 16 (App Router, Cache Components) · TypeScript · Tailwind CSS 4 · Supabase (Postgres) · Cloudflare R2 (imágenes) · `next/font` · `next/image` · Vercel.

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
| `/admin/login` | Ingreso con usuario y contraseña |
| `/sitemap.xml`, `/robots.txt`, `/opengraph-image` | SEO |

## Reglas de negocio clave

- **Reseñas:** con 4★ o más se publican al instante; con menos de 4 quedan **pendientes** hasta que se aprueben en el panel. La regla se aplica en el servidor (Server Action) **y** en la base (trigger `reviews_enforce_status`), así que no depende del navegador. El promedio y los conteos usan solo reseñas publicadas. Anti-spam: campo trampa (honeypot) + máximo 3 reseñas por hora por IP (hasheada).
- **Galería ↔ reseñas:** cada foto puede vincularse a un producto; las reseñas publicadas de ese producto aparecen en el badge y el lightbox de la foto.
- **Cotizaciones:** se guardan en `leads` (máx. 5 por hora por IP), se envía aviso por correo con Resend (si está configurado) y el cliente continúa por WhatsApp con el mensaje armado.
- **Seguridad del panel:** usuario y contraseña propios (hash *scrypt*, nunca en claro en el código), sesión en cookie httpOnly firmada con HMAC y con vencimiento de 7 días. `src/proxy.ts` protege `/admin` y cada Server Action vuelve a verificar la sesión. El panel escribe en la base con la clave secreta solo desde el servidor; el público, por RLS, solo puede leer.

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
2. **SQL Editor → New query**: pega el contenido de `supabase/setup.sql` y ejecútalo. (Si lo corriste antes del 27/10/2026, ejecuta también `supabase/grants.sql`: los proyectos nuevos de Supabase no dan permisos de API a las tablas por defecto.) Crea tablas, políticas RLS, el trigger de reseñas, el bucket `media` y carga los datos semilla. Se puede volver a correr sin duplicar datos.
3. **Project Settings → API Keys**: copia a `.env.local`
   - `NEXT_PUBLIC_SUPABASE_URL` (Project URL)
   - `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` (publishable / anon)
   - `SUPABASE_SECRET_KEY` (secret / service_role) — solo servidor
4. Reinicia `npm run dev` (o haz *Redeploy* en Vercel tras agregar las variables) y entra a `/admin/login`.

## 3. Usuario del panel

El panel funciona aunque la base no esté conectada (en modo demo solo se puede recorrer, no guardar).

- Hay un **usuario por defecto** cuya contraseña se entregó por fuera del repositorio (el repo es público: en el código solo está su hash).
- **Cambiar usuario/contraseña** (recomendado antes de entregar a la clienta):
  ```bash
  npm run admin:password -- "UnaContraseñaNuevaYLarga"
  # imprime ADMIN_PASSWORD_HASH=scrypt$...
  ```
  En Vercel → Settings → Environment Variables agrega `ADMIN_USERNAME` (opcional) y `ADMIN_PASSWORD_HASH` con ese valor, y haz *Redeploy*.
- La sesión se firma con un secreto que se genera en cada build (`scripts/ensure-build-secret.mjs`, fuera del repo). Al redesplegar, hay que volver a ingresar. Para sesiones estables entre deploys, define `ADMIN_SESSION_SECRET` (cadena aleatoria larga).
- Tablas `admin_users` y políticas de Storage del SQL ya no son necesarias para el panel (queda listo por si luego se quiere Supabase Auth).

> Las **reseñas semilla son de muestra**. Antes de publicar: `delete from public.reviews;` o cárgalas reales con autorización.

## 3b. Imágenes en Cloudflare R2 (recomendado)

R2 da 10 GB gratis y no cobra por la descarga de imágenes. Las fotos se suben desde el panel (el navegador las reduce a WebP de máx. 2000 px) y el servidor las guarda en R2.

1. Cloudflare → **R2 Object Storage** → *Create bucket* → nombre `petitemoments-media` (ubicación automática).
2. Bucket → **Settings → Public access → Custom Domains → Connect Domain** → `media.tudominio.com` (el dominio ya está en Cloudflare, el registro DNS se crea solo).
3. R2 → **Manage API tokens → Create API token**: permiso *Object Read & Write*, solo para ese bucket. Copia *Access Key ID*, *Secret Access Key* y tu *Account ID*.
4. En Vercel agrega `R2_ACCOUNT_ID`, `R2_ACCESS_KEY_ID`, `R2_SECRET_ACCESS_KEY`, `R2_BUCKET`, `R2_PUBLIC_URL=https://media.tudominio.com` y haz *Redeploy*.

Sin estas variables, las imágenes se guardan en Supabase Storage (1 GB gratis).

## 4. Aviso por correo de cotizaciones (opcional)

1. Crea cuenta en [resend.com](https://resend.com), verifica el dominio (`petitemomentsgt.com`) y genera una API key.
2. Define `RESEND_API_KEY`, `RESEND_FROM` (p. ej. `Petite Moments <cotizaciones@petitemomentsgt.com>`) y `LEAD_NOTIFY_EMAIL`.
3. Sin dominio verificado, Resend solo permite enviar a tu propio correo con `onboarding@resend.dev`.

Si no configuras Resend, las cotizaciones igual se guardan y se ven en el panel (pestaña **Cotizaciones**).

## 5. Desplegar en Vercel

1. Sube el repo a GitHub e impórtalo en [vercel.com/new](https://vercel.com/new) (framework: Next.js, sin cambios de build).
2. En **Settings → Environment Variables** agrega las mismas variables de `.env.local`, con `NEXT_PUBLIC_SITE_URL` = dominio final (afecta canonical, sitemap y datos estructurados).
3. Deploy. El build lee el catálogo de Supabase para prerenderizar las páginas: **ejecuta `setup.sql` antes del primer deploy**.
4. Dominio propio (DNS en Cloudflare): Vercel → **Settings → Domains → Add** `tudominio.com` y `www.tudominio.com`. Copia los registros que Vercel te muestra (A para el dominio raíz y CNAME para `www`) en Cloudflare → **DNS → Records**, con el proxy en **DNS only** (nube gris). Luego cambia `NEXT_PUBLIC_SITE_URL` al dominio final y haz *Redeploy*.
5. Registra el sitio en Google Search Console y envía `https://tu-dominio/sitemap.xml`.
6. Cron diario `/api/keepalive` (en `vercel.json`): hace una consulta mínima para que Supabase gratis no pause el proyecto por inactividad.

> **Ojo:** el plan Hobby de Vercel es solo para uso personal no comercial. Para un negocio corresponde Vercel Pro o mover el hosting a Cloudflare.

## Cómo se actualiza el contenido

Las páginas públicas se sirven estáticas y cacheadas (tag `catalog`, vida de 1 h). Cada cambio desde el panel (y cada reseña publicada) invalida ese tag con `updateTag`, así que el sitio se actualiza de inmediato.

## Scripts

| Comando | Uso |
|---|---|
| `npm run dev` | Desarrollo |
| `npm run build` / `npm start` | Producción local |
| `npm run lint` / `npm run typecheck` | Calidad |
| `npm run admin:password -- "clave"` | Genera el hash para cambiar la contraseña del panel |
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
