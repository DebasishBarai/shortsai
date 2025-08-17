import { Composition } from 'remotion';
import { VideoComposition } from './VideoComposition';
import { frames, audioUrl, caption } from '../lib/objects';

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
  return frames.scenes && frames.scenes.length > 0 ? frames.scenes.length * 90 : 270; // 90 frames per scene (3 seconds at 30fps)
};

const totalDurationInFrames = calculateDurationFromCaptions();

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Composition
        id="shortsai"
        component={VideoComposition as any}
        durationInFrames={totalDurationInFrames}
        fps={30}
        width={1080}
        height={1920}
        defaultProps={{
          frames: frames.scenes || [], // Pass the scenes array, not the entire frames object
          audioUrl,
          caption,
        }}
      />
    </>
  );
};

