import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { prisma } from "@/lib/prisma";
import { authOptions } from "@/lib/auth";

export async function POST(request: Request, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions);
    console.log("Session:", session); // Debug log

    if (!session?.user?.id) {
      console.log('🔴 Unauthorized request attempt');
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const videoId = params.id;
    console.log("Fetching video data:", videoId); // Debug log


    // Get user
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
    });
    console.log("Found user:", user); // Debug log

    if (!user) {
      console.log('🔴 User not found');
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      );
    }

    // Get user's videos
    const video = await prisma.video.findUnique({
      where: {
        id: videoId,
        userId: user.id,
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

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions);
    console.log("Session:", session); // Debug log

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const videoId = params.id;
    console.log("Deleting video:", videoId); // Debug log

    // Get user
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
    });
    console.log("Found user:", user); // Debug log

    if (!user) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      );
    }

    // Check if video belongs to user
    const video = await prisma.video.findFirst({
      where: {
        id: videoId,
        userId: user.id
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
