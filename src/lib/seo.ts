import { SITE } from "./config";

export const KEYWORDS = [
  "decoración con globos Guatemala",
  "globos personalizados Guatemala",
  "sorpresas para cumpleaños Guatemala",
  "baby shower Guatemala",
  "inflables para eventos Guatemala",
  "repostería para eventos Guatemala",
  "fotografía de cumpleaños Guatemala",
  "decoración de eventos en Ciudad de Guatemala",
];

export const absUrl = (path = "/") => `${SITE.url}${path.startsWith("/") ? path : `/${path}`}`;

export function localBusinessLd() {
  return {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "@id": `${SITE.url}/#negocio`,
    name: SITE.name,
    description: SITE.description,
    url: SITE.url,
    telephone: `+${SITE.whatsapp}`,
    email: SITE.email,
    image: absUrl("/opengraph-image"),
    priceRange: "Q–QQQ",
    address: {
      "@type": "PostalAddress",
      addressLocality: SITE.city,
      addressRegion: SITE.region,
      addressCountry: SITE.country,
    },
    areaServed: { "@type": "City", name: SITE.city },
    openingHoursSpecification: [
      {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
        opens: "09:00",
        closes: "19:00",
      },
    ],
    sameAs: [`https://instagram.com/${SITE.instagram}`],
  };
}

export function breadcrumbLd(items: { name: string; path: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((it, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: it.name,
      item: absUrl(it.path),
    })),
  };
}
