'use client';

import { useState, useRef } from 'react';
import { toast } from 'sonner';
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from '@/components/ui/select';
import { ContentType, VideoStyle, VideoDuration, VoiceType, AspectRatio } from '@prisma/client';
import { convertValueToLabel } from '@/lib/functions';
import { Textarea } from '@/components/ui/textarea';
import axios from 'axios';
import { Play, Square, Coins } from 'lucide-react';
import Image from 'next/image';
import { cn } from '@/lib/utils';
import Link from 'next/link';
import { useCreditStore } from '@/store/store';
import { authClient } from '@/lib/auth-client';

export default function CreateVideoForm() {
  // const { data: session, status } = useSession({ required: true });
  // const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [isVideoReady, setIsVideoReady] = useState(false)
  const [videoId, setVideoId] = useState('')
  // const [videoTitle, setVideoTitle] = useState('')
  // const [videoDescription, setVideoDescription] = useState('')
  // const [videoScenes, setVideoScenes] = useState([])
  // const [audioScriptUrl, setAudioScriptUrl] = useState('')
  // const [videoImagesUrl, setVideoImagesUrl] = useState([])
  // const [videoCaption, setVideoCaption] = useState([])

  const setCredits = useCreditStore((state) => state.setCredits);

  const audioRef = useRef<HTMLAudioElement>(null);

  const contentType = Object.values(ContentType).map(type => ({
    value: type,
    label: convertValueToLabel({ type: "ContentType", input: type as string }),
  }))

  const videoStyle = Object.values(VideoStyle).map(type => ({
    value: type,
    label: convertValueToLabel({ type: "VideoStyle", input: type as string }),
  }))

  const voiceType = Object.values(VoiceType).map(type => ({
    value: type,
    label: convertValueToLabel({ type: "VoiceType", input: type as string }),
  }))

  // const aspectRatio = Object.values(AspectRatio).map(ratio => ({
  //   value: ratio,
  //   label: convertValueToLabel({ type: "AspectRatio", input: ratio as string }),
  // }))

  const videoDuration = Object.values(VideoDuration).map(duration => ({
    value: duration,
    label: convertValueToLabel({ type: "VideoDuration", input: duration as string }),
  }))

  const [formData, setFormData] = useState({
    prompt: '',
    contentType: contentType[0].value,
    style: videoStyle[0].value,
    voiceType: voiceType[0].value,
    aspectRatio: 'RATIO_9_16', // Default to 9:16 for short videos
    duration: videoDuration[0].value,
  });

  const handleChange = (key: string, value: string) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
  };

  const playVoicePreview = (voiceType: string) => {
    if (audioRef.current) {
      // Stop any currently playing audio
      audioRef.current.pause();
      audioRef.current.currentTime = 0;

      // Set the source to the corresponding audio file
      const audioFileName = voiceType.toLowerCase() + '.mp3';
      audioRef.current.src = `/${audioFileName}`;

      // Play the audio
      audioRef.current.play().then(() => {
        setIsPlayingAudio(true);
      }).catch((error) => {
        console.error('Error playing audio:', error);
        toast.error('Failed to play voice preview');
      });
    }
  };

  const stopVoicePreview = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
      setIsPlayingAudio(false);
    }
  };

  // Handle audio ended event
  const handleAudioEnded = () => {
    setIsPlayingAudio(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Calculate required credits based on video duration
      const getRequiredCredits = (duration: string) => {
        switch (duration) {
          case 'DURATION_15':
            return 5;
          case 'DURATION_30':
            return 10;
          case 'DURATION_60':
            return 20;
          default:
            return 5;
        }
      };

      const requiredCredits = getRequiredCredits(formData.duration);

      // Check if user has enough credits for the selected duration
      const creditCheckRes = await axios.post('/api/check-credits', {
        requiredCredits: requiredCredits
      });

      if (creditCheckRes.status !== 200) {
        throw new Error('Failed to check credits');
      }

      const { hasEnoughCredits, currentCredits } = creditCheckRes.data;

      setCredits(currentCredits)

      if (!hasEnoughCredits) {
        const durationLabel = convertValueToLabel({ type: "VideoDuration", input: formData.duration as string });
        toast.error(`Insufficient credits. You have ${currentCredits} credits but need ${requiredCredits} credits to create a ${durationLabel} video. Please purchase more credits.`);
        setIsLoading(false);
        return;
      }

      // generate script
      const res = await axios.post('/api/generate-script',
        JSON.stringify(formData),
      );

      if (res.status !== 200) {
        const errorData = await res.data;
        throw new Error(errorData?.error || 'Failed to generate script');
      }

      const videoId = res.data.videoId
      const script = res.data.script;
      console.log({ script });

      setVideoId(videoId)

      // const title = script?.title

      // setVideoTitle(title)

      // const description = script?.description

      // setVideoDescription(description)

      // setVideoScenes(script?.scenes)

      // generate script to generate the audio
      let audioScript = '';
      script?.scenes?.forEach((scene: any) => audioScript += `${scene.contentText} `)

      console.log({ audioScript })

      // generate audio
      const audioRes = await axios.post('/api/generate-audio', {
        videoId: videoId,
        script: audioScript,
        voice: formData.voiceType,
      });

      if (audioRes.status !== 200) {
        const errorData = await audioRes.data;
        throw new Error(errorData?.error || 'Failed to generate audio');
      }

      const audioUrl = audioRes.data.audioUrl
      console.log({ audioUrl });

      // setAudioScriptUrl(audioUrl)

      // generate images
      const imageRes = await axios.post('/api/generate-images', {
        videoId: videoId,
        videoScript: script?.scenes,
        style: formData.style,
        aspectRatio: convertValueToLabel({ type: "AspectRatio", input: formData.aspectRatio as string }),
      });

      if (imageRes.status !== 200) {
        const errorData = await imageRes.data;
        throw new Error(errorData?.error || 'Failed to generate images');
      }

      const imagesUrl = imageRes.data.imagesUrl;
      console.log({ imagesUrl });

      // setVideoImagesUrl(imagesUrl)

      //generate captions file for captions
      const captionRes = await axios.post('/api/generate-caption', {
        videoId: videoId,
        audioUrl: audioUrl
      })

      if (captionRes.status !== 200) {
        const errorData = await captionRes.data;
        throw new Error(errorData?.error || 'Failed to generate captions');
      }

      const caption = captionRes.data.caption

      console.log({ caption })

      // setVideoCaption(caption)

      // start video render
      const renderVideoRes = await axios.post('/api/remotion/render-video', {
        videoId: videoId,
        frames: script?.scenes,
        audioUrl: audioUrl,
        caption: caption,
        imagesUrl: imagesUrl,
      });

      if (renderVideoRes.status !== 200) {
        const errorData = await renderVideoRes.data;
        throw new Error(errorData?.error || 'Failed to render video');
      }

      const renderId = renderVideoRes.data.renderId

      console.log({ renderId })

      // decreament credits
      const { data: ingested } = await authClient.usage.ingest({
        event: "ai_video_generation",
        metadata: {
          video_duration: formData.duration,
          credits_consumed: requiredCredits,
        },
      });
      const removeCreditsRes = await axios.post('/api/remove-credits', {
        credits: requiredCredits,
      });

      if (removeCreditsRes.status !== 200) {
        const errorData = await removeCreditsRes.data;
        throw new Error(errorData?.error || 'Failed to decrement credits');
      }

      setCredits(removeCreditsRes.data.currentCredits)

      setIsVideoReady(true)

      // Show success message with remaining credits
      const durationLabel = convertValueToLabel({ type: "VideoDuration", input: formData.duration as string });
      toast.success(`${durationLabel} video created successfully! You have ${currentCredits - requiredCredits} credits remaining.`);

    } catch (error) {
      console.error(error);
      toast.error(error instanceof Error ? error.message : 'Something went wrong');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full px-4 sm:px-6 lg:px-8 py-4 sm:py-6 lg:py-8">
      <Card className="w-full">
        <CardHeader className="px-4 sm:px-6 lg:px-8 pb-4 sm:pb-6">
          <CardTitle className="text-xl sm:text-2xl lg:text-3xl text-center">
            Create New Video
          </CardTitle>
          <CardDescription className="text-sm sm:text-base text-center mt-2 sm:mt-3">
            Fill in the details to generate your AI short video.
          </CardDescription>
        </CardHeader>
        <CardContent className="px-4 sm:px-6 lg:px-8 pb-6 sm:pb-8">
          <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6 lg:space-y-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:items-start">
              {/* Left Column - Form Fields */}
              <div className="space-y-4 sm:space-y-6">
                {formData.contentType === 'customPrompt' && (
                  <div className="space-y-2 sm:space-y-3">
                    <Label htmlFor="prompt" className="text-sm sm:text-base font-medium">
                      Prompt
                    </Label>
                    <Textarea
                      id="prompt"
                      value={formData.prompt}
                      onChange={(e) => handleChange('prompt', e.target.value)}
                      placeholder='Enter your prompt here'
                      required
                      className="min-h-[100px] sm:min-h-[120px] text-sm sm:text-base"
                    />
                  </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 lg:gap-6">
                  <SelectInput
                    label="Content Type"
                    id="contentType"
                    value={formData.contentType}
                    options={contentType}
                    onChange={(val) => handleChange('contentType', val)}
                  />

                  <SelectInput
                    label="Video Style"
                    id="style"
                    value={formData.style}
                    options={videoStyle}
                    onChange={(val) => handleChange('style', val)}
                  />

                  <div className="space-y-2 sm:space-y-3">
                    <Label htmlFor="voiceType" className="text-sm sm:text-base font-medium">
                      Voice Type
                    </Label>
                    <div className="flex gap-2">
                      <Select
                        value={formData.voiceType}
                        onValueChange={(val) => handleChange('voiceType', val)}
                      >
                        <SelectTrigger className="h-10 sm:h-11 text-sm sm:text-base flex-1">
                          <SelectValue placeholder="Select voice type" />
                        </SelectTrigger>
                        <SelectContent>
                          {voiceType.map((opt) => (
                            <SelectItem key={opt.value} value={opt.value} className="text-sm sm:text-base">
                              {opt.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <Button
                        type="button"
                        variant="outline"
                        size="icon"
                        className="h-10 sm:h-11 w-10 sm:w-11"
                        onClick={() => isPlayingAudio ? stopVoicePreview() : playVoicePreview(formData.voiceType)}
                        title={isPlayingAudio ? "Stop preview" : "Play voice preview"}
                      >
                        {isPlayingAudio ? (
                          <Square className="h-4 w-4" />
                        ) : (
                          <Play className="h-4 w-4" />
                        )}
                      </Button>
                    </div>
                  </div>

                  <SelectInput
                    label="Duration"
                    id="duration"
                    value={formData.duration}
                    options={videoDuration}
                    onChange={(val) => handleChange('duration', val)}
                  />

                  {/* Credit Requirement Indicator */}
                  <div className="col-span-2 flex items-center justify-center p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
                    <Coins className="h-5 w-5 text-blue-600 dark:text-blue-400 mr-2" />
                    <span className="text-sm font-medium text-blue-700 dark:text-blue-300">
                      {formData.duration === 'DURATION_15' ? '5 credits' :
                        formData.duration === 'DURATION_30' ? '10 credits' :
                          formData.duration === 'DURATION_60' ? '20 credits' : '5 credits'} required for this video duration
                    </span>
                  </div>
                </div>

                {!isVideoReady ? (
                  <div className="pt-2 sm:pt-4">
                    <Button
                      type="submit"
                      className={cn("w-full h-11 sm:h-12 text-sm sm:text-base font-medium")}
                      disabled={isLoading}
                    >
                      {isLoading ? 'Creating...' : 'Create Video'}
                    </Button>
                  </div>
                ) : (
                  <div className="mt-6 sm:mt-8 flex justify-center">
                    <Link href={`/video/${videoId}`} className="w-full">
                      <Button
                        className={cn("w-full h-11 sm:h-12 text-sm sm:text-base font-medium")}>
                        🎬 Watch Video
                      </Button>
                    </Link>
                  </div>
                )}
              </div>

              {/* Right Column - Style Preview */}
              <div className="lg:block mt-6 lg:mt-0">
                <div className="space-y-3">
                  <Label className="text-sm font-medium text-muted-foreground">
                    Style Preview
                  </Label>
                  <div className="relative w-full max-w-[320px] mx-auto lg:mx-0">
                    <div className="aspect-[9/16] w-full rounded-lg overflow-hidden border border-border bg-muted">
                      <Image
                        src={`/${formData.style}.png`}
                        alt={`${formData.style} style preview`}
                        height={240}
                        width={240}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.style.display = 'none';
                          target.nextElementSibling?.classList.remove('hidden');
                        }}
                      />
                      <div className="hidden absolute inset-0 items-center justify-center text-muted-foreground text-sm">
                        <div className="text-center">
                          <div className="w-12 h-12 mx-auto mb-2 rounded-full bg-muted-foreground/20 flex items-center justify-center">
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 002 2z" />
                            </svg>
                          </div>
                          <p>Preview not available</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </form>
        </CardContent>
      </Card>

      {/* Hidden audio element for voice previews */}
      <audio
        ref={audioRef}
        onEnded={handleAudioEnded}
        preload="none"
      />
    </div>
  );
}

function SelectInput({
  id,
  label,
  value,
  options,
  onChange,
}: {
  id: string;
  label: string;
  value: string;
  options: string[] | { value: string; label: string }[];
  onChange: (val: string) => void;
}) {
  // Check if options are objects or strings
  const isObjectOptions = options.length > 0 && typeof options[0] === 'object';

  return (
    <div className="space-y-2 sm:space-y-3">
      <Label htmlFor={id} className="text-sm sm:text-base font-medium">
        {label}
      </Label>
      <Select value={value} onValueChange={onChange}>
        <SelectTrigger className="h-10 sm:h-11 text-sm sm:text-base">
          <SelectValue placeholder={`Select ${label.toLowerCase()}`} />
        </SelectTrigger>
        <SelectContent>
          {isObjectOptions
            ? (options as { value: string; label: string }[]).map((opt) => (
              <SelectItem key={opt.value} value={opt.value} className="text-sm sm:text-base">
                {opt.label}
              </SelectItem>
            ))
            : (options as string[]).map((opt) => (
              <SelectItem key={opt} value={opt} className="text-sm sm:text-base">
                {opt}
              </SelectItem>
            ))
          }
        </SelectContent>
      </Select>
    </div>
  );
}
