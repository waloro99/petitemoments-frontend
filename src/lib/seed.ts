// Datos semilla del prototipo (12 productos, 8 categorías, 12 fotos, reseñas de muestra).
// Se usan: (1) en modo demo cuando Supabase no está configurado y
// (2) para generar supabase/seed.sql con `npm run db:seed-sql`.
// Este archivo no importa nada en tiempo de ejecución para poder ejecutarse con Node directamente.
import type { Category, GalleryItem, Product, Review } from "./types";

export function slugify(input: string): string {
  return input
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

const CAT_LABELS: [string, string][] = [
  ["globos", "Decoración con globos"],
  ["bouquets", "Bouquets de globos"],
  ["arreglos", "Arreglos de mesa"],
  ["sorpresas", "Sorpresas personalizadas"],
  ["cake-toppers", "Cake toppers"],
  ["personalizables", "Personalizables para eventos"],
  ["juegos", "Juegos para eventos"],
  ["paquetes", "Paquetes"],
];

export const SEED_CATEGORIES: Category[] = CAT_LABELS.map(([key, label], i) => ({ key, label, sort: i }));

type RawProduct = Omit<Product, "id" | "slug" | "images" | "active" | "featured" | "sort" | "badge"> & {
  key: string;
  badge?: string;
};

const RAW: RawProduct[] = [
  {
    key: "arco-organico", name: "Arco de globos orgánico", cat: "globos", occ: ["infantil", "adulto", "babyshower"], style: ["colorido", "tematico", "pastel"], budget: "medio", priceLabel: "Desde Q650", badge: "Más cotizado",
    blurb: "Arco de globos en tonos a elección para tu backdrop o entrada.",
    longDesc: "Nuestro arco orgánico es el favorito para fotos y entradas. Combinamos globos de distintos tamaños y acabados (mate, cromo, confetti) en la paleta de tu evento, montados sobre estructura propia.",
    recomendado: "Cumpleaños, baby showers, aniversarios y fondos de foto.",
    incluye: ["Diseño y armado del arco en tu paleta", "Globos de distintos tamaños y acabados", "Estructura y montaje en sitio", "Retiro de material posterior (según zona)"],
    personalizable: ["Colores", "Tamaño", "Temática", "Follaje / flores", "Tipo de globo"],
    opcionales: ["Número o letras", "Panel de fondo", "Rótulo personalizado", "Iluminación"], tiempo: "5 a 7 días de anticipación",
  },
  {
    key: "backdrop-panel", name: "Backdrop con panel y números", cat: "globos", occ: ["infantil", "adulto", "gender"], style: ["elegante", "tematico"], budget: "premium", priceLabel: "Desde Q1,200",
    blurb: "Panel de fondo con globos, números y rótulo para tu mesa principal.",
    longDesc: "Un montaje completo para la mesa principal: panel de fondo (madera o tela), decoración de globos, número o nombre y detalles temáticos. Ideal como punto focal de fotos.",
    recomendado: "Cumpleaños, gender reveal y celebraciones con mesa principal.",
    incluye: ["Panel de fondo montado", "Decoración de globos coordinada", "Número, edad o nombre", "Montaje y desmontaje"],
    personalizable: ["Colores", "Temática", "Nombre / edad", "Tamaño del panel"],
    opcionales: ["Cake topper", "Iluminación", "Flores frescas"], tiempo: "1 a 2 semanas de anticipación",
  },
  {
    key: "bouquet-globos", name: "Bouquet de globos", cat: "bouquets", occ: ["aniversario", "romantica", "adulto"], style: ["pastel", "minimalista"], budget: "economico", badge: "Nuevo", priceLabel: "Desde Q185",
    blurb: "Ramo de globos listo para entregar como sorpresa o detalle.",
    longDesc: "Un bouquet de globos elegante, perfecto para enviar como sorpresa o llevar a una celebración. Se arma en la paleta que elijas y puede incluir un globo con mensaje.",
    recomendado: "Sorpresas, aniversarios, cumpleaños y detalles rápidos.",
    incluye: ["Bouquet de globos armado", "Paleta a elección", "Base o envoltura decorativa"],
    personalizable: ["Colores", "Mensaje", "Tamaño"],
    opcionales: ["Globo con nombre", "Tarjeta", "Chocolates"], tiempo: "2 a 3 días de anticipación",
  },
  {
    key: "caja-sorpresa", name: "Caja sorpresa personalizada", cat: "sorpresas", occ: ["aniversario", "romantica", "adulto", "graduacion"], style: ["pastel", "tematico"], budget: "economico", priceLabel: "Desde Q275",
    blurb: "Caja o bolsa personalizada con globos, mensaje y detalles.",
    longDesc: "Sorpresa lista para entregar: caja o bolsa decorada con globos, mensaje personalizado y los detalles que elijas dentro. Perfecta para sorprender sin necesidad de un montaje grande.",
    recomendado: "Aniversarios, cumpleaños a distancia y fechas especiales.",
    incluye: ["Caja o bolsa decorada", "Globos y mensaje personalizado", "Armado y presentación"],
    personalizable: ["Colores", "Mensaje", "Contenido interno", "Tamaño"],
    opcionales: ["Cake topper", "Flores", "Peluche", "Entrega a domicilio"], tiempo: "3 a 5 días de anticipación",
  },
  {
    key: "mesa-dulce", name: "Centros de mesa personalizados", cat: "personalizables", occ: ["infantil", "adulto", "babyshower", "corporativo"], style: ["tematico", "elegante", "colorido"], budget: "cotizar", priceLabel: "A cotizar",
    blurb: "Centros de mesa hechos a tu estilo para las mesas de tus invitados.",
    longDesc: "Diseñamos centros de mesa coordinados con la temática y paleta de tu evento: con nombre, edad, globos, crafting o detalles en vinil. La cotización depende de la cantidad de mesas y el diseño.",
    recomendado: "Cumpleaños, baby showers, bautizos y eventos corporativos.",
    incluye: ["Diseño coordinado con tu temática", "Elaboración de cada centro de mesa", "Entrega lista para colocar"],
    personalizable: ["Temática", "Colores", "Nombre / edad", "Cantidad de mesas"],
    opcionales: ["Cake topper a juego", "Vinil para globos", "Pizarrón de bienvenida"], tiempo: "1 a 2 semanas de anticipación",
  },
  {
    key: "pastel-tematico", name: "Cake topper personalizado", cat: "cake-toppers", occ: ["infantil", "adulto", "babyshower", "graduacion"], style: ["tematico", "colorido", "elegante"], budget: "economico", priceLabel: "A cotizar",
    blurb: "Topper con nombre, edad y temática para darle el toque final a tu pastel.",
    longDesc: "Toppers personalizados con el nombre, la edad y la temática de tu celebración. Los diseñamos en los colores y el estilo que elijas para que tu pastel luzca único.",
    recomendado: "Cumpleaños, baby showers, graduaciones y aniversarios.",
    incluye: ["Diseño personalizado", "Nombre, edad o frase", "Listo para colocar en el pastel"],
    personalizable: ["Nombre / edad", "Temática", "Colores", "Tamaño"],
    opcionales: ["Toppers para cupcakes a juego", "Centros de mesa a juego"], tiempo: "3 a 5 días de anticipación",
  },
  {
    key: "cupcakes", name: "Toppers para cupcakes (docena)", cat: "cake-toppers", occ: ["infantil", "adulto", "corporativo"], style: ["pastel", "colorido", "minimalista"], budget: "economico", priceLabel: "A cotizar",
    blurb: "Docena de mini toppers a juego con la temática de tu evento.",
    longDesc: "Mini toppers personalizados para cupcakes o postres, coordinados con tu cake topper y la paleta de tu celebración.",
    recomendado: "Mesas de postres, detalles y eventos pequeños.",
    incluye: ["12 mini toppers", "Diseño coordinado", "Listos para colocar"],
    personalizable: ["Temática", "Colores", "Nombre / iniciales", "Cantidad"],
    opcionales: ["Cake topper a juego", "Etiquetas para dulces"], tiempo: "3 a 5 días de anticipación",
  },
  {
    key: "sesion-foto", name: "Vinil personalizado para globos", cat: "personalizables", occ: ["infantil", "adulto", "babyshower", "gender", "graduacion"], style: ["elegante", "tematico", "minimalista"], budget: "economico", priceLabel: "A cotizar",
    blurb: "Nombres, frases y fechas en vinil para personalizar tus globos.",
    longDesc: "Vinil cortado a la medida para personalizar globos burbuja, globos gigantes o bouquets con nombres, frases, edades o fechas especiales.",
    recomendado: "Cumpleaños, baby showers, gender reveal y graduaciones.",
    incluye: ["Diseño del texto", "Vinil cortado en el color elegido", "Aplicación en el globo"],
    personalizable: ["Texto", "Tipografía", "Color del vinil", "Tamaño"],
    opcionales: ["Globo burbuja", "Bouquet de globos", "Pizarrón personalizado"], tiempo: "2 a 4 días de anticipación",
  },
  {
    key: "inflable", name: "Juegos para eventos", cat: "juegos", occ: ["infantil", "adulto", "corporativo"], style: ["colorido", "infantil"], budget: "cotizar", priceLabel: "A cotizar",
    blurb: "Hockey de mesa, fútbol, básquet y más para que grandes y chicos se diviertan.",
    longDesc: "Renta de juegos para tu celebración: hockey de mesa, fútbol, básquet y otras opciones para todas las edades. Disponibilidad y espacio necesario se confirman al cotizar.",
    recomendado: "Cumpleaños infantiles y de adultos, convivios y eventos corporativos.",
    incluye: ["Juegos según disponibilidad", "Entrega e instalación", "Retiro al finalizar"],
    personalizable: ["Tipo de juego", "Cantidad", "Tiempo de uso"],
    opcionales: ["Decoración a juego", "Premios o recuerdos"], tiempo: "1 a 2 semanas de anticipación",
  },
  {
    key: "arreglo-mesa", name: "Arreglo de mesa central", cat: "arreglos", occ: ["adulto", "aniversario", "corporativo", "bautizo"], style: ["elegante", "minimalista"], budget: "medio", priceLabel: "Desde Q420",
    blurb: "Centro de mesa elegante para eventos y celebraciones.",
    longDesc: "Arreglo central para mesas de evento, en un estilo elegante y coordinado. Combina flores, follaje o velas según el ambiente que busques.",
    recomendado: "Aniversarios, eventos corporativos y celebraciones formales.",
    incluye: ["Arreglo central montado", "Paleta coordinada", "Entrega en sitio"],
    personalizable: ["Colores", "Tamaño", "Flores / follaje", "Estilo"],
    opcionales: ["Velas", "Rótulos de mesa", "Numeración de mesas"], tiempo: "5 a 7 días de anticipación",
  },
  {
    key: "set-babyshower", name: "Set baby shower completo", cat: "paquetes", occ: ["babyshower"], style: ["elegante", "pastel", "tematico"], budget: "cotizar", badge: "Temporada", priceLabel: "A cotizar",
    blurb: "Decoración, mesa principal y detalles para tu baby shower.",
    longDesc: "Un paquete pensado para baby showers: decoración con globos, mesa principal, detalles temáticos y opción de cake topper y centros de mesa. Se arma según el espacio y la cantidad de invitados.",
    recomendado: "Baby showers en casa, salón o restaurante.",
    incluye: ["Decoración con globos", "Mesa principal / backdrop", "Detalles temáticos"],
    personalizable: ["Colores", "Temática", "Tamaño del montaje"],
    opcionales: ["Cake topper", "Centros de mesa", "Recuerdos para invitados"], tiempo: "2 a 3 semanas de anticipación",
  },
  {
    key: "gender-reveal", name: "Kit gender reveal", cat: "sorpresas", occ: ["gender"], style: ["tematico", "colorido"], budget: "medio", priceLabel: "Desde Q890",
    blurb: "Montaje y elemento sorpresa para revelar el género del bebé.",
    longDesc: "Un montaje especial para el momento de la revelación: decoración de globos, elemento sorpresa (globo gigante, caja o cañón) y ambientación coordinada.",
    recomendado: "Gender reveal en casa o salón.",
    incluye: ["Decoración de globos", "Elemento sorpresa a elección", "Montaje en sitio"],
    personalizable: ["Tipo de revelación", "Colores neutros", "Tamaño"],
    opcionales: ["Juegos de gender reveal", "Cake topper", "Backdrop"], tiempo: "1 a 2 semanas de anticipación",
  },
];

const ph = (i: number) => `placeholder:${((i % 6) + 6) % 6}`;

/** Mapa clave-del-prototipo → slug SEO (para enlazar galería y reseñas). */
const KEY_TO_SLUG = Object.fromEntries(RAW.map((p) => [p.key, slugify(p.name)]));

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const SEED_PRODUCTS: Product[] = RAW.map(({ key: _key, badge, ...p }, i) => {
  const slug = slugify(p.name);
  return {
    ...p,
    id: slug,
    slug,
    badge: badge ?? null,
    images: [ph(i), ph(i + 2), ph(i + 4)],
    active: true,
    featured: Boolean(badge),
    sort: i,
  };
});

const G: [string, string, number, string][] = [
  ["Cumpleaños temático", "infantil", 280, "arco-organico"],
  ["Baby shower en pastel", "babyshower", 230, "set-babyshower"],
  ["Arco orgánico de entrada", "adulto", 300, "arco-organico"],
  ["Sorpresa a domicilio", "romantica", 210, "caja-sorpresa"],
  ["Inauguración corporativa", "corporativo", 260, "arreglo-mesa"],
  ["Aniversario elegante", "aniversario", 300, "arreglo-mesa"],
  ["Revelación de género", "gender", 200, "gender-reveal"],
  ["Centros de mesa temáticos", "infantil", 240, "mesa-dulce"],
  ["Backdrop de graduación", "graduacion", 280, "backdrop-panel"],
  ["Bautizo delicado", "bautizo", 220, "arreglo-mesa"],
  ["Cumpleaños de adulto", "adulto", 250, "backdrop-panel"],
  ["Detalle de aniversario", "aniversario", 200, "bouquet-globos"],
];

export const SEED_GALLERY: GalleryItem[] = G.map(([title, occ, h, key], i) => ({
  id: `g${i}`,
  title,
  occ,
  h,
  pid: KEY_TO_SLUG[key],
  img: ph(i + 1),
  sort: i,
}));

const R: [string, string, number, string, "published" | "pending"][] = [
  ["arco-organico", "Andrea M.", 5, "El arco quedó preciosísimo y llegaron puntuales a montar. Todos los invitados preguntaron quién lo hizo.", "published"],
  ["arco-organico", "Luis R.", 4, "Muy buen trabajo y los colores quedaron justo como los pedí. Volvería a contratarlos.", "published"],
  ["caja-sorpresa", "Gabriela S.", 5, "Mandé la sorpresa a mi mamá y le encantó. La presentación es hermosa.", "published"],
  ["mesa-dulce", "Diana P.", 5, "Los centros de mesa fueron el centro de atención. Todo bien coordinado con la temática.", "published"],
  ["arreglo-mesa", "Carmen L.", 4, "Elegantes y discretos, justo lo que buscaba para el aniversario de la empresa.", "published"],
  ["backdrop-panel", "José F.", 3, "El montaje estuvo bien pero llegaron un poco más tarde de lo acordado.", "pending"],
  ["inflable", "Marta V.", 2, "Los juegos estuvieron bien, pero esperaba más opciones para el espacio que tenía.", "pending"],
];

export const SEED_REVIEWS: Review[] = R.map(([key, name, stars, text, status], i) => ({
  id: `r${i + 1}`,
  pid: KEY_TO_SLUG[key],
  name,
  stars,
  text,
  status,
  createdAt: new Date(Date.UTC(2026, 8, 1 + i)).toISOString(),
}));
