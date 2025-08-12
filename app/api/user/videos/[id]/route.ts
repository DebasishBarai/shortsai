import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { prisma } from "@/lib/prisma";
import { authOptions } from "@/lib/auth";

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await getServerSession(authOptions);
    console.log("Session:", session); // Debug log

    if (!session?.user?.email) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const { id } = await params

    const videoId = id;
    console.log("Deleting video:", videoId); // Debug log

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
