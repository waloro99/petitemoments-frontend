-- =====================================================================
-- Petite Moments GT · Datos semilla (8 categorías, 12 productos, 12 fotos, reseñas de muestra)
-- Generado por scripts/build-seed-sql.ts. Las imágenes son 'placeholder:N' (fondos decorativos):
-- reemplázalas desde el panel subiendo fotos reales.
-- =====================================================================

begin;

insert into public.categories (key, label, sort_order) values
  ('globos', 'Decoración con globos', 0),
  ('bouquets', 'Bouquets de globos', 1),
  ('arreglos', 'Arreglos de mesa', 2),
  ('sorpresas', 'Sorpresas personalizadas', 3),
  ('cake-toppers', 'Cake toppers', 4),
  ('personalizables', 'Personalizables para eventos', 5),
  ('juegos', 'Juegos para eventos', 6),
  ('paquetes', 'Paquetes', 7)
on conflict (key) do update set label = excluded.label, sort_order = excluded.sort_order;

insert into public.products (slug, name, category_key, occasions, styles, budget, price_label, badge, blurb, long_desc, recomendado, incluye, personalizable, opcionales, tiempo, images, active, featured, sort_order) values
  ('arco-de-globos-organico', 'Arco de globos orgánico', 'globos', array['infantil', 'adulto', 'babyshower']::text[], array['colorido', 'tematico', 'pastel']::text[], 'medio', 'Desde Q650', 'Más cotizado',
   'Arco de globos en tonos a elección para tu backdrop o entrada.',
   'Nuestro arco orgánico es el favorito para fotos y entradas. Combinamos globos de distintos tamaños y acabados (mate, cromo, confetti) en la paleta de tu evento, montados sobre estructura propia.',
   'Cumpleaños, baby showers, aniversarios y fondos de foto.', array['Diseño y armado del arco en tu paleta', 'Globos de distintos tamaños y acabados', 'Estructura y montaje en sitio', 'Retiro de material posterior (según zona)']::text[],
   array['Colores', 'Tamaño', 'Temática', 'Follaje / flores', 'Tipo de globo']::text[], array['Número o letras', 'Panel de fondo', 'Rótulo personalizado', 'Iluminación']::text[], '5 a 7 días de anticipación', array['placeholder:0', 'placeholder:2', 'placeholder:4']::text[], true, true, 0),
  ('backdrop-con-panel-y-numeros', 'Backdrop con panel y números', 'globos', array['infantil', 'adulto', 'gender']::text[], array['elegante', 'tematico']::text[], 'premium', 'Desde Q1,200', null,
   'Panel de fondo con globos, números y rótulo para tu mesa principal.',
   'Un montaje completo para la mesa principal: panel de fondo (madera o tela), decoración de globos, número o nombre y detalles temáticos. Ideal como punto focal de fotos.',
   'Cumpleaños, gender reveal y celebraciones con mesa principal.', array['Panel de fondo montado', 'Decoración de globos coordinada', 'Número, edad o nombre', 'Montaje y desmontaje']::text[],
   array['Colores', 'Temática', 'Nombre / edad', 'Tamaño del panel']::text[], array['Cake topper', 'Iluminación', 'Flores frescas']::text[], '1 a 2 semanas de anticipación', array['placeholder:1', 'placeholder:3', 'placeholder:5']::text[], true, false, 1),
  ('bouquet-de-globos', 'Bouquet de globos', 'bouquets', array['aniversario', 'romantica', 'adulto']::text[], array['pastel', 'minimalista']::text[], 'economico', 'Desde Q185', 'Nuevo',
   'Ramo de globos listo para entregar como sorpresa o detalle.',
   'Un bouquet de globos elegante, perfecto para enviar como sorpresa o llevar a una celebración. Se arma en la paleta que elijas y puede incluir un globo con mensaje.',
   'Sorpresas, aniversarios, cumpleaños y detalles rápidos.', array['Bouquet de globos armado', 'Paleta a elección', 'Base o envoltura decorativa']::text[],
   array['Colores', 'Mensaje', 'Tamaño']::text[], array['Globo con nombre', 'Tarjeta', 'Chocolates']::text[], '2 a 3 días de anticipación', array['placeholder:2', 'placeholder:4', 'placeholder:0']::text[], true, true, 2),
  ('caja-sorpresa-personalizada', 'Caja sorpresa personalizada', 'sorpresas', array['aniversario', 'romantica', 'adulto', 'graduacion']::text[], array['pastel', 'tematico']::text[], 'economico', 'Desde Q275', null,
   'Caja o bolsa personalizada con globos, mensaje y detalles.',
   'Sorpresa lista para entregar: caja o bolsa decorada con globos, mensaje personalizado y los detalles que elijas dentro. Perfecta para sorprender sin necesidad de un montaje grande.',
   'Aniversarios, cumpleaños a distancia y fechas especiales.', array['Caja o bolsa decorada', 'Globos y mensaje personalizado', 'Armado y presentación']::text[],
   array['Colores', 'Mensaje', 'Contenido interno', 'Tamaño']::text[], array['Cake topper', 'Flores', 'Peluche', 'Entrega a domicilio']::text[], '3 a 5 días de anticipación', array['placeholder:3', 'placeholder:5', 'placeholder:1']::text[], true, false, 3),
  ('centros-de-mesa-personalizados', 'Centros de mesa personalizados', 'personalizables', array['infantil', 'adulto', 'babyshower', 'corporativo']::text[], array['tematico', 'elegante', 'colorido']::text[], 'cotizar', 'A cotizar', null,
   'Centros de mesa hechos a tu estilo para las mesas de tus invitados.',
   'Diseñamos centros de mesa coordinados con la temática y paleta de tu evento: con nombre, edad, globos, crafting o detalles en vinil. La cotización depende de la cantidad de mesas y el diseño.',
   'Cumpleaños, baby showers, bautizos y eventos corporativos.', array['Diseño coordinado con tu temática', 'Elaboración de cada centro de mesa', 'Entrega lista para colocar']::text[],
   array['Temática', 'Colores', 'Nombre / edad', 'Cantidad de mesas']::text[], array['Cake topper a juego', 'Vinil para globos', 'Pizarrón de bienvenida']::text[], '1 a 2 semanas de anticipación', array['placeholder:4', 'placeholder:0', 'placeholder:2']::text[], true, false, 4),
  ('cake-topper-personalizado', 'Cake topper personalizado', 'cake-toppers', array['infantil', 'adulto', 'babyshower', 'graduacion']::text[], array['tematico', 'colorido', 'elegante']::text[], 'economico', 'A cotizar', null,
   'Topper con nombre, edad y temática para darle el toque final a tu pastel.',
   'Toppers personalizados con el nombre, la edad y la temática de tu celebración. Los diseñamos en los colores y el estilo que elijas para que tu pastel luzca único.',
   'Cumpleaños, baby showers, graduaciones y aniversarios.', array['Diseño personalizado', 'Nombre, edad o frase', 'Listo para colocar en el pastel']::text[],
   array['Nombre / edad', 'Temática', 'Colores', 'Tamaño']::text[], array['Toppers para cupcakes a juego', 'Centros de mesa a juego']::text[], '3 a 5 días de anticipación', array['placeholder:5', 'placeholder:1', 'placeholder:3']::text[], true, false, 5),
  ('toppers-para-cupcakes-docena', 'Toppers para cupcakes (docena)', 'cake-toppers', array['infantil', 'adulto', 'corporativo']::text[], array['pastel', 'colorido', 'minimalista']::text[], 'economico', 'A cotizar', null,
   'Docena de mini toppers a juego con la temática de tu evento.',
   'Mini toppers personalizados para cupcakes o postres, coordinados con tu cake topper y la paleta de tu celebración.',
   'Mesas de postres, detalles y eventos pequeños.', array['12 mini toppers', 'Diseño coordinado', 'Listos para colocar']::text[],
   array['Temática', 'Colores', 'Nombre / iniciales', 'Cantidad']::text[], array['Cake topper a juego', 'Etiquetas para dulces']::text[], '3 a 5 días de anticipación', array['placeholder:0', 'placeholder:2', 'placeholder:4']::text[], true, false, 6),
  ('vinil-personalizado-para-globos', 'Vinil personalizado para globos', 'personalizables', array['infantil', 'adulto', 'babyshower', 'gender', 'graduacion']::text[], array['elegante', 'tematico', 'minimalista']::text[], 'economico', 'A cotizar', null,
   'Nombres, frases y fechas en vinil para personalizar tus globos.',
   'Vinil cortado a la medida para personalizar globos burbuja, globos gigantes o bouquets con nombres, frases, edades o fechas especiales.',
   'Cumpleaños, baby showers, gender reveal y graduaciones.', array['Diseño del texto', 'Vinil cortado en el color elegido', 'Aplicación en el globo']::text[],
   array['Texto', 'Tipografía', 'Color del vinil', 'Tamaño']::text[], array['Globo burbuja', 'Bouquet de globos', 'Pizarrón personalizado']::text[], '2 a 4 días de anticipación', array['placeholder:1', 'placeholder:3', 'placeholder:5']::text[], true, false, 7),
  ('juegos-para-eventos', 'Juegos para eventos', 'juegos', array['infantil', 'adulto', 'corporativo']::text[], array['colorido', 'infantil']::text[], 'cotizar', 'A cotizar', null,
   'Hockey de mesa, fútbol, básquet y más para que grandes y chicos se diviertan.',
   'Renta de juegos para tu celebración: hockey de mesa, fútbol, básquet y otras opciones para todas las edades. Disponibilidad y espacio necesario se confirman al cotizar.',
   'Cumpleaños infantiles y de adultos, convivios y eventos corporativos.', array['Juegos según disponibilidad', 'Entrega e instalación', 'Retiro al finalizar']::text[],
   array['Tipo de juego', 'Cantidad', 'Tiempo de uso']::text[], array['Decoración a juego', 'Premios o recuerdos']::text[], '1 a 2 semanas de anticipación', array['placeholder:2', 'placeholder:4', 'placeholder:0']::text[], true, false, 8),
  ('arreglo-de-mesa-central', 'Arreglo de mesa central', 'arreglos', array['adulto', 'aniversario', 'corporativo', 'bautizo']::text[], array['elegante', 'minimalista']::text[], 'medio', 'Desde Q420', null,
   'Centro de mesa elegante para eventos y celebraciones.',
   'Arreglo central para mesas de evento, en un estilo elegante y coordinado. Combina flores, follaje o velas según el ambiente que busques.',
   'Aniversarios, eventos corporativos y celebraciones formales.', array['Arreglo central montado', 'Paleta coordinada', 'Entrega en sitio']::text[],
   array['Colores', 'Tamaño', 'Flores / follaje', 'Estilo']::text[], array['Velas', 'Rótulos de mesa', 'Numeración de mesas']::text[], '5 a 7 días de anticipación', array['placeholder:3', 'placeholder:5', 'placeholder:1']::text[], true, false, 9),
  ('set-baby-shower-completo', 'Set baby shower completo', 'paquetes', array['babyshower']::text[], array['elegante', 'pastel', 'tematico']::text[], 'cotizar', 'A cotizar', 'Temporada',
   'Decoración, mesa principal y detalles para tu baby shower.',
   'Un paquete pensado para baby showers: decoración con globos, mesa principal, detalles temáticos y opción de cake topper y centros de mesa. Se arma según el espacio y la cantidad de invitados.',
   'Baby showers en casa, salón o restaurante.', array['Decoración con globos', 'Mesa principal / backdrop', 'Detalles temáticos']::text[],
   array['Colores', 'Temática', 'Tamaño del montaje']::text[], array['Cake topper', 'Centros de mesa', 'Recuerdos para invitados']::text[], '2 a 3 semanas de anticipación', array['placeholder:4', 'placeholder:0', 'placeholder:2']::text[], true, true, 10),
  ('kit-gender-reveal', 'Kit gender reveal', 'sorpresas', array['gender']::text[], array['tematico', 'colorido']::text[], 'medio', 'Desde Q890', null,
   'Montaje y elemento sorpresa para revelar el género del bebé.',
   'Un montaje especial para el momento de la revelación: decoración de globos, elemento sorpresa (globo gigante, caja o cañón) y ambientación coordinada.',
   'Gender reveal en casa o salón.', array['Decoración de globos', 'Elemento sorpresa a elección', 'Montaje en sitio']::text[],
   array['Tipo de revelación', 'Colores neutros', 'Tamaño']::text[], array['Juegos de gender reveal', 'Cake topper', 'Backdrop']::text[], '1 a 2 semanas de anticipación', array['placeholder:5', 'placeholder:1', 'placeholder:3']::text[], true, false, 11)
