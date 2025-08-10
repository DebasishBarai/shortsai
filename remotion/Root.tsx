import { Composition } from 'remotion';
import { VideoComposition } from './VideoComposition';
import { frames, audioUrl, caption } from '@/lib/objects';

// Calculate total duration from audio captions
const totalDurationInFrames = Math.ceil((caption[caption.length - 1]?.end || 27000) / 1000 * 30); // 30fps

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Composition
        id="VideoComposition"
        component={VideoComposition as any}
        durationInFrames={totalDurationInFrames}
        fps={30}
        width={1080}
        height={1920}
        defaultProps={{
          frames,
          audioUrl,
          caption,
        }}
      />
    </>
  );
};

