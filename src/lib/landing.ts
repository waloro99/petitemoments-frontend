// Páginas de aterrizaje para Google: una por servicio y una por tipo de evento.
// Cada una tiene texto propio (título, introducción y preguntas frecuentes) y muestra
// automáticamente los productos y fotos que la clienta suba desde el panel.

import { SITE } from "./config";

export type LandingKind = "servicios" | "eventos";

export type Landing = {
  kind: LandingKind;
  slug: string;
  /** Nombre corto para menús y enlaces. */
  label: string;
  /** <title> (la plantilla agrega "· Petite Moments GT"). Pensado para la búsqueda principal. */
  title: string;
  /** Meta description, máx. ~155 caracteres. */
  description: string;
  h1: string;
  intro: string[];
  incluye: string[];
  faqs: { q: string; a: string }[];
  /** Qué productos y fotos se muestran. */
  categories?: string[];
  occasions?: string[];
  /** Enlace "ver más" dentro del catálogo filtrado. */
  catalogHref: string;
  /** Mensaje prellenado de WhatsApp. */
  wa: string;
};

const zona = SITE.coverage; // "Ciudad de Guatemala y alrededores"

const faqCotizar = {
  q: "¿Cómo cotizo?",
  a: "Escríbenos por WhatsApp o llena el formulario de cotización con la fecha, la zona, el tipo de evento y la idea que tienes. Te respondemos con opciones y precio según tu presupuesto.",
};
const faqCobertura = {
  q: "¿A qué zonas llegan?",
  a: `Trabajamos en ${zona}. Al cotizar confirmamos disponibilidad y el costo de traslado según tu dirección.`,
};
const faqAnticipacion = {
  q: "¿Con cuánto tiempo debo reservar?",
  a: "Mientras antes, mejor: las fechas de fin de semana se llenan rápido. Para pedidos personalizados te recomendamos escribirnos con al menos una o dos semanas de anticipación; si es para pronto, pregúntanos igual y vemos disponibilidad.",
};

