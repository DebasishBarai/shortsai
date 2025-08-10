"use client";

import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { VideoPlayer } from './VideoPlayer';
import { cn } from '@/lib/utils';

interface VideoDialogProps {
  triggerText?: string;
  title?: string;
  description?: string;
}

export const VideoDialog: React.FC<VideoDialogProps> = ({
  triggerText = "Play Video",
  title = "Evolution Video",
  description = "Watch the story of human evolution unfold",
}) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <button className="rounded-full border border-solid border-transparent transition-colors flex items-center justify-center bg-foreground text-background gap-2 hover:bg-[#383838] dark:hover:bg-[#ccc] font-medium text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5">
          {triggerText}
        </button>
      </DialogTrigger>
      <DialogContent
        className={cn("max-w-[95vw] max-h-[95vh] w-fit p-4 overflow-auto flex flex-col items-center")}
      >
        <DialogHeader className="pb-4 w-full">
          <DialogTitle className="text-center text-lg">{title}</DialogTitle>
          <DialogDescription className="text-center text-sm">
            {description}
          </DialogDescription>
        </DialogHeader>

        <div className="flex justify-center items-center w-full">
          <VideoPlayer width={380} height={675} />
        </div>
      </DialogContent>
    </Dialog>
  );
};

