'use client';

import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';
import { useSession } from 'next-auth/react';
import { Player } from '@remotion/player';
import { VideoComposition } from '@/remotion/VideoComposition';
import { frames as framesObject, audioUrl, caption, imagesUrl } from '@/lib/objects';
import { VideoGrid } from '@/components/VideoGrid';
import { PricingCards } from '@/components/PricingCards';
import { Sparkles, PenLine, Brain, Mic, Image as ImageIcon, Film, Rocket } from 'lucide-react';

export default function Home() {
  const { data: session } = useSession();

  // Typewriter prompt demo
  const prompts = useMemo(
    () => [
      'Explain black holes in 30 seconds',
      'Top 5 productivity hacks for students',
      'Why is the sky blue? Make it fun',
      'A 60s summary of Cleopatra & Antony',
      'How AI will change healthcare in 2025',
    ],
    []
  );
  const [promptIndex, setPromptIndex] = useState(0);
  const [displayText, setDisplayText] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const current = prompts[promptIndex];
    const typingSpeed = isDeleting ? 20 : 35;

    const tick = () => {
      if (!isDeleting) {
        const next = current.slice(0, displayText.length + 1);
        setDisplayText(next);
        if (next === current) {
          setTimeout(() => setIsDeleting(true), 800);
        }
      } else {
        const next = current.slice(0, displayText.length - 1);
        setDisplayText(next);
        if (next.length === 0) {
          setIsDeleting(false);
          setPromptIndex((prev) => (prev + 1) % prompts.length);
        }
      }
    };

    const timer = setTimeout(tick, typingSpeed);
    return () => clearTimeout(timer);
  }, [displayText, isDeleting, promptIndex, prompts]);

  // Compute duration from captions for preview
  const heroDurationInFrames = useMemo(() => {
    if (caption && caption.length > 0) {
      const lastEnd = Math.max(...caption.map((w: any) => w.end || 0));
      return Math.ceil((lastEnd / 1000) * 30);
    }
    return (framesObject.scenes?.length || 5) * 90;
  }, []);

  return (
    <div className="flex flex-col min-h-[calc(100vh-4rem)]">
      {/* HERO */}
      <section className="relative overflow-hidden bg-gradient-to-br from-slate-50 to-white dark:from-slate-900 dark:to-slate-800">
        {/* Decorative glows */}
        <div className="pointer-events-none absolute -top-24 -right-24 h-96 w-96 rounded-full bg-blue-500/10 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-24 -left-24 h-[28rem] w-[28rem] rounded-full bg-purple-500/10 blur-3xl" />
        <div className="container mx-auto px-4 py-20 md:py-28 relative z-10">
          <div className="grid lg:grid-cols-2 gap-10 items-center">
            {/* Headline + Prompt Demo */}
            <div className="space-y-8">
              <div className="inline-flex items-center px-3 py-1.5 rounded-full bg-blue-100 dark:bg-blue-900/60 text-blue-700 dark:text-blue-300 text-sm font-medium">
                <Sparkles className="h-4 w-4 mr-2" />
                One prompt. One video. In seconds.
              </div>
              <h1 className="text-4xl md:text-6xl font-bold leading-tight bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-300">
                Turn your idea into a viral short video
              </h1>
              <p className="text-lg md:text-xl text-slate-600 dark:text-slate-300 max-w-2xl">
                Describe your idea. ShortsAI instantly writes the script, narrates with a human-like voice, generates visuals, and edits it all into a ready-to-post short.
              </p>

              {/* Typewriter prompt bar */}
              <div className="relative max-w-2xl">
                <div className="flex items-center rounded-xl border border-slate-200 dark:border-slate-700 bg-white/70 dark:bg-slate-800/70 backdrop-blur px-4 py-4 shadow-sm">
                  <PenLine className="h-5 w-5 text-blue-600 dark:text-blue-400 mr-3" />
                  <div className="flex-1 text-base md:text-lg font-medium text-slate-800 dark:text-slate-100">
                    {displayText}
                    <span className="animate-pulse">|</span>
                  </div>
                </div>
                <div className="absolute -bottom-6 left-2 text-xs text-slate-500 dark:text-slate-400">
                  Try: “Make a 60s breakdown of quantum entanglement”
                </div>
              </div>

              {/* CTAs */}
              <div className="flex flex-wrap gap-3 pt-6">
                {session ? (
                  <Link href="/create">
                    <Button size="lg" className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-lg shadow-blue-500/25 border-0">
                      Create Your First Video
                    </Button>
                  </Link>
                ) : (
                  <Link href="#get-started">
                    <Button size="lg" className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-lg shadow-blue-500/25 border-0">
                      Get Started Free
                    </Button>
                  </Link>
                )}
                <Link href="#how-it-works">
                  <Button variant="outline" size="lg" className="border-2 shadow-sm">
                    See How It Works
                  </Button>
                </Link>
              </div>
            </div>

            {/* Right: Remotion live preview */}
            <div className="relative">
              <div className="absolute -inset-1 rounded-2xl bg-gradient-to-tr from-blue-500/20 via-purple-500/20 to-amber-500/20 blur-xl" />
              <div className="relative rounded-xl overflow-hidden border border-slate-200 dark:border-slate-700 bg-slate-900/90">
                <div className="aspect-[9/16] w-full">
                  <Player
                    component={VideoComposition}
                    inputProps={{
                      frames: framesObject.scenes || [],
                      audioUrl,
                      caption,
                      imagesUrl,
                      zoomEffect: 'in' as const,
                    }}
                    durationInFrames={heroDurationInFrames}
                    compositionWidth={1080}
                    compositionHeight={1920}
                    fps={30}
                    style={{ width: '100%', height: '100%' }}
                    controls={false}
                    autoPlay
                    loop
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section id="how-it-works" className="py-24 bg-white dark:bg-slate-900">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400 inline-block">
              From prompt to polished video in 3 steps
            </h2>
            <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
              No editing. No studios. Just your idea, turned into a short worth sharing.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            <div className="group bg-slate-50 dark:bg-slate-800 p-8 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm hover:shadow-md transition-all">
              <div className="bg-blue-500/10 p-3 rounded-xl inline-block mb-5">
                <PenLine className="h-8 w-8 text-blue-600 dark:text-blue-400" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Write your prompt</h3>
              <p className="text-slate-600 dark:text-slate-400">Describe what you want. Topic, tone, length—anything in plain English.</p>
            </div>
            <div className="group bg-slate-50 dark:bg-slate-800 p-8 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm hover:shadow-md transition-all">
              <div className="bg-purple-500/10 p-3 rounded-xl inline-block mb-5">
                <Brain className="h-8 w-8 text-purple-600 dark:text-purple-400" />
              </div>
              <h3 className="text-xl font-semibold mb-2">AI creates everything</h3>
              <p className="text-slate-600 dark:text-slate-400 flex items-center gap-2">
                <span className="inline-flex items-center gap-2"><Mic className="h-5 w-5" /> Voice</span>
                <span className="inline-flex items-center gap-2 ml-3"><ImageIcon className="h-5 w-5" /> Visuals</span>
                <span className="inline-flex items-center gap-2 ml-3"><Film className="h-5 w-5" /> Editing</span>
              </p>
            </div>
            <div className="group bg-slate-50 dark:bg-slate-800 p-8 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm hover:shadow-md transition-all">
              <div className="bg-amber-500/10 p-3 rounded-xl inline-block mb-5">
                <Rocket className="h-8 w-8 text-amber-600 dark:text-amber-400" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Get a ready-to-post short</h3>
              <p className="text-slate-600 dark:text-slate-400">Perfect for YouTube Shorts, Instagram Reels and TikTok—generated in seconds.</p>
            </div>
          </div>
        </div>
      </section>

      {/* SAMPLE VIDEOS */}
      <section className="py-24 bg-gradient-to-b from-slate-50 to-white dark:from-slate-900 dark:to-slate-800">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400 inline-block">
              Create unique faceless videos for every niche
            </h2>
            <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
              From image generation to full edits, ShortsAI can generate any style of video in seconds.
            </p>
          </div>
          <VideoGrid />
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section className="py-24 bg-white dark:bg-slate-900">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Loved by creators and teams</h2>
            <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">Hear how people use ShortsAI to save hours and grow faster.</p>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="bg-slate-50 dark:bg-slate-800 p-6 rounded-xl border border-slate-200 dark:border-slate-700">
              <p className="text-slate-700 dark:text-slate-200 mb-4">“Insane speed. I type the idea, and minutes later I have a Short I	27m proud to post.”</p>
              <div className="text-sm text-slate-500 dark:text-slate-400">— Alex R., YouTuber</div>
            </div>
            <div className="bg-slate-50 dark:bg-slate-800 p-6 rounded-xl border border-slate-200 dark:border-slate-700">
              <p className="text-slate-700 dark:text-slate-200 mb-4">“The AI voice is shockingly good. Viewers thought it was a real voiceover artist.”</p>
              <div className="text-sm text-slate-500 dark:text-slate-400">— Priya S., Marketer</div>
            </div>
            <div className="bg-slate-50 dark:bg-slate-800 p-6 rounded-xl border border-slate-200 dark:border-slate-700">
              <p className="text-slate-700 dark:text-slate-200 mb-4">“I made 10 Shorts this week without opening an editor. Game changer.”</p>
              <div className="text-sm text-slate-500 dark:text-slate-400">— Marco D., Indie Developer</div>
            </div>
          </div>
        </div>
      </section>

      {/* PRICING PREVIEW */}
      <section className="py-24 bg-gradient-to-b from-slate-50 to-white dark:from-slate-900 dark:to-slate-800 relative overflow-hidden">
        <div className="absolute top-40 left-[10%] w-72 h-72 bg-blue-500/5 rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-[10%] w-80 h-80 bg-purple-500/5 rounded-full blur-3xl" />
        <div className="container mx-auto px-4 relative z-10">
          <PricingCards />
        </div>
      </section>

      {/* FINAL CTA */}
      <section id="get-started" className="py-24 bg-white dark:bg-slate-900">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Your next viral short starts with a prompt</h2>
          <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto mb-8">
            Join creators using ShortsAI to turn ideas into videos in seconds. No editing skills required.
          </p>
          {session ? (
            <Link href="/create">
              <Button size="lg" className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-lg shadow-blue-500/25 border-0">
                Create a Video
              </Button>
            </Link>
          ) : (
            <Link href="/login">
              <Button size="lg" className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-lg shadow-blue-500/25 border-0">
                Get Started Free
              </Button>
            </Link>
          )}
        </div>
      </section>
    </div>
  );
}
