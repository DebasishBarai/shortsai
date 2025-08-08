'use client';

import { useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
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

import { videoScript } from '@/lib/objects';

export default function CreateVideoForm() {
  const { data: session, status } = useSession({ required: true });
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

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

  const aspectRatio = Object.values(AspectRatio).map(ratio => ({
    value: ratio,
    label: convertValueToLabel({ type: "AspectRatio", input: ratio as string }),
  }))

  const videoDuration = Object.values(VideoDuration).map(duration => ({
    value: duration,
    label: convertValueToLabel({ type: "VideoDuration", input: duration as string }),
  }))

  const [formData, setFormData] = useState({
    prompt: '',
    contentType: contentType[0].value,
    style: videoStyle[0].value,
    voiceType: voiceType[0].value,
    aspectRatio: aspectRatio[0].value,
    duration: videoDuration[0].value,
  });

  const handleChange = (key: string, value: string) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      /* const res = await axios.post('/api/generate-script',
        JSON.stringify(formData),
      );

      if (res.status !== 200) {
        const errorData = await res.data;
        throw new Error(errorData?.error || 'Failed to generate script');
      }

      const videoId = res.data.videoId
      const videoScript = res.data.data;
      console.log({ videoScript });

      // generate script to generate the audio
      let audioScript = '';
      videoScript.forEach((scene: any) => audioScript += `${scene.contentText} `)

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
      */

      const videoId = 'cme19lxfm000ba1wacfj72jwo'

      // generate images
      const imageRes = await axios.post('/api/generate-images', {
        videoId: videoId,
        videoScript: videoScript,
        style: formData.style,
        aspectRatio: convertValueToLabel({ type: "AspectRatio", input: formData.aspectRatio as string }),
      });

      if (imageRes.status !== 200) {
        const errorData = await imageRes.data;
        throw new Error(errorData?.error || 'Failed to generate images');
      }

      const uploadResults = imageRes.data.uploadResults;
      console.log({ uploadResults });
      
      //generate captions file for captions
      const captionRes = await axios.post('/api/generate-caption-file', {
        videoId: videoId,
        audioUrl: audioUrl
      })

      if (captionRes.status !== 200) {
        const errorData = await captionRes.data;
        throw new Error(errorData?.error || 'Failed to generate images');
      }

      const caption = captionRes.data.caption

      console.log({ caption })
    } catch (error) {
      console.error(error);
      toast.error(error instanceof Error ? error.message : 'Something went wrong');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-6">
      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle>Create New Video</CardTitle>
          <CardDescription>
            Fill in the details to generate your AI short video.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {formData.contentType === 'customPrompt' && (
              <div className="space-y-2">
                <Label htmlFor="prompt">Prompt</Label>
                <Textarea
                  id="prompt"
                  value={formData.prompt}
                  onChange={(e) => handleChange('prompt', e.target.value)}
                  placeholder='Enter your prompt here'
                  required
                />
              </div>
            )}

            <div className="grid grid-cols-2 gap-4">
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

              <SelectInput
                label="Voice Type"
                id="voiceType"
                value={formData.voiceType}
                options={voiceType}
                onChange={(val) => handleChange('voiceType', val)}
              />

              <SelectInput
                label="Aspect Ratio"
                id="aspectRatio"
                value={formData.aspectRatio}
                options={aspectRatio}
                onChange={(val) => handleChange('aspectRatio', val)}
              />

              <SelectInput
                label="Duration"
                id="duration"
                value={formData.duration}
                options={videoDuration}
                onChange={(val) => handleChange('duration', val)}
              />
            </div>

            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? 'Creating...' : 'Create Video'}
            </Button>
          </form>
        </CardContent>
      </Card>
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
    <div className="space-y-2">
      <Label htmlFor={id}>{label}</Label>
      <Select value={value} onValueChange={onChange}>
        <SelectTrigger>
          <SelectValue placeholder={`Select ${label.toLowerCase()}`} />
        </SelectTrigger>
        <SelectContent>
          {isObjectOptions
            ? (options as { value: string; label: string }[]).map((opt) => (
              <SelectItem key={opt.value} value={opt.value}>
                {opt.label}
              </SelectItem>
            ))
            : (options as string[]).map((opt) => (
              <SelectItem key={opt} value={opt}>
                {opt}
              </SelectItem>
            ))
          }
        </SelectContent>
      </Select>
    </div>
  );
}