export const LANDINGS: Landing[] = [
  /* ------------------------------------------------------------ Servicios */
  {
    kind: "servicios",
    slug: "decoracion-con-globos",
    label: "Decoración con globos",
    title: "Decoración con globos en Guatemala · arcos, backdrops y columnas",
    description:
      "Decoración con globos en Ciudad de Guatemala: arcos orgánicos, backdrops, columnas, números y bouquets para cumpleaños, baby showers y eventos. Cotiza por WhatsApp.",
    h1: "Decoración con globos en Guatemala",
    intro: [
      "Montamos decoración con globos para cumpleaños, baby showers, gender reveals, graduaciones, aniversarios y eventos de empresa en Ciudad de Guatemala.",
      "Elegimos contigo la paleta de colores, los acabados (mate, cromado, confeti, transparentes) y el tamaño del montaje para que todo combine con tu temática y con el espacio.",
    ],
    incluye: ["Arcos orgánicos y guirnaldas", "Backdrops y fondos para fotos", "Columnas, números y letras", "Bouquets y globos con mensaje personalizado", "Montaje y retiro en el lugar del evento"],
    faqs: [
      { q: "¿Qué tipo de decoración con globos hacen?", a: "Arcos orgánicos, guirnaldas, backdrops, columnas, números, bouquets, globos burbuja con vinil personalizado y decoración de mesas principales." },
      { q: "¿Pueden usar los colores de mi temática?", a: "Sí. Trabajamos con la paleta que nos compartas o te proponemos una combinación según el estilo del evento." },
      faqAnticipacion,
      faqCobertura,
      faqCotizar,
    ],
    categories: ["globos", "bouquets", "arreglos"],
    catalogHref: "/catalogo?categoria=globos",
    wa: "Hola Petite Moments, quiero cotizar decoración con globos para mi evento.",
  },
  {
    kind: "servicios",
    slug: "sorpresas-personalizadas",
    label: "Sorpresas personalizadas",
    title: "Sorpresas personalizadas en Guatemala · cajas, globos y detalles",
    description:
      "Sorpresas personalizadas en Ciudad de Guatemala: cajas sorpresa, globos con mensaje y detalles para cumpleaños, aniversarios y fechas especiales. Cotiza por WhatsApp.",
    h1: "Sorpresas personalizadas en Guatemala",
    intro: [
      "Preparamos sorpresas personalizadas para cumpleaños, aniversarios, San Valentín, Día de la Madre, graduaciones o simplemente para decir “pienso en ti”.",
      "Cada detalle se arma con el nombre, el mensaje y los gustos de la persona que lo recibe, para que la sorpresa se sienta hecha para ella.",
    ],
    incluye: ["Cajas y bolsas sorpresa", "Globos con mensaje y nombre", "Bouquets de globos", "Detalles para fechas especiales", "Personalización con nombres, frases y colores"],
    faqs: [
      { q: "¿Puedo personalizar el mensaje?", a: "Sí, todas las sorpresas se personalizan con el nombre, la frase y los colores que elijas." },
      { q: "¿Hacen sorpresas para el mismo día?", a: "Depende de la agenda y del tipo de detalle. Escríbenos por WhatsApp y te confirmamos qué opciones hay disponibles para la fecha." },
      faqCobertura,
      faqCotizar,
    ],
    categories: ["sorpresas", "bouquets"],
    occasions: ["romantica", "aniversario"],
    catalogHref: "/catalogo?categoria=sorpresas",
    wa: "Hola Petite Moments, quiero cotizar una sorpresa personalizada.",
  },
  {
    kind: "servicios",
    slug: "cake-toppers-personalizados",
    label: "Cake toppers",
    title: "Cake toppers personalizados en Guatemala · nombres, edades y temáticas",
    description:
      "Cake toppers personalizados en Guatemala con nombre, edad y temática para pasteles y cupcakes de cumpleaños, baby shower, bautizo y boda. Cotiza por WhatsApp.",
    h1: "Cake toppers personalizados en Guatemala",
    intro: [
      "Diseñamos cake toppers personalizados con el nombre, la edad y la temática de tu celebración para darle el toque final a tu pastel.",
      "También hacemos toppers para cupcakes, para que toda la mesa de postres combine con la decoración.",
    ],
    incluye: ["Toppers con nombre y edad", "Toppers temáticos", "Toppers para cupcakes", "Colores y tipografías a tu gusto"],
    faqs: [
      { q: "¿Qué información necesito para pedir un cake topper?", a: "El texto (nombre, edad o frase), la temática o colores y el tamaño aproximado del pastel. Si tienes una imagen de referencia, compártela por WhatsApp." },
      { q: "¿Combinan el topper con la decoración del evento?", a: "Sí. Si también decoramos tu evento, el topper se diseña con la misma paleta y estilo." },
      faqAnticipacion,
      faqCotizar,
    ],
    categories: ["cake-toppers"],
    catalogHref: "/catalogo?categoria=cake-toppers",
    wa: "Hola Petite Moments, quiero cotizar un cake topper personalizado.",
  },
  {
    kind: "servicios",
    slug: "centros-de-mesa-personalizados",
    label: "Centros de mesa y personalizables",
    title: "Centros de mesa personalizados en Guatemala · vinil y detalles para eventos",
    description:
      "Centros de mesa personalizados, vinil para globos, pizarrones y detalles hechos a tu estilo para eventos en Ciudad de Guatemala. Cotiza por WhatsApp.",
    h1: "Centros de mesa y personalizables para eventos",
    intro: [
      "Hacemos centros de mesa personalizados y piezas a la medida para que tu evento tenga una identidad propia: vinil para globos, juegos de gender reveal, pizarrones de bienvenida y más.",
      "Todo se diseña con los colores, nombres y temática de tu celebración.",
    ],
    incluye: ["Centros de mesa personalizados", "Vinil personalizado para globos", "Pizarrones y letreros de bienvenida", "Juegos de gender reveal", "Detalles de crafting a medida"],
    faqs: [
      { q: "¿Los centros de mesa se pueden llevar los invitados?", a: "Sí, podemos diseñarlos para que funcionen también como recuerdo. Indícanoslo al cotizar." },
      { q: "¿Hacen pedidos por cantidad?", a: "Sí. Cotizamos según el número de mesas o piezas que necesites." },
      faqAnticipacion,
      faqCotizar,
    ],
    categories: ["personalizables", "arreglos"],
    catalogHref: "/catalogo?categoria=personalizables",
    wa: "Hola Petite Moments, quiero cotizar centros de mesa / personalizables para mi evento.",
  },
  {
    kind: "servicios",
    slug: "juegos-para-eventos",
    label: "Juegos para eventos",
    title: "Juegos para eventos en Guatemala · hockey de mesa, fútbol y más",
    description:
      "Alquiler de juegos para eventos en Ciudad de Guatemala: hockey de mesa, fútbol, básquet y más para cumpleaños y celebraciones. Cotiza por WhatsApp.",
    h1: "Juegos para eventos en Guatemala",
    intro: [
      "Llevamos juegos para que grandes y chicos se diviertan en tu celebración: hockey de mesa, fútbol, básquet y otras opciones según el espacio y la edad de los invitados.",
      "Puedes cotizarlos solos o junto con la decoración en un paquete.",
    ],
    incluye: ["Hockey de mesa", "Fútbol y básquet", "Juegos para niños y adultos", "Combinables con decoración en paquete"],
    faqs: [
      { q: "¿Los juegos sirven para adultos también?", a: "Sí, varios juegos funcionan para todas las edades. Cuéntanos quiénes asistirán y te recomendamos los más adecuados." },
      { q: "¿Cuánto espacio necesito?", a: "Depende del juego. Al cotizar te indicamos el espacio aproximado de cada uno." },
      faqCobertura,
      faqCotizar,
    ],
    categories: ["juegos"],
    catalogHref: "/catalogo?categoria=juegos",
    wa: "Hola Petite Moments, quiero cotizar juegos para mi evento.",
  },
  {
    kind: "servicios",
    slug: "paquetes-para-eventos",
    label: "Paquetes para eventos",
    title: "Paquetes para eventos en Guatemala · decoración, cake topper y juegos",
    description:
      "Paquetes para eventos en Ciudad de Guatemala: decoración con globos, cake topper, personalizables y juegos en una sola cotización. Escríbenos por WhatsApp.",
    h1: "Paquetes para eventos en Guatemala",
    intro: [
      "Arma tu celebración completa en un solo lugar: decoración con globos, cake topper, personalizables y juegos, todo coordinado con la misma temática.",
      "Un paquete te ahorra tiempo y te asegura que todo combine. Cuéntanos tu idea y tu presupuesto y te proponemos opciones.",
    ],
    incluye: ["Decoración con globos", "Cake topper personalizado", "Centros de mesa y personalizables", "Juegos para invitados", "Una sola coordinación de principio a fin"],
    faqs: [
      { q: "¿Puedo armar mi propio paquete?", a: "Sí. Elige los servicios que necesitas y te damos una cotización conjunta." },
      faqAnticipacion,
      faqCobertura,
      faqCotizar,
    ],
    categories: ["paquetes"],
    catalogHref: "/catalogo?categoria=paquetes",
    wa: "Hola Petite Moments, quiero cotizar un paquete completo para mi evento.",
  },

  /* ------------------------------------------------------------ Eventos */
  {
    kind: "eventos",
    slug: "cumpleanos-infantiles",
    label: "Cumpleaños infantiles",
    title: "Decoración para cumpleaños infantiles en Guatemala",
    description:
      "Decoración para cumpleaños infantiles en Ciudad de Guatemala: globos temáticos, cake toppers, centros de mesa y juegos. Cotiza tu fiesta por WhatsApp.",
    h1: "Decoración para cumpleaños infantiles",
    intro: [
      "Hacemos realidad la fiesta que tu peque imagina: decoración con globos de su personaje o temática favorita, cake topper con su nombre y edad, centros de mesa y juegos para los invitados.",
      "Nos adaptamos a casa, salón o jardín y a tu presupuesto.",
    ],
    incluye: ["Decoración temática con globos", "Backdrop para fotos", "Cake topper con nombre y edad", "Centros de mesa", "Juegos para niños"],
    faqs: [faqAnticipacion, faqCobertura, faqCotizar],
    occasions: ["infantil"],
    catalogHref: "/catalogo?ocasion=infantil",
    wa: "Hola Petite Moments, quiero cotizar la decoración de un cumpleaños infantil.",
  },
  {
    kind: "eventos",
    slug: "baby-shower",
    label: "Baby shower",
    title: "Decoración para baby shower en Guatemala",
    description:
      "Decoración para baby shower en Ciudad de Guatemala: globos en tonos pastel, backdrop, cake topper y centros de mesa personalizados. Cotiza por WhatsApp.",
    h1: "Decoración para baby shower",
    intro: [
      "Decoramos baby showers con estilo: arcos de globos en tonos suaves, backdrops para fotos, cake topper y centros de mesa con el nombre del bebé.",
      "Te ayudamos a elegir la paleta y la temática para que el espacio se vea armonioso.",
    ],
    incluye: ["Arco o backdrop de globos", "Letreros y vinil con el nombre del bebé", "Cake topper", "Centros de mesa personalizados"],
    faqs: [faqAnticipacion, faqCobertura, faqCotizar],
    occasions: ["babyshower"],
    catalogHref: "/catalogo?ocasion=babyshower",
    wa: "Hola Petite Moments, quiero cotizar la decoración de un baby shower.",
  },
  {
    kind: "eventos",
    slug: "gender-reveal",
    label: "Gender reveal",
    title: "Decoración y juegos para gender reveal en Guatemala",
    description:
      "Gender reveal en Ciudad de Guatemala: decoración con globos, globo revelación, juegos y personalizables para descubrir si es niño o niña. Cotiza por WhatsApp.",
    h1: "Decoración y juegos para gender reveal",
    intro: [
      "Preparamos tu gender reveal con decoración en rosa y celeste (o la paleta que prefieras), globo de revelación y juegos personalizados para que los invitados participen.",
    ],
    incluye: ["Decoración con globos", "Globo de revelación", "Juegos personalizados de votación", "Cake topper"],
    faqs: [faqAnticipacion, faqCobertura, faqCotizar],
    occasions: ["gender"],
    catalogHref: "/catalogo?ocasion=gender",
    wa: "Hola Petite Moments, quiero cotizar un gender reveal.",
  },
  {
    kind: "eventos",
    slug: "graduaciones",
    label: "Graduaciones",
    title: "Decoración para graduaciones en Guatemala",
    description:
      "Decoración para graduaciones en Ciudad de Guatemala: globos, números, backdrop para fotos, sorpresas y cake toppers personalizados. Cotiza por WhatsApp.",
    h1: "Decoración para graduaciones",
    intro: [
      "Celebra el logro con decoración de globos en los colores del colegio o la universidad, backdrop para fotos, números del año y sorpresas personalizadas para el graduado.",
    ],
    incluye: ["Globos en colores institucionales", "Números y letras", "Backdrop para fotos", "Sorpresas y cake topper"],
    faqs: [faqAnticipacion, faqCobertura, faqCotizar],
    occasions: ["graduacion"],
    catalogHref: "/catalogo?ocasion=graduacion",
    wa: "Hola Petite Moments, quiero cotizar la decoración de una graduación.",
  },
  {
    kind: "eventos",
    slug: "bautizos",
    label: "Bautizos",
    title: "Decoración para bautizos en Guatemala",
    description:
      "Decoración para bautizos y primeras comuniones en Ciudad de Guatemala: globos en tonos suaves, centros de mesa y cake topper personalizado. Cotiza por WhatsApp.",
    h1: "Decoración para bautizos",
    intro: [
      "Decoración delicada para bautizos y primeras comuniones: globos en blanco y tonos suaves, centros de mesa, letreros con el nombre y cake topper personalizado.",
    ],
    incluye: ["Decoración con globos en tonos suaves", "Centros de mesa", "Letrero de bienvenida", "Cake topper"],
    faqs: [faqAnticipacion, faqCobertura, faqCotizar],
    occasions: ["bautizo"],
    catalogHref: "/catalogo?ocasion=bautizo",
    wa: "Hola Petite Moments, quiero cotizar la decoración de un bautizo.",
  },
  {
    kind: "eventos",
    slug: "cumpleanos-adultos",
    label: "Cumpleaños de adultos",
    title: "Decoración para cumpleaños de adultos en Guatemala",
    description:
      "Decoración elegante para cumpleaños de adultos en Ciudad de Guatemala: globos, números, backdrop, sorpresas y cake toppers. Cotiza por WhatsApp.",
    h1: "Decoración para cumpleaños de adultos",
    intro: [
      "Para cumpleaños de 15, 18, 30, 40, 50 o los que celebres: decoración elegante con globos, números gigantes, backdrop para fotos y detalles personalizados.",
    ],
    incluye: ["Números y letras", "Backdrop elegante", "Sorpresas personalizadas", "Cake topper con la edad"],
    faqs: [faqAnticipacion, faqCobertura, faqCotizar],
    occasions: ["adulto"],
    catalogHref: "/catalogo?ocasion=adulto",
    wa: "Hola Petite Moments, quiero cotizar la decoración de un cumpleaños.",
  },
  {
    kind: "eventos",
    slug: "aniversarios-y-sorpresas-romanticas",
    label: "Aniversarios y sorpresas románticas",
    title: "Sorpresas románticas y decoración de aniversario en Guatemala",
    description:
      "Sorpresas románticas y decoración de aniversario en Ciudad de Guatemala: globos, cajas sorpresa y detalles personalizados para tu pareja. Cotiza por WhatsApp.",
    h1: "Aniversarios y sorpresas románticas",
    intro: [
      "Sorprende a tu pareja con una decoración romántica en casa, un bouquet de globos con mensaje o una caja sorpresa con detalles que hablen de ustedes.",
    ],
    incluye: ["Decoración romántica con globos", "Bouquets con mensaje", "Cajas sorpresa", "Detalles personalizados"],
    faqs: [faqCobertura, faqCotizar],
    occasions: ["aniversario", "romantica"],
    catalogHref: "/catalogo?ocasion=romantica",
    wa: "Hola Petite Moments, quiero cotizar una sorpresa romántica.",
  },
  {
    kind: "eventos",
    slug: "eventos-corporativos",
    label: "Eventos corporativos",
    title: "Decoración para eventos corporativos en Guatemala",
    description:
      "Decoración para eventos corporativos en Ciudad de Guatemala: globos con colores de marca, backdrops, lanzamientos y celebraciones de empresa. Cotiza por WhatsApp.",
    h1: "Decoración para eventos corporativos",
    intro: [
      "Decoramos lanzamientos, aniversarios de empresa, activaciones y celebraciones de equipo con los colores de tu marca: arcos de globos, backdrops con logo y detalles personalizados.",
    ],
    incluye: ["Globos con colores de marca", "Backdrop con logo", "Decoración de stands y entradas", "Detalles personalizados para colaboradores"],
    faqs: [
      { q: "¿Emiten factura?", a: "Consúltanos al cotizar y te confirmamos las opciones de pago y facturación." },
      faqAnticipacion,
      faqCotizar,
    ],
    occasions: ["corporativo"],
    catalogHref: "/catalogo?ocasion=corporativo",
    wa: "Hola Petite Moments, quiero cotizar decoración para un evento de empresa.",
  },
];

export const landingsOf = (kind: LandingKind) => LANDINGS.filter((l) => l.kind === kind);
export const findLanding = (kind: LandingKind, slug: string) => LANDINGS.find((l) => l.kind === kind && l.slug === slug);
export const landingHref = (l: Pick<Landing, "kind" | "slug">) => `/${l.kind}/${l.slug}`;
