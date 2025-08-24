import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { headers } from 'next/headers';

export async function POST(request: NextRequest) {
  try {
    const session = await auth.api.getSession({
      headers: await headers()
    });
    console.log("Session:", session); // Debug log

    if (!session?.user?.id) {
      console.log('🔴 Unauthorized request attempt');
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }


    const body = await request.json();
    console.log("Request body:", body); // Debug log

    const { videoId } = body;

    console.log("Fetching video data:", videoId); // Debug log

    // Get user's videos
    const video = await prisma.video.findUnique({
      where: {
        id: videoId,
        userId: session?.user?.id,
      },
      select: {
        id: true,
        title: true,
        description: true,
        url: true,
        imagesUrl: true,
        createdAt: true,
        contentType: true,
        style: true,
        voiceType: true,
        duration: true,
        prompt: true,
        frames: true,
        audioUrl: true,
        caption: true,
        error: true,
        completed: true,
        renderId: true,
        bucketName: true,
      }
    });

    console.log("Found video:", video); // Debug log

    return NextResponse.json(video);
  } catch (error) {
    console.log({ error });
    return NextResponse.json(
      { error: "Failed to fetch video" },
      { status: 500 }
    );
  }
}

export async function DELETE(request: Request) {
  try {
    const session = await getServerSession(authOptions);
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
    // Check if video belongs to user
    const video = await prisma.video.findFirst({
      where: {
        id: videoId,
        userId: session?.user?.id
      },
    });

    if (!video) {
      return NextResponse.json(
        { error: "Video not found or access denied" },
        { status: 404 }
      );
    }

    // Delete the video
    await prisma.video.delete({
      where: { id: videoId },
    });

    console.log("Video deleted successfully"); // Debug log

    return NextResponse.json({ success: true });
  } catch (error) {
    console.log({ error });
    return NextResponse.json(
      { error: "Failed to delete video" },
      { status: 500 }
    );
  }
}
