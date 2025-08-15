'use client';

import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Check, Megaphone, Users, TrendingUp, Bot, Video, Timer, Rocket, Mic, Sparkles, Play, ArrowRight } from "lucide-react";
import { PricingCards } from "@/components/PricingCards";
import { signIn, useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import Image from "next/image";
import { landingVideos } from "@/lib/objects";

export default function Home() {
  const { data: session } = useSession();
  const [activeVideoIndex, setActiveVideoIndex] = useState(0);
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

  // Auto-rotate through videos
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveVideoIndex((prev) => (prev + 1) % landingVideos.length);
    }, 4000);

    return () => clearInterval(interval);
  }, []);

  // Auto-rotate through stats
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveStatIndex((prev) => (prev + 1) % marketingStats.length);
    }, 3000);

    return () => clearInterval(interval);
  }, [marketingStats.length]);

  return (
    <div className="flex flex-col min-h-[calc(100vh-4rem)]">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
        {/* Decorative elements */}
        <div className="absolute top-20 right-[10%] w-72 h-72 bg-blue-500/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 left-[5%] w-64 h-64 bg-purple-500/10 rounded-full blur-3xl"></div>
        <div className="absolute top-40 left-[15%] w-40 h-40 bg-amber-500/10 rounded-full blur-2xl"></div>

        <div className="container mx-auto px-4 py-24 md:py-32 relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left side - Text and CTA */}
            <div className="space-y-8">
              <div className="inline-flex items-center px-3 py-1.5 rounded-full bg-blue-100 dark:bg-blue-900/60 text-blue-700 dark:text-blue-300 text-sm font-medium mb-4">
                <Sparkles className="h-4 w-4 mr-2" />
                AI-Powered Video Generation
              </div>

              <h1 className="md:py-4 text-4xl md:text-5xl lg:text-6xl font-bold leading-tight bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400">
                One Prompt. One Video.
              </h1>

              <p className="text-xl text-slate-600 dark:text-slate-300">
                Transform your ideas into engaging videos instantly. Just describe what you want, and our AI creates professional videos with voice, visuals, and captions.
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
                    Start Creating
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

            {/* Right side - Video Showcase */}
            <div className="relative">
              <div className="relative h-[600px] w-full max-w-[320px] mx-auto">
                {/* Video Display */}
                <div className="relative w-full h-full rounded-2xl overflow-hidden border-4 border-white dark:border-slate-700 shadow-2xl">
                  <video
                    key={landingVideos[activeVideoIndex].videoUrl}
                    src={landingVideos[activeVideoIndex].videoUrl}
                    className="w-full h-full object-cover"
                    autoPlay
                    muted
                    loop
                    playsInline
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent"></div>

                  {/* Prompt Display */}
                  <div className="absolute bottom-4 left-4 right-4">
                    <div className="bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm rounded-lg p-3">
                      <p className="text-sm font-medium text-slate-900 dark:text-slate-100">
                        "{landingVideos[activeVideoIndex].prompt}"
                      </p>
                    </div>
                  </div>
                </div>

                {/* Video Navigation Dots */}
                <div className="flex justify-center space-x-2 mt-4">
                  {landingVideos.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => setActiveVideoIndex(index)}
                      className={`w-2 h-2 rounded-full transition-all duration-300 ${index === activeVideoIndex
                        ? "bg-blue-500 w-6"
                        : "bg-slate-300 dark:bg-slate-600"
                        }`}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
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
