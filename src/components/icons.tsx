// Iconos lineales del prototipo (stroke fino, currentColor).
import type { SVGProps } from "react";

type P = SVGProps<SVGSVGElement> & { size?: number };

const base = (size: number, props: SVGProps<SVGSVGElement>, sw = 1.5) => ({
  width: size,
  height: size,
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: sw,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
  "aria-hidden": true,
  focusable: false,
  ...props,
});

export function WhatsAppIcon({ size = 18, ...p }: P) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden focusable={false} {...p}>
      <path d="M17.5 14.4c-.3-.15-1.77-.87-2.04-.97-.27-.1-.47-.15-.67.15-.2.3-.77.97-.94 1.17-.17.2-.35.22-.65.07-.3-.15-1.26-.46-2.4-1.48-.89-.79-1.49-1.77-1.66-2.07-.17-.3-.02-.46.13-.61.13-.13.3-.35.45-.52.15-.17.2-.3.3-.5.1-.2.05-.37-.02-.52-.08-.15-.67-1.61-.92-2.21-.24-.58-.49-.5-.67-.51h-.57c-.2 0-.52.07-.8.37-.27.3-1.04 1.02-1.04 2.48s1.07 2.88 1.22 3.08c.15.2 2.1 3.2 5.08 4.49.71.31 1.26.49 1.69.62.71.23 1.36.2 1.87.12.57-.08 1.77-.72 2.02-1.42.25-.7.25-1.29.17-1.42-.07-.13-.27-.2-.57-.35zM12 2a10 10 0 0 0-8.53 15.26L2 22l4.86-1.27A10 10 0 1 0 12 2z" />
    </svg>
  );
}
export const MenuIcon = ({ size = 22, ...p }: P) => (
  <svg {...base(size, p, 1.8)}><path d="M4 7h16M4 12h16M4 17h16" /></svg>
);
export const CloseIcon = ({ size = 22, ...p }: P) => (
  <svg {...base(size, p, 1.8)}><path d="M6 6l12 12M18 6L6 18" /></svg>
);
export const BalloonsIcon = ({ size = 26, ...p }: P) => (
  <svg {...base(size, p, 1.4)}><circle cx="8" cy="8" r="5" /><circle cx="16" cy="10" r="4.5" /><path d="M8 13v3M16 14.5v3M6.5 19h3M14.5 19h3" /></svg>
);
export const GiftIcon = ({ size = 26, ...p }: P) => (
  <svg {...base(size, p, 1.4)}><path d="M4 10h16v9a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2z" /><path d="M3 7h18v3H3zM12 7V4M9 4.5a1.5 1.5 0 1 1 3 0M15 4.5a1.5 1.5 0 1 0-3 0M12 10v11" /></svg>
);
export const CakeIcon = ({ size = 26, ...p }: P) => (
  <svg {...base(size, p, 1.4)}><path d="M5 21h14v-7H5zM5 14c0-2 1.5-3 3.5-3s2.5 1 3.5 1 1.5-1 3.5-1 3 1 3 3M12 8V4M12 4l-1.5-1.5M12 4l1.5-1.5" /></svg>
);
export const CameraIcon = ({ size = 26, ...p }: P) => (
  <svg {...base(size, p, 1.4)}><path d="M3 8a2 2 0 0 1 2-2h2l1.5-2h7L17 6h2a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" /><circle cx="12" cy="13" r="3.5" /></svg>
);
export const InflatableIcon = ({ size = 26, ...p }: P) => (
  <svg {...base(size, p, 1.4)}><path d="M4 15c0-5 3.5-9 8-9s8 4 8 9M4 15h16v2a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2zM9 6.5V15M15 6.5V15" /></svg>
);
export const PackageIcon = ({ size = 26, ...p }: P) => (
  <svg {...base(size, p, 1.4)}><path d="M3 8h18v11a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1zM3 8l2-4h14l2 4M12 4v16M8 12h2M14 12h2" /></svg>
);
export const CheckCircleIcon = ({ size = 24, ...p }: P) => (
  <svg {...base(size, p)}><path d="M9 11l2 2 4-4" /><circle cx="12" cy="12" r="9" /></svg>
);
export const UserIcon = ({ size = 24, ...p }: P) => (
  <svg {...base(size, p)}><path d="M20 21a8 8 0 0 0-16 0" /><circle cx="12" cy="8" r="4" /></svg>
);
export const DollarIcon = ({ size = 24, ...p }: P) => (
  <svg {...base(size, p)}><path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" /></svg>
);
export const PinIcon = ({ size = 24, ...p }: P) => (
  <svg {...base(size, p)}><path d="M12 21s7-5.5 7-11a7 7 0 0 0-14 0c0 5.5 7 11 7 11z" /><circle cx="12" cy="10" r="2.5" /></svg>
);
export const GridIcon = ({ size = 24, ...p }: P) => (
  <svg {...base(size, p)}><rect x="3" y="3" width="7" height="7" rx="1.5" /><rect x="14" y="3" width="7" height="7" rx="1.5" /><rect x="3" y="14" width="7" height="7" rx="1.5" /><rect x="14" y="14" width="7" height="7" rx="1.5" /></svg>
);
export const PhotoIcon = ({ size = 24, ...p }: P) => (
  <svg {...base(size, p)}><rect x="3" y="4" width="18" height="15" rx="2" /><circle cx="9" cy="10" r="2" /><path d="M3 16l5-4 4 3 3-2 6 5" /></svg>
);
export const ImagesIcon = ({ size = 12, ...p }: P) => (
  <svg {...base(size, p, 2)}><rect x="3" y="3" width="18" height="18" rx="2" /><path d="M3 15l5-5 4 4 3-3 6 6" /></svg>
);
export const ExpandIcon = ({ size = 15, ...p }: P) => (
  <svg {...base(size, p, 2)}><path d="M15 3h6v6M14 10l7-7M9 21H3v-6M10 14l-7 7" /></svg>
);
export const ChevronLeft = ({ size = 20, ...p }: P) => (
  <svg {...base(size, p, 2)}><path d="M15 18l-6-6 6-6" /></svg>
);
export const ChevronRight = ({ size = 20, ...p }: P) => (
  <svg {...base(size, p, 2)}><path d="M9 6l6 6-6 6" /></svg>
);
export const CheckIcon = ({ size = 19, ...p }: P) => (
  <svg {...base(size, p, 2)}><path d="M20 6L9 17l-5-5" /></svg>
);
export const ClockIcon = ({ size = 18, ...p }: P) => (
  <svg {...base(size, p, 1.6)}><circle cx="12" cy="12" r="9" /><path d="M12 7v5l3 2" /></svg>
);
export const LockIcon = ({ size = 27, ...p }: P) => (
  <svg {...base(size, p, 1.6)}><rect x="4" y="10" width="16" height="11" rx="2" /><path d="M8 10V7a4 4 0 0 1 8 0v3" /></svg>
);
export const PlusIcon = ({ size = 15, ...p }: P) => (
  <svg {...base(size, p, 2.2)}><path d="M12 5v14M5 12h14" /></svg>
);
export const TrashIcon = ({ size = 16, ...p }: P) => (
  <svg {...base(size, p, 1.8)}><path d="M4 7h16M9 7V5a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2M6 7l1 13a1 1 0 0 0 1 1h8a1 1 0 0 0 1-1l1-13" /></svg>
);
export const UploadIcon = ({ size = 20, ...p }: P) => (
  <svg {...base(size, p, 1.6)}><path d="M12 16V4M7 9l5-5 5 5" /><path d="M4 16v3a1 1 0 0 0 1 1h14a1 1 0 0 0 1-1v-3" /></svg>
);
export const TagIcon = ({ size = 16, ...p }: P) => (
  <svg {...base(size, p, 1.8)}><path d="M20.6 13.4L11 3.8A2 2 0 0 0 9.6 3H4v5.6a2 2 0 0 0 .6 1.4l9.6 9.6a2 2 0 0 0 2.8 0l3.6-3.6a2 2 0 0 0 0-2.8z" /><circle cx="7.5" cy="7.5" r="1" /></svg>
);
export const ImagePlaceholderIcon = ({ size = 40, ...p }: P) => (
  <svg {...base(size, p, 1.3)}><rect x="3" y="3" width="18" height="18" rx="3" /><path d="M3 15l5-5 4 4 3-3 6 6" /><circle cx="9" cy="9" r="1.5" /></svg>
);
export const MailIcon = ({ size = 18, ...p }: P) => (
  <svg {...base(size, p, 1.6)}><rect x="3" y="5" width="18" height="14" rx="2" /><path d="M3 7l9 6 9-6" /></svg>
);
export const InstagramIcon = ({ size = 16, ...p }: P) => (
  <svg {...base(size, p, 1.6)}><rect x="3" y="3" width="18" height="18" rx="5" /><circle cx="12" cy="12" r="4" /><circle cx="17.5" cy="6.5" r=".8" fill="currentColor" /></svg>
);
export const CraftIcon = ({ size = 26, ...p }: P) => (
  <svg {...base(size, p, 1.4)}><path d="M12 3l1.8 3.9 4.2.5-3.1 2.9.8 4.2L12 12.4 8.3 14.5l.8-4.2L6 7.4l4.2-.5z" /><path d="M5 21h14M8 17.5h8" /></svg>
);
export const BallIcon = ({ size = 26, ...p }: P) => (
  <svg {...base(size, p, 1.4)}><circle cx="12" cy="12" r="8.5" /><path d="M12 3.5v17M3.5 12h17M6 6c2.6 2.3 2.6 9.7 0 12M18 6c-2.6 2.3-2.6 9.7 0 12" /></svg>
);
