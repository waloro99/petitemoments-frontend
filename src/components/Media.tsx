import Image from "next/image";

// Gradientes de relleno del prototipo; se usan mientras no haya fotografía real.
export const PLACEHOLDER_TILES = [
  "linear-gradient(150deg,#F3DBD9,#EAD3BE)",
  "linear-gradient(150deg,#EFE0C9,#E8C6C9)",
  "linear-gradient(150deg,#EAEAE0,#E1CBD1)",
  "linear-gradient(150deg,#F0E4DC,#E7C7CB)",
  "linear-gradient(150deg,#E8D7C4,#E9C9CC)",
  "linear-gradient(150deg,#EDE3E7,#E8CEBE)",
];

export const isPlaceholder = (src?: string | null) => !src || src.startsWith("placeholder:");

export function placeholderBg(src?: string | null): string {
  const n = src && src.startsWith("placeholder:") ? Number(src.split(":")[1]) || 0 : 0;
  return PLACEHOLDER_TILES[((n % 6) + 6) % 6];
}

type Props = {
  src?: string | null;
  alt: string;
  sizes: string;
  priority?: boolean;
  className?: string;
};

/** Imagen que llena a su contenedor (que debe ser `relative`). */
export function Media({ src, alt, sizes, priority, className = "" }: Props) {
  if (isPlaceholder(src)) {
    return (
      <span
        role="img"
        aria-label={alt}
        className={`absolute inset-0 block ${className}`}
        style={{ background: placeholderBg(src) }}
      />
    );
  }
  return (
    <Image
      src={src!}
      alt={alt}
      fill
      sizes={sizes}
      priority={priority}
      className={`object-cover ${className}`}
    />
  );
}
