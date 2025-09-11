"use client";

import { Button } from "@/components/ui/button";
import { useUserStore } from "@/store/store";
import Link from "next/link";
import Image from "next/image";

export default function DashboardPage() {
  const user = useUserStore((state) => state.user);

  return (
    <div className="min-h-screen bg-gray-900 p-4">
      <div className="max-w-full mx-auto">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row gap-5 mb-8">
          <div className="flex-1 p-6 bg-gradient-to-r from-[#1E1E2D] via-[#1A1A24] to-[#101014] rounded-xl shadow-md border border-white/10">
            <h2 className="font-bold text-2xl text-white flex items-center gap-2">
              🎬 AI Movie Magic
            </h2>
            <p className="text-gray-300 mt-2 leading-relaxed">
              Lights, camera, AI! 🚀 Instantly transform your text or images into stunning cinematic videos. Create stories that move — literally.
            </p>
            <Link href="ai-tools/ai-film">
              <Button className="mt-4 text-white border-white/30 hover:bg-white hover:text-black transition-all bg-transparent border">
                ✨ Start Creating
              </Button>
            </Link>
          </div>

          <div className="flex-1 p-6 bg-gradient-to-r from-[#2D2F36] via-[#202227] to-[#1B1C20] rounded-xl shadow-md border border-white/10 flex flex-col md:flex-row items-center justify-between gap-4">
            <div>
              <h3 className="text-xl font-semibold text-white flex items-center gap-2">
                🔥 Unlock Pro Features
              </h3>
              <p className="text-sm text-gray-300 mt-2 leading-relaxed">
                Get <span className="font-semibold text-white">exclusive tools</span>, <span className="font-semibold text-white">faster rendering</span>, and <span className="font-semibold text-white">discounted credits</span>.
                <br />
                Upgrade now and save <span className="font-bold text-yellow-400">20%</span> 🎉
              </p>
            </div>
            <Link href="/pricing">
              <Button className="bg-yellow-400 text-black hover:bg-yellow-500 shadow-md hover:shadow-yellow-500/30 transition-all">
                🚀 Upgrade Now
              </Button>
            </Link>
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
          {/* Storyboard Feature */}
          <div className="relative rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300">
            <Image
              alt="Storyboard Your Ideas with AI"
              className="w-full h-72 object-cover"
              src="/dashboard/1.webp"
              width={600}
              height={288}
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/40 to-transparent p-4 flex flex-col justify-end">
              <h3 className="text-white font-bold text-lg">Storyboard Your Ideas with AI</h3>
              <p className="text-white text-sm opacity-70">
                Instantly turn your script or idea into a visual storyboard powered by AI. Perfect for pre-production planning.
              </p>
              <Link href="ai-tools/ai-film">
                <Button className="bg-black hover:bg-white hover:text-black text-white mt-2 transition-all">
                  Create Storyboard
                </Button>
              </Link>
            </div>
          </div>

          {/* Movie Maker Feature */}
          <div className="relative rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300">
            <Image
              alt="One-Click AI Movie Maker"
              className="w-full h-72 object-cover"
              src="/dashboard/2.webp"
              width={600}
              height={288}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/40 to-transparent p-4 flex flex-col justify-end">
              <h3 className="text-white font-bold text-lg">One-Click AI Movie Maker</h3>
              <p className="text-white text-sm opacity-70">
                Create cinematic-quality video scenes in seconds with intelligent automation and stunning visuals.
              </p>
              <Link href="ai-tools/ai-film">
                <Button className="bg-black hover:bg-white hover:text-black text-white mt-2 transition-all">
                  Start Creating
                </Button>
              </Link>
            </div>
          </div>
        </div>

        {/* Bottom Three Features */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* AI Reels Creator */}
          <div className="relative rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300">
            <Image
              alt="AI Reels & Shorts Creator"
              className="w-full h-72 object-cover"
              src="/dashboard/3.webp"
              width={400}
              height={288}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/40 to-transparent p-4 flex flex-col justify-end">
              <h3 className="text-white font-bold text-lg">AI Reels & Shorts Creator</h3>
              <p className="text-white text-sm opacity-70">
                Produce engaging short-form videos using AI-powered editing and transitions.
              </p>
              <Link href="/ai-tools/short-video">
                <Button className="bg-black hover:bg-white hover:text-black text-white mt-2 transition-all">
                  Create Now
                </Button>
              </Link>
            </div>
          </div>

          {/* AI Ad Creator */}
          <div className="relative rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300">
            <Image
              alt="Instant AI Ad Creator"
              className="w-full h-72 object-cover"
              src="/dashboard/4.webp"
              width={400}
              height={288}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/40 to-transparent p-4 flex flex-col justify-end">
              <h3 className="text-white font-bold text-lg">Instant AI Ad Creator</h3>
              <p className="text-white text-sm opacity-70">
                Generate high-converting, professional-grade video ads with cutting-edge AI.
              </p>
              <Link href="/ai-tools/product-ads">
                <Button className="bg-black hover:bg-white hover:text-black text-white mt-2 transition-all">
                  Create Now
                </Button>
              </Link>
            </div>
          </div>

          {/* AI Product Scene Generator */}
          <div className="relative rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300">
            <Image
              alt="AI Product Scene Generator"
              className="w-full h-72 object-cover"
              src="/dashboard/5.png"
              width={400}
              height={288}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/40 to-transparent p-4 flex flex-col justify-end">
              <h3 className="text-white font-bold text-lg">AI Product Scene Generator</h3>
              <p className="text-white text-sm opacity-70">
                Create cinematic product visuals with AI generation.
              </p>
              <Link href="/ai-tools/product-ads/product-to-video">
                <Button className="bg-black hover:bg-white hover:text-black text-white mt-2 transition-all">
                  Create Now
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