on conflict (slug) do nothing;

-- Galería (vinculada a productos por slug). Solo se inserta si la galería está vacía.
insert into public.gallery_items (title, occasion, product_id, image_url, height, sort_order)
select v.title, v.occasion, p.id, v.image_url, v.height, v.sort_order
from (values
  ('Cumpleaños temático', 'infantil', 'arco-de-globos-organico', 'placeholder:1', 280, 0),
  ('Baby shower en pastel', 'babyshower', 'set-baby-shower-completo', 'placeholder:2', 230, 1),
  ('Arco orgánico de entrada', 'adulto', 'arco-de-globos-organico', 'placeholder:3', 300, 2),
  ('Sorpresa a domicilio', 'romantica', 'caja-sorpresa-personalizada', 'placeholder:4', 210, 3),
  ('Inauguración corporativa', 'corporativo', 'arreglo-de-mesa-central', 'placeholder:5', 260, 4),
  ('Aniversario elegante', 'aniversario', 'arreglo-de-mesa-central', 'placeholder:0', 300, 5),
  ('Revelación de género', 'gender', 'kit-gender-reveal', 'placeholder:1', 200, 6),
  ('Centros de mesa temáticos', 'infantil', 'centros-de-mesa-personalizados', 'placeholder:2', 240, 7),
  ('Backdrop de graduación', 'graduacion', 'backdrop-con-panel-y-numeros', 'placeholder:3', 280, 8),
  ('Bautizo delicado', 'bautizo', 'arreglo-de-mesa-central', 'placeholder:4', 220, 9),
  ('Cumpleaños de adulto', 'adulto', 'backdrop-con-panel-y-numeros', 'placeholder:5', 250, 10),
  ('Detalle de aniversario', 'aniversario', 'bouquet-de-globos', 'placeholder:0', 200, 11)
) as v(title, occasion, slug, image_url, height, sort_order)
left join public.products p on p.slug = v.slug
where not exists (select 1 from public.gallery_items);

