import { UserShortVideoList } from '@/components/ai-tools/short-videos/user-short-video-list'
import { ShortVideoDemoList } from '@/components/ai-tools/short-videos/short-videos'

export default function Page() {
  return (
    <>
      <ShortVideoDemoList />
      <UserShortVideoList />
    </>
  )
}
