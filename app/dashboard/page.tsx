"use client";

import { useSession } from 'next-auth/react';
import { redirect } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { CalendarDays, Bell, Plus, Trash2, Video, Play } from 'lucide-react';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { format } from 'date-fns';
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
import { toast } from "sonner";
import { Badge } from '@/components/ui/badge';
import Image from 'next/image';

import { convertValueToLabel } from '@/lib/functions';
import axios from 'axios';
import { useRecoilState } from 'recoil';
import { creditState } from '@/store/store';

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
  frames?: any;
  audioUrl?: string;
  caption?: any;
}

interface User {
  createdAt: string;
  credits: number;
}

export default function DashboardPage() {
  const { data: session, status } = useSession({
    required: true,
    onUnauthenticated() {
      redirect('/login');
    },
  });

  const [videos, setVideos] = useState<Video[]>([]);
  const [userData, setUserData] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [credits, setCredits] = useRecoilState(creditState);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [videosRes, userRes] = await Promise.all([
          axios.post('/api/user/videos'),
          axios.post('/api/user')
        ]);

        const videosData = await videosRes.data;
        const userData = await userRes.data;

        if (userData?.credits !== undefined) {
          setCredits(userData.credits)
        }

        if (Array.isArray(videosData)) {
          // Sort videos by creation date (newest first)
          const sortedVideos = videosData.sort((a: Video, b: Video) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
          );
          setVideos(sortedVideos);
        }
        if (userData) {
          console.log(userData);
          setUserData(userData);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  const deleteVideo = async (id: string) => {
    try {
      const res = await axios.delete(`/api/user/videos/${id}`);

      if (res.status !== 200) {
        throw new Error('Failed to delete video');
      }

      setVideos(videos.filter(video => video.id !== id));
      toast.success('Video deleted successfully');
    } catch (error) {
      console.error('Error deleting video:', error);
      toast.error('Failed to delete video');
    }
  };

  if (status === "loading" || isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[calc(100vh-4rem)]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 sm:px-6 py-4 sm:py-6 lg:py-8 space-y-6 sm:space-y-8">
      {/* User Welcome Section */}
      <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
        <div className="space-y-2">
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold">Welcome back, {session?.user?.name}</h1>
          <p className="text-sm sm:text-base text-muted-foreground">
            <span className="text-primary font-medium">
              {credits || 0} credits remaining
            </span>
          </p>
        </div>
      </div>

      {/* Header Section */}
      <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-between items-start sm:items-center">
        <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 w-full sm:w-auto">
          <Link href="/create" className="w-full sm:w-auto">
            <Button className="w-full sm:w-auto">
              <Plus className="mr-2 h-4 w-4" />
              Create Video
            </Button>
          </Link>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium">Total Videos</CardTitle>
            <Video className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{videos.length}</div>
            <p className="text-xs text-muted-foreground">All time</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium">Remaining Credits</CardTitle>
            <div className="h-4 w-4 text-muted-foreground">💰</div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{userData?.credits || 0}</div>
            <p className="text-xs text-muted-foreground">Available</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium">This Month</CardTitle>
            <CalendarDays className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {videos.filter(video => {
                const videoDate = new Date(video.createdAt);
                const now = new Date();
                return videoDate.getMonth() === now.getMonth() && videoDate.getFullYear() === now.getFullYear();
              }).length}
            </div>
            <p className="text-xs text-muted-foreground">Videos created</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium">Recent Activity</CardTitle>
            <Bell className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {videos.filter(video => {
                const videoDate = new Date(video.createdAt);
                const now = new Date();
                const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
                return videoDate >= sevenDaysAgo;
              }).length}
            </div>
            <p className="text-xs text-muted-foreground">Last 7 days</p>
          </CardContent>
        </Card>
      </div>

      {/* Recent Videos */}
      <Card>
        <CardHeader className="px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row gap-3 justify-between items-start sm:items-center">
            <CardTitle className="text-lg sm:text-xl">Recent Videos</CardTitle>
            <Link href="/videos">
              <Button variant="ghost" size="sm" className="w-full sm:w-auto">View All</Button>
            </Link>
          </div>
          <CardDescription className="text-sm sm:text-base">Your recently created AI videos</CardDescription>
        </CardHeader>
        <CardContent className="px-4 sm:px-6 lg:px-8">
          {videos.length === 0 ? (
            <div className="text-center py-8 sm:py-10 text-muted-foreground">
              <Video className="h-12 w-12 mx-auto mb-4 text-muted-foreground/50" />
              <p className="text-sm sm:text-base">No videos yet</p>
              <p className="text-xs sm:text-sm">Create your first AI video to get started</p>
              <Link href="/create">
                <Button className="mt-4">
                  <Plus className="mr-2 h-4 w-4" />
                  Create Your First Video
                </Button>
              </Link>
            </div>
          ) : (
            <div className="space-y-4 sm:space-y-6">
              {videos.slice(0, 6).map((video) => (
                <div
                  key={video.id}
                  className="flex flex-col sm:flex-row gap-4 p-4 rounded-lg border hover:shadow-sm transition-shadow"
                >
                  {/* Video Thumbnail */}
                  <div className="relative w-full sm:w-32 rounded-lg overflow-hidden bg-muted flex-shrink-0">
                    <div className="aspect-[9/16] w-full">
                      {video.imagesUrl && video.imagesUrl.length > 0 ? (
                        <Image
                          src={video.imagesUrl[0]}
                          alt={video.title || 'Video thumbnail'}
                          fill
                          className="object-cover"
                          sizes="(max-width: 640px) 100vw, 128px"
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
                  </div>

                  {/* Video Details */}
                  <div className="flex-1 space-y-3">
                    <div className="space-y-2">
                      <h3 className="font-semibold text-lg sm:text-xl line-clamp-2">
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
                        {video.style ? convertValueToLabel({ type: "VideoStyle", input: video.style as string }) : 'Unknown Style'}
                      </Badge>
                      <Badge variant="outline" className="text-xs">
                        {video.voiceType ? convertValueToLabel({ type: "VoiceType", input: video.voiceType as string }) : 'Unknown Voice'}
                      </Badge>
                      <Badge variant="outline" className="text-xs">
                        {video.duration ? convertValueToLabel({ type: "VideoDuration", input: video.duration as string }) : 'Unknown Duration'}
                      </Badge>
                      <Badge variant="outline" className="text-xs">
                        {video.contentType ? convertValueToLabel({ type: "ContentType", input: video.contentType as string }) : 'Unknown Type'}
                      </Badge>
                    </div>

                    {/* Creation Date */}
                    <div className="text-xs text-muted-foreground">
                      Created on {format(new Date(video.createdAt), 'PPP')}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2">
                    <Link href={`/video/${video.id}`}>
                      <Button variant="outline" size="sm">
                        <Play className="mr-2 h-4 w-4" />
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
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
