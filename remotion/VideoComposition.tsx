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

  // Debug logging to help identify issues
  if (frame === 0) {
    console.log('VideoComposition Debug Info:', {
      durationInFrames,
      fps,
      framesLength: frames?.length || 0,
      captionLength: caption?.length || 0,
      imagesUrlLength: imagesUrl?.length || 0
    });
  }

  // Calculate frames per image (equal distribution)
  // Add validation to prevent NaN values
  const framesPerImage = frames && frames.length > 0
    ? Math.floor(durationInFrames / frames.length)
    : durationInFrames; // If no frames, use full duration

  // Debug logging for framesPerImage
  if (frame === 0) {
    console.log('framesPerImage calculation:', {
      framesLength: frames?.length || 0,
      durationInFrames,
      framesPerImage
    });
  }

  // Determine current image index with safety checks
  const currentImageIndex = frames && frames.length > 0
    ? Math.min(
      Math.floor(frame / framesPerImage),
      frames.length - 1
    )
    : 0;

  // Calculate next image index for smooth transitions
  const nextImageIndex = frames && frames.length > 0
    ? Math.min(currentImageIndex + 1, frames.length - 1)
    : 0;

  // Get current time in milliseconds
  const currentTimeMs = (frame / fps) * 1000;

  // Find current caption words
  const currentWords = caption && Array.isArray(caption) && caption.length > 0
    ? caption.filter(
      (word) => word.start <= currentTimeMs && word.end > currentTimeMs
    )
    : [];

  // Get current word to display
  const getCurrentWord = () => {
    const currentWord = currentWords[0];
    return currentWord ? currentWord.text : '';
  };

  // Improved transition logic - crossfade between images
  const frameInSegment = frame % framesPerImage;
  const transitionDuration = 15; // frames for transition

  // Calculate opacities for current and next image
  const isInTransition = frameInSegment >= (framesPerImage - transitionDuration);
  const isLastImage = currentImageIndex >= (frames?.length || 0) - 1;

  let currentImageOpacity = 1;
  let nextImageOpacity = 0;

  if (isInTransition && !isLastImage) {
    const transitionProgress = (frameInSegment - (framesPerImage - transitionDuration)) / transitionDuration;
    currentImageOpacity = interpolate(
      transitionProgress,
      [0, 1],
      [1, 0],
      { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
    );
    nextImageOpacity = interpolate(
      transitionProgress,
      [0, 1],
      [0, 1],
      { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
    );
  }

  // Zoom effect based on parameter
  const getImageScale = (imageIndex: number) => {
    if (zoomEffect === 'none' || !frames || frames.length === 0) {
      return 1.0; // No zoom or no frames
    }

    const startScale = zoomEffect === 'in' ? 1.0 : 1.1;
    const endScale = zoomEffect === 'in' ? 1.1 : 1.0;

    // Use the frame position within the current image segment
    const effectiveFrame = imageIndex === currentImageIndex ? frameInSegment : 0;

    return interpolate(
      effectiveFrame,
      [0, framesPerImage],
      [startScale, endScale],
      { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
    );
  };

  return (
    <AbsoluteFill style={{ backgroundColor: '#000' }}>
      {/* Audio */}
      <Audio src={audioUrl} />

      {/* Background Images with Smooth Transitions */}
      <AbsoluteFill>
        {imagesUrl && imagesUrl.length > 0 ? (
          <>
            {/* Current Image */}
            {imagesUrl[currentImageIndex] && (
              <Img
                src={imagesUrl[currentImageIndex]}
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                  opacity: currentImageOpacity,
                  transform: `scale(${getImageScale(currentImageIndex)})`,
                  position: 'absolute',
                  top: 0,
                  left: 0,
                }}
              />
            )}

            {/* Next Image (for transition) */}
            {!isLastImage && imagesUrl[nextImageIndex] && nextImageOpacity > 0 && (
              <Img
                src={imagesUrl[nextImageIndex]}
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                  opacity: nextImageOpacity,
                  transform: `scale(${getImageScale(nextImageIndex)})`,
                  position: 'absolute',
                  top: 0,
                  left: 0,
                }}
              />
            )}
          </>
        ) : (
          // Fallback background if no images
          <div style={{
            width: '100%',
            height: '100%',
            backgroundColor: '#000',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'white',
            fontSize: '24px'
          }}>
            No Image Available
          </div>
        )}
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
