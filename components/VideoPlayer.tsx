"use client";

import React, { useState, useEffect } from 'react';
import { Player } from '@remotion/player';
import { VideoComposition } from '@/remotion/VideoComposition';

interface VideoPlayerProps {
  width?: number;
  height?: number;
  frames?: any[];
  audioUrl?: string;
  imagesUrl?: any[];
  caption?: any[];
}

export const VideoPlayer: React.FC<VideoPlayerProps> = ({
  width = 380,
  height = 675,
  frames = [],
  audioUrl = "",
  imagesUrl = [],
  caption = [],
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

  // Calculate total duration from audio captions
  // Find the last word's end time and convert to frames
  const calculateDurationFromCaptions = () => {
    if (caption && caption.length > 0) {
      // Find the last word with the highest end time
      const lastWord = caption.reduce((latest, current) => 
        current.end > latest.end ? current : latest
      );
      
      // Convert milliseconds to frames (30fps)
      const durationInSeconds = lastWord.end / 1000;
      const durationInFrames = Math.ceil(durationInSeconds * 30);
      
      return durationInFrames;
    }
    
    // Fallback to frame-based calculation if no captions
    return frames.length > 0 ? frames.length * 90 : 270; // 90 frames per scene (3 seconds at 30fps)
  };

  const totalDurationInFrames = calculateDurationFromCaptions();

  return (
    <div className="flex flex-col items-center justify-center w-full">
      <div className="relative flex justify-center items-center">
        <Player
          component={VideoComposition}
          inputProps={{
            frames: frames,
            audioUrl,
            caption,
            imagesUrl,
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
