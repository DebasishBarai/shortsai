import { VideoPlayer } from '@/components/VideoPlayer';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Calendar, Clock, Mic, FileText, Play, Download } from 'lucide-react';
import { VideoPageClient } from './VideoPageClient';

interface PageProps {
  params: Promise<{
    videoId: string;
  }>
}

export default async function VideoPage({ params }: PageProps) {
  const { videoId } = await params;
  
  return <VideoPageClient videoId={videoId} />;
}
