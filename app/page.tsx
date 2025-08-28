'use client';

import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Users, TrendingUp, Bot, Video, Timer, Rocket, Mic, Sparkles, Play, ArrowRight } from "lucide-react";
import { useRouter } from "next/navigation";
import { useSession } from "@/lib/auth-client";
import { PricingCards } from "@/components/PricingCards";
import { useEffect, useState } from "react";
import { landingGifs } from "@/lib/objects";
import { ThreeDMarqueeHeroSection } from "@/components/ui-component/3DMarqueeHeroSection";
import { Marquee } from "@/components/ui/marquee";
import Image from "next/image";

export default function Home() {
  const { data: session } = useSession();
  const router = useRouter();
  const [activeGifIndex, setActiveGifIndex] = useState(0);
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

  const featureHighlights = [
    {
      icon: <Bot className="h-8 w-8 text-blue-600 dark:text-blue-400" />,
      text: "AI Script Generation",
      description: "Our AI writes engaging scripts based on your prompt, ensuring your content is compelling and shareable.",
      color: "blue"
    },
    {
      icon: <Mic className="h-8 w-8 text-purple-600 dark:text-purple-400" />,
      text: "Natural Voiceovers",
      description: "Choose from multiple AI voices that sound natural and engaging, perfect for your target audience.",
      color: "purple"
    },
    {
      icon: <Video className="h-8 w-8 text-amber-600 dark:text-amber-400" />,
      text: "Visual Generation",
      description: "AI creates stunning visuals that match your content, with smooth transitions and professional quality.",
      color: "amber"
    },
    {
      icon: <Timer className="h-8 w-8 text-green-600 dark:text-green-400" />,
      text: "Lightning Fast",
      description: "Generate complete videos in under a minute. No waiting, no complex editing - just instant results.",
      color: "green"
    },
    {
      icon: <TrendingUp className="h-8 w-8 text-rose-600 dark:text-rose-400" />,
      text: "Optimized for Growth",
      description: "Videos are optimized for social media algorithms, helping you reach more viewers and grow faster.",
      color: "rose"
    },
    {
      icon: <Users className="h-8 w-8 text-indigo-600 dark:text-indigo-400" />,
      text: "Multiple Formats",
      description: "Create videos for YouTube Shorts, TikTok, Instagram Reels, and more with the perfect aspect ratios.",
      color: "indigo"
    }
  ];

  // Auto-rotate through stats
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveStatIndex((prev) => (prev + 1) % marketingStats.length);
    }, 3000);

    return () => clearInterval(interval);
  }, [marketingStats.length]);

  // Split gifs into two rows
  const midpoint = Math.ceil(landingGifs.length / 2);
  const firstRowGifs = landingGifs.slice(0, midpoint);
  const secondRowGifs = landingGifs.slice(midpoint);

  const GifCard = ({ gif, index, originalIndex }) => (

    <div
      className="group cursor-pointer mx-3"
      onClick={() => setActiveGifIndex(originalIndex)}
    >
      <div className="relative w-48 lg:w-96 aspect-[9/16] rounded-lg overflow-hidden border-2 border-white dark:border-slate-700 shadow-lg group-hover:shadow-xl transition-all duration-300">
        <Image
          src={gif.gifUrl || null}
          alt={gif.prompt || "Generated GIF"}
          fill
          className="object-cover"
          unoptimized={true}
        />
      </div>
      <p className="text-xs text-slate-600 dark:text-slate-400 mt-2 line-clamp-2 w-48">
        {gif.prompt}
      </p>
    </div>
  );

  return (
    <div className="flex flex-col lg:min-h-[calc(100vh-4rem)] bg-slate-50 dark:bg-slate-800">
      {/* Hero Section */}
      <ThreeDMarqueeHeroSection />

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
              <div className="text-3xl font-bold text-blue-600 dark:text-blue-400">1</div>
              <h3 className="text-xl font-semibold mb-3">Write Your Prompt</h3>
              <p className="text-slate-600 dark:text-slate-400">
                Describe your video idea in natural language. Our AI understands context and creates engaging content.
              </p>
            </div>

            <div className="text-center">
              <div className="text-3xl font-bold text-purple-600 dark:text-purple-400">2</div>
              <h3 className="text-xl font-semibold mb-3">AI Generates Everything</h3>
              <p className="text-slate-600 dark:text-slate-400">
                Our AI creates the script, generates voiceover, creates visuals, and adds captions automatically.
              </p>
            </div>

            <div className="text-center">
              <div className="text-3xl font-bold text-green-600 dark:text-green-400">3</div>
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

          <div className="space-y-6">
            {/* First Row - Left to Right */}
            <Marquee className="[--duration:30s]" pauseOnHover>
              {firstRowGifs.map((gif, index) => (
                <GifCard
                  key={`row1-${index}`}
                  gif={gif}
                  index={index}
                  originalIndex={index}
                />
              ))}
            </Marquee>

            {/* Second Row - Right to Left */}
            <Marquee className="[--duration:30s]" pauseOnHover reverse>
              {secondRowGifs.map((gif, index) => (
                <GifCard
                  key={`row2-${index}`}
                  gif={gif}
                  index={index}
                  originalIndex={midpoint + index}
                />
              ))}
            </Marquee>
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
                onClick={() => router.push('/login')}
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
