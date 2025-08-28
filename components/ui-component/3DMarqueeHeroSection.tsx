"use client";

import { useSession } from "@/lib/auth-client";
import { ThreeDMarquee } from "@/components/ui/3d-marquee";
import { Button } from "@/components/ui/button";
import ColourfulText from "@/components/ui/colourful-text";
import Link from "next/link";
import { LayoutDashboardIcon } from "lucide-react";
import { useRouter } from "next/navigation";

export function ThreeDMarqueeHeroSection() {
  const images = [
    '/video/vid1.webp',
    '/video/vid2.webp',
    '/video/vid3.webp',
    '/video/vid4.webp',
    '/video/vid5.webp',
    '/video/vid6.webp',
    '/video/vid1.webp',
    '/video/vid2.webp',
    '/video/vid3.webp',
    '/video/vid4.webp',
    '/video/vid5.webp',
    '/video/vid6.webp',
    '/video/vid1.webp',
    '/video/vid2.webp',
    '/video/vid3.webp',
    '/video/vid4.webp',
    '/video/vid5.webp',
    '/video/vid6.webp',
    '/video/vid1.webp',
    '/video/vid2.webp',
    '/video/vid3.webp',
    '/video/vid4.webp',
    '/video/vid5.webp',
    '/video/vid6.webp',
    '/video/vid1.webp',
    '/video/vid2.webp',
    '/video/vid3.webp',
    '/video/vid4.webp',
    '/video/vid5.webp',
    '/video/vid6.webp',
    '/video/vid1.webp',
    '/video/vid2.webp',
    '/video/vid3.webp',
    '/video/vid4.webp',
    '/video/vid5.webp',
    '/video/vid6.webp',
  ];

  const { data: session } = useSession();
  const router = useRouter();

  return (
    <div className="relative bg-slate-800 mx-auto my-10 flex h-screen w-full max-w-7xl flex-col items-center justify-center overflow-hidden rounded-3xl">
      <h2 className="relative p-4 z-20 mx-auto max-w-4xl text-center text-2xl font-bold text-balance text-black dark:text-white md:text-4xl lg:text-6xl">
        Turn Your Ideas Into Viral Shorts Instantly {" "}
        <span className="relative z-20 inline-block rounded-xl bg-blue-500/40 px-4 py-1 text-black dark:text-white underline decoration-sky-500 decoration-[6px] underline-offset-[16px] backdrop-blur-sm">
          <ColourfulText text='With AI' />
        </span>{" "}
      </h2>
      <p className="relative p-4 z-20 mx-auto max-w-2xl py-8 font-bold text-center text-sm text-black dark:text-white md:text-base">
        Generate scroll-stopping short videos effortlessly. Just give your idea, and let AI handle the rest.
      </p>

      <div className="relative z-20 flex flex-col sm:flex-row gap-4 justify-center">
        {session ? (
          <Link href="/dashboard">
            <Button variant='default'>
              <LayoutDashboardIcon className="h-4 w-4 mr-2" />
              Go To Dashboard
            </Button>
          </Link>
        ) : (
          <Button
            onClick={() => router.push('/login')}
            variant='default'>
            Join the club
          </Button>
        )}
        <Link href="/pricing">
          <Button variant="outline" size="lg" className="border-2 shadow-sm">
            View Pricing
          </Button>
        </Link>
      </div>

      {/* overlay */}
      <div className="absolute inset-0 z-10 h-full w-full bg-slate-50/40 dark:bg-slate-800/40" />
      <ThreeDMarquee
        className="pointer-events-none absolute inset-0 h-full w-full bg-slate-50/40 dark:bg-slate-800/40"
        images={images}
      />
    </div>
  );
}
