import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { prisma } from "@/lib/prisma";
import { authOptions } from "@/lib/auth";

export async function GET(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    console.log("Session:", session); // Debug log

    if (!session?.user?.email) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    // Get user
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    });
    console.log("Found user:", user); // Debug log

    if (!user) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      );
    }

    // Get user's videos
    const videos = await prisma.video.findMany({
      where: { userId: user.id },
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        title: true,
        description: true,
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
      }
    });

    console.log("Found videos:", videos); // Debug log

    return NextResponse.json(videos);
  } catch (error) {
    console.log({ error });
    return NextResponse.json(
      { error: "Failed to fetch videos" },
      { status: 500 }
    );
  }
} 