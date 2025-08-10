"use client";

import React, { useState, useEffect } from 'react';
import { Player } from '@remotion/player';
import { VideoComposition } from '@/remotion/VideoComposition';
import { frames, audioUrl, caption } from '@/lib/objects';

// Calculate total duration from audio captions
const totalDurationInFrames = Math.ceil((caption[caption.length - 1]?.end || 27000) / 1000 * 30); // 30fps

interface VideoPlayerProps {
  width?: number;
  height?: number;
}

export const VideoPlayer: React.FC<VideoPlayerProps> = ({
  width = 380,
  height = 675,
}) => {
  const [dimensions, setDimensions] = useState({ width, height });

  useEffect(() => {
    const updateDimensions = () => {
      const maxWidth = Math.min(width, window.innerWidth * 0.8);
      const maxHeight = Math.min(height, window.innerHeight * 0.6);
      setDimensions({ width: maxWidth, height: maxHeight });
    };

    updateDimensions();
    window.addEventListener('resize', updateDimensions);
    return () => window.removeEventListener('resize', updateDimensions);
  }, [width, height]);

  return (
    <div className="flex flex-col items-center justify-center w-full">
      <div className="relative flex justify-center items-center">
        <Player
          component={VideoComposition}
          inputProps={{
            frames,
            audioUrl,
            caption,
          }}
          durationInFrames={totalDurationInFrames}
          fps={30}
          compositionWidth={1080}
          compositionHeight={1920}
          style={{
            width: dimensions.width,
            height: dimensions.height,
            borderRadius: '8px',
            overflow: 'hidden',
            display: 'block',
          }}
          controls
          autoPlay={false}
          loop={false}
          showVolumeControls={true}
          clickToPlay={true}
        />
      </div>
    </div>
  );
}; 
