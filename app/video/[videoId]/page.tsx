import { VideoComponent } from "@/components/VideoComponent";
import axios from "axios";

interface PageProps {
  params: {
    videoId: string;
  }
}

export default async function VideoPage({ params }: PageProps) {
  const { videoId } = params
  const video = await axios.post(`/api/user/videos/${videoId}`)
  return (
    <div className="container mx-auto px-4 sm:px-6 py-4 sm:py-6 lg:py-8">
      <div className="text-center mb-12 sm:mb-16">
        <VideoComponent video={video} />
      </div>
    </div>
  )
}
