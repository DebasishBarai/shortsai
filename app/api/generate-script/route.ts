import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { prisma } from "@/lib/prisma";
import { authOptions } from "@/lib/auth";
import { generateScript } from "@/lib/ai";
import { convertValueToLabel } from "@/lib/functions";

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

    const aiPrompt = `Generate a script for each scene to generate a ${convertValueToLabel({ type: "VideoDuration", input: duration })} video. Give me the result in JSON format with imagePrompt, and contentText as fields, no plain text or no other text or fields. imagePrompt is the detailed prompt to generate the image with AI. contenText is script which will be played while the image generated from the respective imagePrompt is shown. Topic of the video: ${prompt}`;

    // generate video image prompt and script with AI
    const script: string = await generateScript({ prompt: aiPrompt }) as string;

    if (!script) {
      return NextResponse.json(
        { error: "Failed to generate script" },
        { status: 500 }
      );
    }

    const data = JSON.parse(script.replace(/```json\s*/g, '').replace(/```\s*$/g, '').trim());
    console.log({ data }); // Debug log

    const video = await prisma.video.create({
      data: {
        userId: user.id,
        frames: data,
        prompt: prompt,
        contentType: contentType,
        style: style,
        voiceType: voiceType,
        aspectRatio: aspectRatio,
        duration: duration,
      }
    });

    return NextResponse.json({ success: true, data, videoId: video.id });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to create video" },
      { status: 500 }
    );
  }
}

