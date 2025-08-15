'use client';

import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Check, Megaphone, Users, TrendingUp, Sparkles, Play, ArrowRight, Bot, Video, Timer, Rocket, Mic } from "lucide-react";
import { PricingCards } from "@/components/PricingCards";
import { signIn, useSession } from "next-auth/react";
import { useState } from "react";
import { ThreeDMarquee } from "@/components/ui/3d-marquee";
import { landingVideos } from "@/lib/objects";

export default function Home() {
  const { data: session } = useSession();
  const [activeVideoIndex, setActiveVideoIndex] = useState(0);

  return (
    <div className="flex flex-col min-h-[calc(100vh-4rem)]">
      {/* Hero Section */}
      <section className="relative mx-auto my-10 flex h-screen w-full max-w-7xl flex-col items-center justify-center overflow-hidden rounded-3xl">
        <h2 className="relative z-20 mx-auto max-w-4xl text-center text-2xl font-bold text-balance text-white md:text-4xl lg:text-6xl">
          This is your life and it&apos;s ending one{" "}
          <span className="relative z-20 inline-block rounded-xl bg-blue-500/40 px-4 py-1 text-white underline decoration-sky-500 decoration-[6px] underline-offset-[16px] backdrop-blur-sm">
            moment
          </span>{" "}
          at a time.
        </h2>
        <p className="relative z-20 mx-auto max-w-2xl py-8 text-center text-sm text-neutral-200 md:text-base">
          You are not your job, you&apos;re not how much money you have in the
          bank. You are not the car you drive. You&apos;re not the contents of
          your wallet.
        </p>

        <div className="relative z-20 flex flex-wrap items-center justify-center gap-4 pt-4">
          {session ? (
            <Link href="/dashboard">
              <Button size="lg" className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-lg shadow-blue-500/25 border-0">
                Go to Dashboard
              </Button>
            </Link>
          ) : (
            <Button
              size="lg"
              onClick={() => signIn()}
              className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-lg shadow-blue-500/25 border-0"
            >
              Start Creating
            </Button>
          )}
          <Link href="/pricing">
            <Button variant="outline" size="lg" className="border-2 shadow-sm">
              View Pricing
            </Button>
          </Link>
        </div>

        {/* overlay */}
        <div className="absolute inset-0 z-10 h-full w-full bg-black/80 dark:bg-black/40" />
        <ThreeDMarquee
          className="pointer-events-none absolute inset-0 h-full w-full"
          images={[
            "https://assets.aceternity.com/cloudinary_bkp/3d-card.png",
            "https://assets.aceternity.com/animated-modal.png",
            "https://assets.aceternity.com/animated-testimonials.webp",
            "https://assets.aceternity.com/cloudinary_bkp/Tooltip_luwy44.png",
            "https://assets.aceternity.com/github-globe.png",
            "https://assets.aceternity.com/glare-card.png",
            "https://assets.aceternity.com/layout-grid.png",
            "https://assets.aceternity.com/flip-text.png",
            "https://assets.aceternity.com/hero-highlight.png",
            "https://assets.aceternity.com/carousel.webp",
            "https://assets.aceternity.com/placeholders-and-vanish-input.png",
            "https://assets.aceternity.com/shooting-stars-and-stars-background.png",
            "https://assets.aceternity.com/signup-form.png",
            "https://assets.aceternity.com/cloudinary_bkp/stars_sxle3d.png",
            "https://assets.aceternity.com/spotlight-new.webp",
            "https://assets.aceternity.com/cloudinary_bkp/Spotlight_ar5jpr.png",
            "https://assets.aceternity.com/cloudinary_bkp/Parallax_Scroll_pzlatw_anfkh7.png",
            "https://assets.aceternity.com/tabs.png",
            "https://assets.aceternity.com/cloudinary_bkp/Tracing_Beam_npujte.png",
            "https://assets.aceternity.com/cloudinary_bkp/typewriter-effect.png",
            "https://assets.aceternity.com/glowing-effect.webp",
            "https://assets.aceternity.com/hover-border-gradient.png",
            "https://assets.aceternity.com/cloudinary_bkp/Infinite_Moving_Cards_evhzur.png",
            "https://assets.aceternity.com/cloudinary_bkp/Lamp_hlq3ln.png",
            "https://assets.aceternity.com/macbook-scroll.png",
            "https://assets.aceternity.com/cloudinary_bkp/Meteors_fye3ys.png",
            "https://assets.aceternity.com/cloudinary_bkp/Moving_Border_yn78lv.png",
            "https://assets.aceternity.com/multi-step-loader.png",
            "https://assets.aceternity.com/vortex.png",
            "https://assets.aceternity.com/wobble-card.png",
            "https://assets.aceternity.com/world-map.webp",
          ]}
        />
      </section>

      {/* How It Works Section */}
      <section className="py-24 bg-white dark:bg-slate-900">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400">
              How It Works
            </h2>
            <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
              Create professional videos in three simple steps
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="bg-blue-500/10 p-6 rounded-full inline-block mb-6">
                <div className="text-3xl font-bold text-blue-600 dark:text-blue-400">1</div>
              </div>
              <h3 className="text-xl font-semibold mb-3">Write Your Prompt</h3>
              <p className="text-slate-600 dark:text-slate-400">
                Describe your video idea in natural language. Our AI understands context and creates engaging content.
              </p>
            </div>

            <div className="text-center">
              <div className="bg-purple-500/10 p-6 rounded-full inline-block mb-6">
                <div className="text-3xl font-bold text-purple-600 dark:text-purple-400">2</div>
              </div>
              <h3 className="text-xl font-semibold mb-3">AI Generates Everything</h3>
              <p className="text-slate-600 dark:text-slate-400">
                Our AI creates the script, generates voiceover, creates visuals, and adds captions automatically.
              </p>
            </div>

            <div className="text-center">
              <div className="bg-green-500/10 p-6 rounded-full inline-block mb-6">
                <div className="text-3xl font-bold text-green-600 dark:text-green-400">3</div>
              </div>
              <h3 className="text-xl font-semibold mb-3">Download & Share</h3>
              <p className="text-slate-600 dark:text-slate-400">
                Get your video ready for social media. Perfect for YouTube Shorts, TikTok, Instagram Reels, and more.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Video Gallery Section */}
      <section className="py-24 bg-slate-50 dark:bg-slate-800">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400">
              See What You Can Create
            </h2>
            <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
              Real videos generated with simple prompts
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
            {landingVideos.map((video, index) => (
              <div
                key={index}
                className="group cursor-pointer"
                onClick={() => setActiveVideoIndex(index)}
              >
                <div className="relative aspect-[9/16] rounded-lg overflow-hidden border-2 border-white dark:border-slate-700 shadow-lg group-hover:shadow-xl transition-all duration-300">
                  <video
                    src={video.videoUrl}
                    className="w-full h-full object-cover"
                    muted
                    loop
                    playsInline
                  />
                  <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <Play className="h-8 w-8 text-white" />
                  </div>
                </div>
                <p className="text-xs text-slate-600 dark:text-slate-400 mt-2 line-clamp-2">
                  "{video.prompt}"
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 bg-white dark:bg-slate-900">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400">
              Powerful Features
            </h2>
            <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
              Everything you need to create viral videos
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-slate-50 dark:bg-slate-800 p-8 rounded-xl shadow-sm hover:shadow-md transition-shadow border border-slate-200 dark:border-slate-700">
              <div className="bg-blue-500/10 p-3 rounded-xl inline-block mb-5">
                <Bot className="h-8 w-8 text-blue-600 dark:text-blue-400" />
              </div>
              <h3 className="text-xl font-semibold mb-3">AI Script Generation</h3>
              <p className="text-slate-600 dark:text-slate-400">
                Our AI writes engaging scripts based on your prompt, ensuring your content is compelling and shareable.
              </p>
            </div>

            <div className="bg-slate-50 dark:bg-slate-800 p-8 rounded-xl shadow-sm hover:shadow-md transition-shadow border border-slate-200 dark:border-slate-700">
              <div className="bg-purple-500/10 p-3 rounded-xl inline-block mb-5">
                <Mic className="h-8 w-8 text-purple-600 dark:text-purple-400" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Natural Voiceovers</h3>
              <p className="text-slate-600 dark:text-slate-400">
                Choose from multiple AI voices that sound natural and engaging, perfect for your target audience.
              </p>
            </div>

            <div className="bg-slate-50 dark:bg-slate-800 p-8 rounded-xl shadow-sm hover:shadow-md transition-shadow border border-slate-200 dark:border-slate-700">
              <div className="bg-amber-500/10 p-3 rounded-xl inline-block mb-5">
                <Video className="h-8 w-8 text-amber-600 dark:text-amber-400" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Visual Generation</h3>
              <p className="text-slate-600 dark:text-slate-400">
                AI creates stunning visuals that match your content, with smooth transitions and professional quality.
              </p>
            </div>

            <div className="bg-slate-50 dark:bg-slate-800 p-8 rounded-xl shadow-sm hover:shadow-md transition-shadow border border-slate-200 dark:border-slate-700">
              <div className="bg-green-500/10 p-3 rounded-xl inline-block mb-5">
                <Timer className="h-8 w-8 text-green-600 dark:text-green-400" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Lightning Fast</h3>
              <p className="text-slate-600 dark:text-slate-400">
                Generate complete videos in under a minute. No waiting, no complex editing - just instant results.
              </p>
            </div>

            <div className="bg-slate-50 dark:bg-slate-800 p-8 rounded-xl shadow-sm hover:shadow-md transition-shadow border border-slate-200 dark:border-slate-700">
              <div className="bg-rose-500/10 p-3 rounded-xl inline-block mb-5">
                <TrendingUp className="h-8 w-8 text-rose-600 dark:text-rose-400" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Optimized for Growth</h3>
              <p className="text-slate-600 dark:text-slate-400">
                Videos are optimized for social media algorithms, helping you reach more viewers and grow faster.
              </p>
            </div>

            <div className="bg-slate-50 dark:bg-slate-800 p-8 rounded-xl shadow-sm hover:shadow-md transition-shadow border border-slate-200 dark:border-slate-700">
              <div className="bg-indigo-500/10 p-3 rounded-xl inline-block mb-5">
                <Users className="h-8 w-8 text-indigo-600 dark:text-indigo-400" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Multiple Formats</h3>
              <p className="text-slate-600 dark:text-slate-400">
                Create videos for YouTube Shorts, TikTok, Instagram Reels, and more with the perfect aspect ratios.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-gradient-to-br from-blue-600 to-purple-600">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            Ready to Create Viral Videos?
          </h2>
          <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
            Join thousands of creators who are already using AI to generate engaging content and grow their audience.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            {session ? (
              <Link href="/dashboard">
                <Button size="lg" className="bg-white text-blue-600 hover:bg-blue-500 shadow-lg">
                  Go to Dashboard
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            ) : (
              <Button
                size="lg"
                onClick={() => signIn()}
                className="bg-white text-blue-600 hover:bg-blue-50 shadow-lg"
              >
                Start Creating Now
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            )}
            <Link href="/pricing">
              <Button variant="outline" size="lg" className="border-2 shadow-sm">
                View Pricing
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Pricing Preview Section */}
      <section className="py-24 bg-gradient-to-b from-slate-50 to-white dark:from-slate-900 dark:to-slate-800 relative overflow-hidden">
        <div className="absolute top-40 left-[10%] w-72 h-72 bg-blue-500/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-[10%] w-80 h-80 bg-purple-500/5 rounded-full blur-3xl"></div>

        <div className="container mx-auto px-4 relative z-10">
          <PricingCards />
        </div>
      </section>
    </div>
  );
}
