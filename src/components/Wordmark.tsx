import Link from "next/link";
import Image from "next/image";

export function Wordmark() {
  return (
    <Link href="/" aria-label="Gem Pursuit home" className="inline-block">
      <Image
        src="/gempursuit-wordmark.png"
        alt="Gem Pursuit"
        width={120}
        height={72}
        className="h-16 w-auto md:h-20"
        priority
      />
    </Link>
  );
}
