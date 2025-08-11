import React from 'react';
import {
  AbsoluteFill,
  Audio,
  Img,
  interpolate,
  Sequence,
  useCurrentFrame,
  useVideoConfig,
} from 'remotion';

interface CaptionItem {
  text: string;
  start: number;
  end: number;
  confidence: number;
  speaker: string | null;
}

interface Frame {
  imagePrompt: string;
  contentText: string;
}

interface VideoCompositionProps extends Record<string, unknown> {
  frames: Frame[];
  audioUrl: string;
  caption: CaptionItem[];
  imagesUrl: string[];
  zoomEffect?: 'none' | 'in' | 'out';
}

export const VideoComposition: React.FC<VideoCompositionProps> = ({
  frames,
  audioUrl,
  caption,
  zoomEffect = 'none',
  imagesUrl
}) => {
  const { durationInFrames, fps } = useVideoConfig();
  const frame = useCurrentFrame();

  // Calculate frames per image (equal distribution)
  const framesPerImage = Math.floor(durationInFrames / frames.length);

  // Determine current image index
  const currentImageIndex = Math.min(
    Math.floor(frame / framesPerImage),
    frames.length - 1
  );

  // Get current time in milliseconds
  const currentTimeMs = (frame / fps) * 1000;

  // Find current caption words
  const currentWords = caption.filter(
    (word) => word.start <= currentTimeMs && word.end > currentTimeMs
  );

  // Get current word to display
  const getCurrentWord = () => {
    const currentWord = currentWords[0];
    return currentWord ? currentWord.text : '';
  };

  // Animation for image transitions and zoom effect
  const imageOpacity = interpolate(
    frame % framesPerImage,
    [0, 10, framesPerImage - 10, framesPerImage],
    [0, 1, 1, 0],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
  );

  // Zoom effect based on parameter
  const getImageScale = () => {
    if (zoomEffect === 'none') {
      return 1.0; // No zoom
    }

    const startScale = zoomEffect === 'in' ? 1.0 : 1.1;
    const endScale = zoomEffect === 'in' ? 1.1 : 1.0;

    return interpolate(
      frame % framesPerImage,
      [0, framesPerImage],
      [startScale, endScale],
      { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
    );
  };

  const imageScale = getImageScale();

  return (
    <AbsoluteFill style={{ backgroundColor: '#000' }}>
      {/* Audio */}
      <Audio src={audioUrl} />

      {/* Background Image */}
      <AbsoluteFill>
        <Img
          src={imagesUrl[currentImageIndex]}
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            opacity: imageOpacity,
            transform: `scale(${imageScale})`,
            transition: 'transform 0.1s ease-out',
          }}
        />
      </AbsoluteFill>

      {/* Current Word Overlay */}
      <AbsoluteFill
        style={{
          justifyContent: 'center',
          alignItems: 'center',
          padding: '60px 40px',
          background: 'linear-gradient(0deg, rgba(0,0,0,0.8) 0%, rgba(0,0,0,0.3) 50%, rgba(0,0,0,0.8) 100%)',
        }}
      >
        <div
          style={{
            color: 'white',
            fontSize: '48px',
            fontWeight: 'bold',
            textAlign: 'center',
            lineHeight: '1.2',
            fontFamily: 'Arial, sans-serif',
            textShadow: '2px 2px 4px rgba(0,0,0,0.8)',
            maxWidth: '90%',
          }}
        >
          {getCurrentWord()}
        </div>
      </AbsoluteFill>


    </AbsoluteFill>
  );
};

