'use client';

import React from 'react';
import { Player } from '@remotion/player';
import { VideoComposition } from '@/remotion/VideoComposition';
import { sampleVideos } from '@/lib/objects';
import { Video } from 'lucide-react';

interface VideoGridProps {
  className?: string;
}

export const VideoGrid: React.FC<VideoGridProps> = ({ className = '' }) => {

  return (
    <div className={`w-full ${className}`}>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
        {sampleVideos.map((video) => (
          <div
            key={video.id}
            className="group relative bg-white dark:bg-slate-800 rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 border border-slate-200 dark:border-slate-700"
          >
            {/* Video Player */}
            <div className="relative aspect-[9/16] bg-black">
              <Player
                component={VideoComposition}
                inputProps={{
                  frames: [
                    {
                      imagePrompt: video.title,
                      contentText: video.description
                    }
                  ],
                  audioUrl: video.videoUrl,
                  caption: [
                    {
                      text: video.title,
                      start: 0,
                      end: 3000,
                      confidence: 1,
                      speaker: null
                    }
                  ],
                  imagesUrl: [video.thumbnail],
                  zoomEffect: 'in' as const
                }}
                durationInFrames={90}
                compositionWidth={1080}
                compositionHeight={1920}
                fps={30}
                style={{
                  width: '100%',
                  height: '100%',
                }}
                controls={false}
                autoPlay={true}
                loop
                errorFallback={() => (
                  <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-slate-800 to-slate-900">
                    <div className="text-center text-white">
                      <Video className="h-12 w-12 mx-auto mb-4 text-slate-400" />
                      <p className="text-sm text-slate-300">Video Preview</p>
                    </div>
                  </div>
                )}
              />
            </div>

            {/* Video Info */}
            <div className="p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-medium text-blue-600 dark:text-blue-400 bg-blue-100 dark:bg-blue-900/30 px-2 py-1 rounded-full">
                  {video.category}
                </span>
              </div>
              <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2 overflow-hidden text-ellipsis whitespace-nowrap">
                {video.title}
              </h3>
              <p className="text-sm text-slate-600 dark:text-slate-400 overflow-hidden text-ellipsis whitespace-nowrap">
                {video.description}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};