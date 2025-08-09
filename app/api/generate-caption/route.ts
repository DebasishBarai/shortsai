import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { prisma } from "@/lib/prisma";
import { authOptions } from "@/lib/auth";

import { AssemblyAI, SpeechModel } from "assemblyai";

const captionClient = new AssemblyAI({
  apiKey: process.env.ASSEMBLYAI_API_KEY as string,
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
    const speechModel: SpeechModel = "universal"
    const params = {
      audio: audioUrl as string,
      speech_model: speechModel,
    }

    const captionResponse = await captionClient.transcripts.transcribe(params);


    if (!captionResponse.words) {
      return NextResponse.json(
        { error: "Failed to generate captions" },
        { status: 500 }
      );
    }

    const caption = captionResponse.words
    console.log(caption);
    console.log(Array.isArray(caption));
    console.log(typeof caption)

    const video = await prisma.video.update({
      where: {
        id: videoId,
      },
      data: {
        caption: caption
      }
    })

    console.log({ video });

    if (!video) {
      return NextResponse.json(
        { error: "Failed to generate captions" },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      caption: caption,
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
