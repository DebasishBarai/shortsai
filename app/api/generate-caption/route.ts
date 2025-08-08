import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { prisma } from "@/lib/prisma";
import { authOptions } from "@/lib/auth";
import { VoiceType } from "@prisma/client";

import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { AssemblyAI } from "assemblyai";

const captionClient = new AssemblyAI({
  apiKey: process.env.ASSEMBLYAI_API_KEY,
});

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    console.log("Session:", session); // Debug log

    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { videoId, audioUrl } = await request.json();

    // Validate required fields
    if (!videoId || !audioUrl) {
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
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    console.log({ videoId, audioUrl });

    // generate caption file with assemblyai
    const captionResponse = await captionClient.send({
      audio: audioUrl,
      speech_model: "universal",
    });

    if (!captionResponse.words) {
      return NextResponse.json(
        { error: "Failed to generate captions" },
        { status: 500 }
      );
    }

    const video = prisma.video.update({
      where: {
        id: videoId,
      },
      data: {
        caption: captionResponse.words
      }
    })

    if (!video) {
      return NextResponse.json(
        { error: "Failed to generate captions" },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      captions: captionResponse.words,
      videoId
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Failed to generate captions" },
      { status: 500 }
    );
  }
}
