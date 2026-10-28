import Image from "next/image";
import Link from "next/link";
import logo from "../../../public/brand/logo-petite-moments.png";
import logoLight from "../../../public/brand/logo-petite-moments-claro.png";

/** Logo oficial de la marca (wordmark "Petite Moments"). */
export function Logo() {
  return (
    <Link href="/" className="flex items-center rounded-lg" aria-label="Petite Moments Guatemala, inicio">
      <Image src={logo} alt="Petite Moments" priority className="h-[54px] w-auto mob:h-[46px]" sizes="130px" />
    </Link>
  );
}

/** Versión clara para fondos oscuros (footer). */
export function LogoLight({ className = "h-[64px] w-auto" }: { className?: string }) {
  return <Image src={logoLight} alt="Petite Moments" className={className} sizes="150px" />;
}
