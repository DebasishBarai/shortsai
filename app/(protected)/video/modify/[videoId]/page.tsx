import { VideoModifyPageClient } from '@/components/VideoModifyPageClient';

interface PageProps {
  params: Promise<{
    videoId: string;
  }>
}

export default async function VideoPage({ params }: PageProps) {
  const { videoId } = await params;

  return <VideoModifyPageClient videoId={videoId} />;
}
