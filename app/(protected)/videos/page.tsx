'use client';

import { useSession } from '@/lib/auth-client';
import { redirect } from 'next/navigation';
import { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Trash2, Search, Plus, Video, Play, Eye, Calendar, Clock, Mic, Palette } from 'lucide-react';
import Link from 'next/link';
import { toast } from 'sonner';
import { Badge } from '@/components/ui/badge';
import Image from 'next/image';

import axios from 'axios';

interface Video {
  id: string;
  title: string;
  description: string;
  imagesUrl: string[];
  createdAt: string;
  contentType: string;
  style: string;
  voiceType: string;
  duration: string;
  prompt?: string;
  frames?: any;
  audioUrl?: string;
  caption?: any;
}

export default function VideosPage() {
  const { data: session } = useSession();

  const [videos, setVideos] = useState<Video[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [styleFilter, setStyleFilter] = useState('all');
  const [durationFilter, setDurationFilter] = useState('all');
  const [contentTypeFilter, setContentTypeFilter] = useState('all');

  useEffect(() => {
    const fetchVideos = async () => {
      try {
        const res = await axios.post('/api/user/videos');

        if (res.status !== 200) {
          const errorData = await res.data;
          throw new Error(errorData?.error || 'Failed to fetch videos');
        }
        const data = res.data;
        console.log('🔵 Fetched videos:', data);
        if (Array.isArray(data)) {
          // Sort videos by creation date (newest first)
          const sortedVideos = data.sort((a: Video, b: Video) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
          );
          setVideos(sortedVideos);
        }
      } catch (error) {
        console.error('Error fetching videos:', error);
        toast.error('Failed to fetch videos');
      } finally {
        setIsLoading(false);
      }
    };

    fetchVideos();
  }, []);

  const deleteVideo = async (id: string) => {
    try {
      const res = await axios.delete(`/api/user/video`, {
        data: { videoId: id }
      });

      if (res.status !== 200) {
        const errorData = await res.data;
        throw new Error(errorData?.error || 'Failed to delete video');
      }

      setVideos(videos.filter(video => video.id !== id));
      toast.success('Video deleted successfully');
    } catch (error) {
      console.error('Error deleting video:', error);
      toast.error('Failed to delete video');
    }
  };

  const filteredVideos = videos.filter(video => {
    const matchesSearch =
      (video.title?.toLowerCase().includes(searchTerm.toLowerCase()) || false) ||
      (video.description?.toLowerCase().includes(searchTerm.toLowerCase()) || false) ||
      (video.prompt?.toLowerCase().includes(searchTerm.toLowerCase()) || false);

    const matchesStyle =
      styleFilter === 'all' || video.style === styleFilter;

    const matchesDuration =
      durationFilter === 'all' || video.duration === durationFilter;

    const matchesContentType =
      contentTypeFilter === 'all' || video.contentType === contentTypeFilter;

    return matchesSearch && matchesStyle && matchesDuration && matchesContentType;
  });

  // Get unique values for filters
  const uniqueStyles = Array.from(new Set(videos.map(v => v.style).filter(Boolean)));
  const uniqueDurations = Array.from(new Set(videos.map(v => v.duration).filter(Boolean)));
  const uniqueContentTypes = Array.from(new Set(videos.map(v => v.contentType).filter(Boolean)));

  const getDurationLabel = (duration: string) => {
    switch (duration) {
      case 'DURATION_15': return '15s';
      case 'DURATION_30': return '30s';
      case 'DURATION_60': return '60s';
      default: return duration;
    }
  };

  const getContentTypeLabel = (contentType: string) => {
    switch (contentType) {
      case 'customPrompt': return 'Custom Prompt';
      case 'productShowcase': return 'Product Showcase';
      case 'tutorial': return 'Tutorial';
      case 'story': return 'Story';
      case 'news': return 'News';
      case 'educational': return 'Educational';
      default: return contentType;
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[calc(100vh-4rem)]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 sm:px-6 py-4 sm:py-6 lg:py-8 space-y-4 sm:space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 sm:gap-4">
        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold">All Videos</h1>
        <div className="flex gap-2 w-full sm:w-auto">
          <Link href="/create" className="w-full sm:w-auto">
            <Button className="w-full sm:w-auto">
              <Plus className="mr-2 h-4 w-4" />
              Create Video
            </Button>
          </Link>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 items-start sm:items-center">
        <div className="relative flex-1 w-full">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search videos by title, description, or prompt..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-8 w-full"
          />
        </div>
        <div className="flex gap-2 w-full sm:w-auto">
          <Select
            value={styleFilter}
            onValueChange={setStyleFilter}
          >
            <SelectTrigger className="w-full sm:w-[140px]">
              <SelectValue placeholder="Style" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Styles</SelectItem>
              {uniqueStyles.map((style) => (
                <SelectItem key={style} value={style}>
                  {style.charAt(0).toUpperCase() + style.slice(1)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select
            value={durationFilter}
            onValueChange={setDurationFilter}
          >
            <SelectTrigger className="w-full sm:w-[140px]">
              <SelectValue placeholder="Duration" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Durations</SelectItem>
              {uniqueDurations.map((duration) => (
                <SelectItem key={duration} value={duration}>
                  {getDurationLabel(duration)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select
            value={contentTypeFilter}
            onValueChange={setContentTypeFilter}
          >
            <SelectTrigger className="w-full sm:w-[140px]">
              <SelectValue placeholder="Type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              {uniqueContentTypes.map((contentType) => (
                <SelectItem key={contentType} value={contentType}>
                  {getContentTypeLabel(contentType)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Mobile Card View */}
      <div className="block sm:hidden space-y-4">
        {filteredVideos.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <Video className="h-12 w-12 mx-auto mb-4 text-muted-foreground/50" />
            <p className="text-sm">No videos found</p>
            <p className="text-xs text-muted-foreground">Try adjusting your filters or create a new video</p>
          </div>
        ) : (
          filteredVideos.map((video) => (
            <div key={video.id} className="border rounded-lg p-4 space-y-4 hover:shadow-sm transition-shadow">
              {/* Video Thumbnail */}
              <div className="relative w-full h-48 rounded-lg overflow-hidden bg-muted">
                {video.imagesUrl && video.imagesUrl.length > 0 ? (
                  <Image
                    src={video.imagesUrl[0]}
                    alt={video.title || 'Video thumbnail'}
                    fill
                    className="object-cover"
                    sizes="100vw"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <Video className="h-8 w-8 text-muted-foreground" />
                  </div>
                )}
                <div className="absolute inset-0 bg-black/20 opacity-0 hover:opacity-100 transition-opacity flex items-center justify-center">
                  <Play className="h-8 w-8 text-white" />
                </div>
              </div>

              {/* Video Details */}
              <div className="space-y-3">
                <div className="space-y-2">
                  <h3 className="font-semibold text-lg line-clamp-2">
                    {video.title || 'Untitled Video'}
                  </h3>
                  {video.description && (
                    <p className="text-sm text-muted-foreground line-clamp-2">
                      {video.description}
                    </p>
                  )}
                </div>

                {/* Video Metadata */}
                <div className="flex flex-wrap gap-2 text-xs">
                  <Badge variant="secondary" className="text-xs">
                    <Palette className="h-3 w-3 mr-1" />
                    {video.style || 'Unknown Style'}
                  </Badge>
                  <Badge variant="outline" className="text-xs">
                    <Mic className="h-3 w-3 mr-1" />
                    {video.voiceType || 'Unknown Voice'}
                  </Badge>
                  <Badge variant="outline" className="text-xs">
                    <Clock className="h-3 w-3 mr-1" />
                    {getDurationLabel(video.duration)}
                  </Badge>
                  <Badge variant="outline" className="text-xs">
                    {getContentTypeLabel(video.contentType)}
                  </Badge>
                </div>

                {/* Creation Date */}
                <div className="text-xs text-muted-foreground flex items-center gap-1">
                  <Calendar className="h-3 w-3" />
                  Created on {format(new Date(video.createdAt), 'PPP')}
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-2">
                <div className="flex-1">
                  <Link href={`/video/${video.id}`}>
                    <Button variant="outline" className="w-full">
                      <Eye className="mr-2 h-4 w-4" />
                      Watch Video
                    </Button>
                  </Link>
                </div>
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-muted-foreground hover:text-destructive"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Delete Video</AlertDialogTitle>
                      <AlertDialogDescription>
                        Are you sure you want to delete this video? This action cannot be undone.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction
                        onClick={() => deleteVideo(video.id)}
                        className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                      >
                        Delete
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Desktop Table View */}
      <div className="hidden sm:block border rounded-lg overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="text-sm">Thumbnail</TableHead>
              <TableHead className="text-sm">Title</TableHead>
              <TableHead className="text-sm">Description</TableHead>
              <TableHead className="text-sm">Style</TableHead>
              <TableHead className="text-sm">Duration</TableHead>
              <TableHead className="text-sm">Voice</TableHead>
              <TableHead className="text-sm">Created</TableHead>
              <TableHead className="text-right text-sm">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredVideos.length === 0 ? (
              <TableRow>
                <TableCell colSpan={8} className="text-center py-10 text-muted-foreground">
                  <div className="flex flex-col items-center gap-2">
                    <Video className="h-8 w-8 text-muted-foreground/50" />
                    <p>No videos found</p>
                    <p className="text-sm">Try adjusting your filters or create a new video</p>
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              filteredVideos.map((video) => (
                <TableRow key={video.id} className="hover:bg-muted/50">
                  <TableCell>
                    <div className="relative w-16 h-24 rounded-lg overflow-hidden bg-muted">
                      {video.imagesUrl && video.imagesUrl.length > 0 ? (
                        <Image
                          src={video.imagesUrl[0]}
                          alt={video.title || 'Video thumbnail'}
                          fill
                          className="object-cover"
                          sizes="64px"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <Video className="h-6 w-6 text-muted-foreground" />
                        </div>
                      )}
                    </div>
                  </TableCell>
                  <TableCell className="font-medium max-w-[200px]">
                    <div className="line-clamp-2">
                      {video.title || 'Untitled Video'}
                    </div>
                  </TableCell>
                  <TableCell className="max-w-[250px]">
                    <div className="text-sm text-muted-foreground line-clamp-2">
                      {video.description || 'No description'}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="secondary" className="text-xs">
                      {video.style || 'Unknown'}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className="text-xs">
                      {getDurationLabel(video.duration)}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className="text-xs">
                      {video.voiceType || 'Unknown'}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    {format(new Date(video.createdAt), 'PP')}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Link href={`/video/${video.id}`}>
                        <Button variant="outline" size="sm">
                          <Eye className="mr-2 h-4 w-4" />
                          Watch
                        </Button>
                      </Link>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-muted-foreground hover:text-destructive"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Delete Video</AlertDialogTitle>
                            <AlertDialogDescription>
                              Are you sure you want to delete this video? This action cannot be undone.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction
                              onClick={() => deleteVideo(video.id)}
                              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                            >
                              Delete
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
} 
