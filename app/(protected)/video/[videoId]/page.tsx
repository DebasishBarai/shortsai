import { VideoPageClient } from '@/components/VideoPageClient';

interface PageProps {
  params: Promise<{
    videoId: string;
  }>
}

export default async function VideoPage({ params }: PageProps) {
  const { videoId } = await params;

  return <VideoPageClient videoId={videoId} />;
}
