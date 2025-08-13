'use client';

import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Check, Megaphone, Users, TrendingUp, Bot, Video, Timer, Rocket, Mic, Sparkles } from "lucide-react";
import { PricingCards } from "@/components/PricingCards";
import { VideoGrid } from "@/components/VideoGrid";
import { signIn, useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import Image from "next/image";

export default function Home() {
  const { data: session } = useSession();
  const [activeStatIndex, setActiveStatIndex] = useState(0);

  const marketingStats = [
    {
      icon: <Bot className="h-8 w-8 text-cyan-500" />,
      title: "100% AI-Powered",
      description: "Script, voice, and visuals generated automatically from prompts",
    },
    {
      icon: <Video className="h-8 w-8 text-purple-500" />,
      title: "60s Videos in 60s",
      description: "Create ready-to-publish shorts in under a minute",
    },
    {
      icon: <Timer className="h-8 w-8 text-rose-500" />,
      title: "10× Faster Workflow",
      description: "Compared to traditional editing or scripting",
    },
    {
      icon: <Rocket className="h-8 w-8 text-orange-500" />,
      title: "High Engagement Format",
      description: "Optimized for YouTube Shorts, Instagram Reels & TikTok",
    },
    {
      icon: <Mic className="h-8 w-8 text-emerald-500" />,
      title: "Human-Like Voiceovers",
      description: "Narration powered by realistic AI voice models",
    },
    {
      icon: <Sparkles className="h-8 w-8 text-yellow-500" />,
      title: "One Prompt. One Video.",
      description: "Just describe your idea — we handle the rest",
    },
  ];


  // Auto-rotate through stats
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveStatIndex((prev) => (prev + 1) % marketingStats.length);
    }, 3000);

    return () => clearInterval(interval);
  }, [marketingStats.length]);

  return (
    <div className="flex flex-col min-h-[calc(100vh-4rem)]">
      {/* Hero Section with Gradient Background */}
      <section className="relative overflow-hidden bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
        {/* Decorative elements */}
        <div className="absolute top-20 right-[10%] w-72 h-72 bg-blue-500/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 left-[5%] w-64 h-64 bg-purple-500/10 rounded-full blur-3xl"></div>
        <div className="absolute top-40 left-[15%] w-40 h-40 bg-amber-500/10 rounded-full blur-2xl"></div>

        <div className="container mx-auto px-4 py-24 md:py-32 relative z-10">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            {/* Left side - Text and CTA */}
            <div className="space-y-8">
              <div className="inline-flex items-center px-3 py-1.5 rounded-full bg-blue-100 dark:bg-blue-900/60 text-blue-700 dark:text-blue-300 text-sm font-medium mb-4">
                <Sparkles className="h-4 w-4 mr-2" />
                Powered by GPT-4
              </div>

              <h1 className="md:py-4 text-4xl md:text-5xl lg:text-6xl font-bold leading-tight bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400">
                Generate High Quality Videos With AI
              </h1>

              <p className="text-xl text-slate-600 dark:text-slate-300">
                Generate high quality videos with AI, schedule upload to your social media, saving time and effort.
              </p>

              <div className="flex flex-wrap gap-4">
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
                    Generate Videos
                  </Button>
                )}
                <Link href="/pricing">
                  <Button variant="outline" size="lg" className="border-2 shadow-sm">
                    View Pricing
                  </Button>
                </Link>
              </div>

              {/* Animated Stats - Modern Design */}
              <div className="mt-12 relative">
                <div className="relative h-32 overflow-hidden">
                  {marketingStats.map((stat, index) => (
                    <div
                      key={index}
                      className={`absolute w-full transition-all duration-700 ease-out ${index === activeStatIndex
                        ? "opacity-100 translate-y-0"
                        : index < activeStatIndex
                          ? "opacity-0 -translate-y-full"
                          : "opacity-0 translate-y-full"
                        }`}
                    >
                      <div className="flex items-start">
                        <div className="bg-white dark:bg-slate-800 p-3 rounded-xl mr-5 shadow-md backdrop-blur-sm border border-slate-200 dark:border-slate-700">
                          {stat.icon}
                        </div>
                        <div>
                          <div className="text-3xl font-bold mb-1">{stat.title}</div>
                          <div className="text-lg text-slate-600 dark:text-slate-400">{stat.description}</div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Modern indicator pills */}
                <div className="flex space-x-1.5 mt-6">
                  {marketingStats.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => setActiveStatIndex(index)}
                      className={`transition-all duration-300 ${index === activeStatIndex
                        ? "w-10 h-2 bg-blue-500 rounded-full"
                        : "w-2 h-2 bg-slate-300 dark:bg-slate-700 rounded-full hover:bg-blue-300 dark:hover:bg-blue-700"
                        }`}
                      aria-label={`View stat ${index + 1}`}
                    />
                  ))}
                </div>
              </div>
            </div>

            {/* Right side - Image */}
            <div className="relative h-[520px] hidden md:block">
              <div className="absolute -inset-0.5 bg-gradient-to-tr from-blue-500/10 via-purple-500/10 to-amber-500/10 rounded-2xl blur"></div>
              <div className="relative h-full w-full bg-white dark:bg-slate-800 rounded-xl overflow-hidden border border-slate-200 dark:border-slate-700 shadow-xl">
                <Image
                  src="/remind-me.jpg"
                  alt="Woman using WhatsApp on tablet"
                  fill
                  className="object-cover object-center"
                  priority
                />

                {/* WhatsApp message bubbles */}
                <div className="absolute right-10 top-24 bg-green-100 dark:bg-green-900/90 p-4 rounded-lg rounded-tr-none shadow-lg transform rotate-3 z-10 max-w-[180px] backdrop-blur-sm border border-green-200 dark:border-green-800">
                  <p className="text-sm font-medium text-green-800 dark:text-green-200">Check out our new promotion! 🎉</p>
                </div>
                <div className="absolute left-10 bottom-36 bg-white dark:bg-slate-700 p-4 rounded-lg rounded-tl-none shadow-lg transform -rotate-2 z-10 max-w-[180px] backdrop-blur-sm border border-slate-200 dark:border-slate-600">
                  <p className="text-sm font-medium dark:text-white">I&apos;m interested! Tell me more about the offer. 👍</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Sample Videos Section */}
      <section className="py-24 bg-white dark:bg-slate-900">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400 inline-block">
              Create unique faceless videos for every niche
            </h2>
            <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
              From Image generation to video generation, ShortsAI can generate any style of video in seconds.
            </p>
          </div>

          <VideoGrid />
        </div>
      </section>

      {/* Pricing Preview Section with Enhanced Background */}
      <section className="py-24 bg-gradient-to-b from-slate-50 to-white dark:from-slate-900 dark:to-slate-800 relative overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute top-40 left-[10%] w-72 h-72 bg-blue-500/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-[10%] w-80 h-80 bg-purple-500/5 rounded-full blur-3xl"></div>

        <div className="container mx-auto px-4 relative z-10">
          <PricingCards />
        </div>
      </section>
    </div>
  );
}
