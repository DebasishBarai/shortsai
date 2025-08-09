import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

import { Player } from '@remotion/player';
import { MyVideo } from "./remotion-video";
import { useEffect, useState } from "react";

export function PlayerDialog({ playVideo, videoId }: { playVideo: boolean, videoId: string }) {

  const [open, setOpen] = useState(false)

  useEffect(() => {
    setOpen(playVideo)
  }, [playVideo])
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <form>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Your video is Ready</DialogTitle>
            <DialogDescription>
              Video is ready to be published. You can now publish it.
            </DialogDescription>
          </DialogHeader>
          <Player component={MyVideo} durationInFrames={120} compositionWidth={1920} compositionHeight={1080} fps={30} controls loop />
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Cancel</Button>
            </DialogClose>
            <Button type="submit">Save changes</Button>
          </DialogFooter>
        </DialogContent>
      </form>
    </Dialog>
  )
}
