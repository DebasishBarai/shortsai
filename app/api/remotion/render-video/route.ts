import { auth } from "@/lib/auth";
import { headers } from 'next/headers';
import { NextResponse } from "next/server";
import { getFunctions, renderMediaOnLambda } from '@remotion/lambda/client';
import { prisma } from "@/lib/prisma";


export async function POST(request: Request) {
  try {
    console.log('inside render video')
    const session = await auth.api.getSession({
      headers: await headers()
    });
    console.log("Session:", session); // Debug log

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const body = await request.json();
    console.log("Request body:", body); // Debug log

    const { videoId } = body;

    if (!videoId) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // get data from prisma
    const video = await prisma.video.findUnique({
      where: {
        id: videoId,
      },
    });

    if (!video) {
      return NextResponse.json(
        { error: "Video not found" },
        { status: 404 }
      );
    }

    console.log('video', video)

    if (video.renderId) {
      console.log('Video already rendered')
      return NextResponse.json({ error: "Video already rendered", status: 401 });
    }

    if (!video.audioUrl || !video.caption || !video.frames) {
      return NextResponse.json({ error: "Video not ready", status: 400 });
    }

    const withImages = video.imagesUrl && video.imagesUrl.length > 0 ? true : false;

    console.log('withImages: ', withImages)

    // Check if the video is ready to render
    const isVideoReady = (video.videoSnippetsUrl as Array<{ url: string, index: number }>)?.every(element => element.url !== '')

    if (!withImages && !isVideoReady) {
      return NextResponse.json({ message: "Video not ready", status: 400 });
    }

    //Implement video rendering logic
    const functions = await getFunctions({
      region: 'ap-south-1',
      compatibleOnly: true,
    });

    const functionName = functions[0].functionName;

    console.log(`rendering video: ${video.id}`)

    const { renderId, bucketName } = await renderMediaOnLambda({
      region: 'ap-south-1',
      functionName,
      serveUrl: process.env.SERVE_URL || '',
      composition: 'shortsai',
      inputProps: {
        frames: video.frames,
        audioUrl: video.audioUrl,
        caption: video.caption,
        withImages,
        imagesUrl: video.imagesUrl,
        videoSnippetsUrl: video.videoSnippetsUrl,
      },
      codec: 'h264',
      imageFormat: 'jpeg',
      maxRetries: 1,
      framesPerLambda: 20,
      privacy: 'public',
      webhook: {
        url: `${process.env.REMOTION_WEBHOOK_URL}`,
        secret: process.env.REMOTION_WEBHOOK_SECRET || '',
      }
    });

    await prisma.video.update({
      where: {
        id: videoId,
      },
      data: {
        renderId,
        bucketName
      },
    });

    return NextResponse.json({ success: true, renderId, bucketName });
  } catch (error) {
    console.error('Error rendering video:', error);
    return NextResponse.json(
      { error: "Failed to render video" },
      { status: 500 }
    );
  }
}
