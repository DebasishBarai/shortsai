"use client";

import { useSession } from "@/lib/auth-client";
import { ThreeDMarquee } from "@/components/ui/3d-marquee";
import { Button } from "../ui/button";
import ColourfulText from "../ui/colourful-text";
import Link from "next/link";
import { LayoutDashboardIcon } from "lucide-react";
import { useRouter } from "next/navigation";

export function ThreeDMarqueeHeroSection() {
  const images = [
    'https://debb-bucket.s3.ap-south-1.amazonaws.com/converted.gif',
    'https://debb-bucket.s3.ap-south-1.amazonaws.com/converted.gif',
    'https://debb-bucket.s3.ap-south-1.amazonaws.com/converted.gif',
    'https://debb-bucket.s3.ap-south-1.amazonaws.com/converted.gif',
    'https://debb-bucket.s3.ap-south-1.amazonaws.com/converted.gif',
    'https://debb-bucket.s3.ap-south-1.amazonaws.com/converted.gif',
    'https://debb-bucket.s3.ap-south-1.amazonaws.com/converted.gif',
    'https://debb-bucket.s3.ap-south-1.amazonaws.com/converted.gif',
    'https://debb-bucket.s3.ap-south-1.amazonaws.com/converted.gif',
    'https://debb-bucket.s3.ap-south-1.amazonaws.com/converted.gif',
    'https://debb-bucket.s3.ap-south-1.amazonaws.com/converted.gif',
    'https://debb-bucket.s3.ap-south-1.amazonaws.com/converted.gif',
    'https://debb-bucket.s3.ap-south-1.amazonaws.com/converted.gif',
    'https://debb-bucket.s3.ap-south-1.amazonaws.com/converted.gif',
    'https://debb-bucket.s3.ap-south-1.amazonaws.com/converted.gif',
    'https://debb-bucket.s3.ap-south-1.amazonaws.com/converted.gif',
    'https://debb-bucket.s3.ap-south-1.amazonaws.com/converted.gif',
    'https://debb-bucket.s3.ap-south-1.amazonaws.com/converted.gif',
    'https://debb-bucket.s3.ap-south-1.amazonaws.com/converted.gif',
    'https://debb-bucket.s3.ap-south-1.amazonaws.com/converted.gif',
    'https://debb-bucket.s3.ap-south-1.amazonaws.com/converted.gif',
    'https://debb-bucket.s3.ap-south-1.amazonaws.com/converted.gif',
    'https://debb-bucket.s3.ap-south-1.amazonaws.com/converted.gif',
    'https://debb-bucket.s3.ap-south-1.amazonaws.com/converted.gif',
    'https://debb-bucket.s3.ap-south-1.amazonaws.com/converted.gif',
    'https://debb-bucket.s3.ap-south-1.amazonaws.com/converted.gif',
    'https://debb-bucket.s3.ap-south-1.amazonaws.com/converted.gif',
  ];

  const { data: session } = useSession();
  const router = useRouter();

  return (
    <div className="relative mx-auto my-10 flex h-screen w-full max-w-7xl flex-col items-center justify-center overflow-hidden rounded-3xl">
      <h2 className="relative z-20 mx-auto max-w-4xl text-center text-2xl font-bold text-balance text-white md:text-4xl lg:text-6xl">
        Turn Your Ideas Into Viral Shorts Instantly {" "}
        <span className="relative z-20 inline-block rounded-xl bg-blue-500/40 px-4 py-1 text-white underline decoration-sky-500 decoration-[6px] underline-offset-[16px] backdrop-blur-sm">
          <ColourfulText text='With AI' />
        </span>{" "}
      </h2>
      <p className="relative z-20 mx-auto max-w-2xl py-8 text-center text-sm text-neutral-200 md:text-base">
        Generate scroll-stopping short videos effortlessly. Just give your idea, and let AI handle the rest.
      </p>

      <div className="relative z-20 flex flex-wrap items-center justify-center gap-4 pt-4">
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
          <button className="rounded-md border border-white/20 bg-white/10 px-6 py-2.5 text-sm font-medium text-white backdrop-blur-sm transition-colors hover:bg-white/20 focus:ring-2 focus:ring-white/20 focus:ring-offset-2 focus:ring-offset-black focus:outline-none">
            View Pricing
          </button>
        </Link>
      </div>

      {/* overlay */}
      <div className="absolute inset-0 z-10 h-full w-full bg-black/40 dark:bg-black/40" />
      <ThreeDMarquee
        className="pointer-events-none absolute inset-0 h-full w-full"
        images={images}
      />
    </div>
  );
}
