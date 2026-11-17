import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/utils";

/**
 * Official STIOOS GLOBAL logo (brand wordmark with globe mark,
 * transparent background so it renders on light and dark surfaces alike).
 */
export function Logo({
  className,
  href = "/",
  priority = false,
}: {
  className?: string;
  href?: string | null;
  priority?: boolean;
}) {
  const img = (
    <Image
      src="/stioos-logo.png"
      alt="STIOOS GLOBAL"
      width={800}
      height={173}
      priority={priority}
      sizes="(max-width: 640px) 160px, 220px"
      className={cn("h-auto w-auto object-contain", className)}
    />
  );
  if (!href) return img;
  return (
    <Link href={href} aria-label="STIOOS GLOBAL — Home" className="inline-flex shrink-0 items-center">
      {img}
    </Link>
  );
}

export function LogoMark({
  className,
  href = "/",
}: {
  className?: string;
  href?: string | null;
}) {
  const img = (
    <Image
      src="/stioos-mark.png"
      alt="STIOOS GLOBAL mark"
      width={256}
      height={256}
      sizes="72px"
      className={cn("h-auto w-auto rounded-md object-contain", className)}
    />
  );
  if (!href) return img;
  return (
    <Link href={href} aria-label="STIOOS GLOBAL" className="inline-flex shrink-0 items-center">
      {img}
    </Link>
  );
}
