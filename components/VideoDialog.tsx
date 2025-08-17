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
import { Button } from '@/components/ui/button';
import { VideoPlayer } from './VideoPlayer';
import { cn } from '@/lib/utils';

interface VideoDialogProps {
  triggerText?: string;
  title?: string;
  description?: string;
  frames?: any[];
  audioUrl?: string;
  imagesUrl?: any[];
  caption?: any[];
}

export const VideoDialog: React.FC<VideoDialogProps> = ({
  triggerText = "Play Video",
  title = "Evolution Video",
  description = "Watch the story of human evolution unfold",
  frames = [],
  audioUrl = "",
  imagesUrl = [],
  caption = [],
}) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button className="w-full h-11 sm:h-12 text-sm sm:text-base font-medium">
          {triggerText}
        </Button>
      </DialogTrigger>
      <DialogContent
        className={cn("max-w-[95vw] max-h-[95vh] w-fit p-3 sm:p-4 md:p-6 overflow-auto flex flex-col items-center")}
      >
        <DialogHeader className="pb-3 sm:pb-4 w-full">
          <DialogTitle className="text-center text-base sm:text-lg md:text-xl">{title}</DialogTitle>
          <DialogDescription className="text-center text-xs sm:text-sm md:text-base">
            {description}
          </DialogDescription>
        </DialogHeader>

        <div className="flex justify-center items-center w-full">
          <VideoPlayer 
            width={280} 
            height={495}
            frames={frames}
            audioUrl={audioUrl}
            imagesUrl={imagesUrl}
            caption={caption}
          />
        </div>
      </DialogContent>
    </Dialog>
  );
};

