import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { prisma } from "@/lib/prisma";
import { authOptions } from "@/lib/auth";
import { Prisma } from "@prisma/client";
import { AxeIcon } from "lucide-react";

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    console.log("Session:", session); // Debug log

    if (!session?.user?.email) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const body = await request.json();
    console.log("Request body:", body); // Debug log

    const { prompt, contentType, style, voiceType, aspectRatio, duration } = body;

    // Validate required fields
    if (!contentType || !style || !voiceType || !aspectRatio || !duration) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    if (contentType === 'customPrompt' && !prompt) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
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

    // generate video image prompt and script with AI
    // convert script to audio mp3
    // save the caption file .srt
    // generate AI images and save them in imagelist
    // create video
    // console.log("Created reminder:", video); // Debug log
    return NextResponse.json({ success: true, data: video });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to create video" },
      { status: 500 }
    );
  }
}

