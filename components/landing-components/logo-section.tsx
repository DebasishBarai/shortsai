import Link from 'next/link';
import Image from 'next/image';

export const LogoSection = () => {
  return (
    <div className="container w-full flex items-start justify-start py-4">
      <Link href="/" className="flex items-center gap-3">
        <Image
          src="/logo.png"
          alt="Shorts AI Logo"
          width={120}
          height={80}
          className="h-10 w-auto"
          priority
        />
        <span className="text-2xl md:text-4xl font-bold">Shorts AI</span>
      </Link>
    </div>
  )
}