-- Reseñas de MUESTRA del prototipo. Bórralas antes de publicar o carga las reales con autorización.
-- El trigger asigna el estado según las estrellas (4★+ publicada, <4 pendiente).
insert into public.reviews (product_id, name, stars, body, created_at)
select p.id, v.name, v.stars, v.body, v.created_at::timestamptz
from (values
  ('arco-de-globos-organico', 'Andrea M.', 5, 'El arco quedó preciosísimo y llegaron puntuales a montar. Todos los invitados preguntaron quién lo hizo.', '2026-09-01T00:00:00.000Z'),
  ('arco-de-globos-organico', 'Luis R.', 4, 'Muy buen trabajo y los colores quedaron justo como los pedí. Volvería a contratarlos.', '2026-09-02T00:00:00.000Z'),
  ('caja-sorpresa-personalizada', 'Gabriela S.', 5, 'Mandé la sorpresa a mi mamá y le encantó. La presentación es hermosa.', '2026-09-03T00:00:00.000Z'),
  ('centros-de-mesa-personalizados', 'Diana P.', 5, 'Los centros de mesa fueron el centro de atención. Todo bien coordinado con la temática.', '2026-09-04T00:00:00.000Z'),
  ('arreglo-de-mesa-central', 'Carmen L.', 4, 'Elegantes y discretos, justo lo que buscaba para el aniversario de la empresa.', '2026-09-05T00:00:00.000Z'),
  ('backdrop-con-panel-y-numeros', 'José F.', 3, 'El montaje estuvo bien pero llegaron un poco más tarde de lo acordado.', '2026-09-06T00:00:00.000Z'),
  ('juegos-para-eventos', 'Marta V.', 2, 'Los juegos estuvieron bien, pero esperaba más opciones para el espacio que tenía.', '2026-09-07T00:00:00.000Z')
) as v(slug, name, stars, body, created_at)
join public.products p on p.slug = v.slug
where not exists (select 1 from public.reviews);

commit;
