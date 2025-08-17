'use client'

import axios from "axios";
import { useEffect, useState, useCallback } from "react";
import { VideoPlayer } from '@/components/VideoPlayer';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Calendar, Clock, Mic, FileText, Play, Download } from 'lucide-react';

interface VideoData {
  id: string;
  title: string | null;
  description: string | null;
  url?: string | null;
  imagesUrl?: string[] | null;
  createdAt: string | Date;
  contentType?: string | null;
  style?: string | null;
  voiceType?: string | null;
  duration?: number | string | null;
  prompt?: string | null;
  frames?: any[] | null;
  audioUrl?: string | null;
  caption?: any[] | null;
  error?: string | null;
  completed?: boolean;
}

interface VideoPageClientProps {
  videoId: string;
}

export function VideoPageClient({ videoId }: VideoPageClientProps) {
  const [video, setVideo] = useState<VideoData | null>(null);
  const [error, setError] = useState<string | null>(null);

  const getVideo = useCallback(async (videoId: string) => {
    try {
      setError(null);

      const res = await axios.post(`/api/user/video`, {
        videoId: videoId
      });

      const videoData = res.data;
      console.log('Video data:', videoData);
      setVideo(videoData);

      const progressRes = await axios.post(`/api/remotion/get-render-progress`, {
        renderId: videoData.renderId,
        bucketName: videoData.bucketName,
      });

      const progress = progressRes.data;

      console.log('Progress:', progress);
    } catch (error: any) {
      console.error('Error fetching video:', error);
      const errorMessage = error.response?.data?.error || error.message || 'Failed to fetch video';
      setError(errorMessage);
    }
  }, []);

  useEffect(() => {
    if (videoId) {
      getVideo(videoId);
    }
  }, [videoId, getVideo]); // Add videoId and getVideo as dependencies

  const formatDuration = (seconds?: number | string) => {
    if (!seconds) return 'N/A';

    // Convert to number if it's a string
    const secondsNum = typeof seconds === 'string' ? parseInt(seconds, 10) : seconds;

    // Check if it's a valid number
    if (isNaN(secondsNum)) return 'N/A';

    const minutes = Math.floor(secondsNum / 60);
    const remainingSeconds = secondsNum % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const handleDownload = () => {
    if (video?.url) {
      const link = document.createElement('a');
      link.href = video.url;
      link.download = `${video.title || 'video'}.mp4`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  const renderVideoContent = () => {
    if (!video) return null;

    // If URL exists and video is completed, show the URL video
    if (video.url && video.completed) {
      return (
        <div className="w-full flex justify-center">
          <div className="w-[380px] h-[675px]">
            <video
              src={video.url}
              controls
              className="w-full h-full object-cover rounded-lg"
              poster={video.imagesUrl?.[0]}
            >
              Your browser does not support the video tag.
            </video>
          </div>
        </div>
      );
    }

    // Otherwise, show the Remotion video player
    return (
      <VideoPlayer
        width={380}
        height={675}
        frames={video.frames || []}
        audioUrl={video.audioUrl || ""}
        imagesUrl={video.imagesUrl || []}
        caption={video.caption || []}
      />
    );
  };

  if (error) {
    return (
      <div className="container mx-auto px-4 sm:px-6 py-4 sm:py-6 lg:py-8">
        <div className="text-center mb-12 sm:mb-16 text-red-500">
          Error: {error}
        </div>
      </div>
    );
  }

  if (!video) {
    return (
      <div className="container mx-auto px-4 sm:px-6 py-4 sm:py-6 lg:py-8">
        <div className="text-center mb-12 sm:mb-16">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Loading video...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 sm:px-6 py-4 sm:py-6 lg:py-8">
      <div className="w-full max-w-7xl mx-auto">
        {/* Mobile Layout - Stacked */}
        <div className="lg:hidden space-y-6">
          {/* Video Section */}
          <div className="flex justify-center">
            {renderVideoContent()}
          </div>

          {/* Details Section */}
          <Card>
            <CardHeader>
              <CardTitle className="text-xl font-bold">{video.title || 'Untitled Video'}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {video.description && (
                <div>
                  <h3 className="font-semibold text-sm text-muted-foreground mb-2 flex items-center gap-2">
                    <FileText className="w-4 h-4" />
                    Description
                  </h3>
                  <p className="text-sm">{video.description}</p>
                </div>
              )}

              <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="flex items-center gap-2">
                  <Mic className="w-4 h-4 text-muted-foreground" />
                  <span className="text-muted-foreground">Voice:</span>
                  <span>{video.voiceType || 'N/A'}</span>
                </div>

                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-muted-foreground" />
                  <span className="text-muted-foreground">Created:</span>
                  <span>{formatDate(typeof video.createdAt === 'string' ? video.createdAt : video.createdAt.toISOString())}</span>
                </div>

                <div className="flex items-center gap-2">
                  <Play className="w-4 h-4 text-muted-foreground" />
                  <span className="text-muted-foreground">Status:</span>
                  <Badge variant={video.completed ? "default" : "secondary"}>
                    {video.completed ? "Completed" : "Processing"}
                  </Badge>
                </div>
              </div>

              {video.style && (
                <div>
                  <h3 className="font-semibold text-sm text-muted-foreground mb-2">Style</h3>
                  <Badge variant="outline">{video.style}</Badge>
                </div>
              )}

              {video.contentType && (
                <div>
                  <h3 className="font-semibold text-sm text-muted-foreground mb-2">Content Type</h3>
                  <Badge variant="outline">{video.contentType}</Badge>
                </div>
              )}

              {video.prompt && (
                <div>
                  <h3 className="font-semibold text-sm text-muted-foreground mb-2">Prompt</h3>
                  <p className="text-sm bg-muted p-3 rounded-md">{video.prompt}</p>
                </div>
              )}

              {/* Download Button */}
              {video.completed && video.url && (
                <div className="pt-4">
                  <Button
                    onClick={handleDownload}
                    className="w-full"
                    variant="default"
                  >
                    <Download className="mr-2 h-4 w-4" />
                    Download Video
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Desktop Layout - Side by Side */}
        <div className="hidden lg:grid lg:grid-cols-2 lg:gap-8 lg:items-start">
          {/* Video Section */}
          <div className="sticky top-8">
            {renderVideoContent()}
          </div>

          {/* Details Section */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-2xl font-bold">{video.title || 'Untitled Video'}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {video.description && (
                  <div>
                    <h3 className="font-semibold text-sm text-muted-foreground mb-2 flex items-center gap-2">
                      <FileText className="w-4 h-4" />
                      Description
                    </h3>
                    <p className="text-sm leading-relaxed">{video.description}</p>
                  </div>
                )}

                <div className="grid grid-cols-1 gap-4 text-sm">
                  <div className="flex items-center gap-3">
                    <Mic className="w-4 h-4 text-muted-foreground" />
                    <span className="text-muted-foreground min-w-[80px]">Voice:</span>
                    <span className="font-medium">{video.voiceType || 'N/A'}</span>
                  </div>

                  <div className="flex items-center gap-3">
                    <Calendar className="w-4 h-4 text-muted-foreground" />
                    <span className="text-muted-foreground min-w-[80px]">Created:</span>
                    <span className="font-medium">{formatDate(typeof video.createdAt === 'string' ? video.createdAt : video.createdAt.toISOString())}</span>
                  </div>

                  <div className="flex items-center gap-3">
                    <Play className="w-4 h-4 text-muted-foreground" />
                    <span className="text-muted-foreground min-w-[80px]">Status:</span>
                    <Badge variant={video.completed ? "default" : "secondary"}>
                      {video.completed ? "Completed" : "Processing"}
                    </Badge>
                  </div>
                </div>

                {video.style && (
                  <div>
                    <h3 className="font-semibold text-sm text-muted-foreground mb-2">Style</h3>
                    <Badge variant="outline">{video.style}</Badge>
                  </div>
                )}

                {video.contentType && (
                  <div>
                    <h3 className="font-semibold text-sm text-muted-foreground mb-2">Content Type</h3>
                    <Badge variant="outline">{video.contentType}</Badge>
                  </div>
                )}

                {video.prompt && (
                  <div>
                    <h3 className="font-semibold text-sm text-muted-foreground mb-2">Prompt</h3>
                    <p className="text-sm bg-muted p-4 rounded-md leading-relaxed">{video.prompt}</p>
                  </div>
                )}

                {/* Download Button */}
                {video.completed && video.url && (
                  <div className="pt-6">
                    <Button
                      onClick={handleDownload}
                      className="w-full"
                      variant="default"
                    >
                      <Download className="mr-2 h-4 w-4" />
                      Download Video
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
} 