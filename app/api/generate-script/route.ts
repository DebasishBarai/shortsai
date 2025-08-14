import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { prisma } from "@/lib/prisma";
import { authOptions } from "@/lib/auth";
import { generateScript } from "@/lib/ai";
import { convertValueToLabel } from "@/lib/functions";
import { VideoDuration } from "@prisma/client";

export async function POST(request: Request) {
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

    const contentTypePrompts = {
      randomAiStory: "a video on any original creative story with science fiction, fantasy, or futuristic elements",

      scaryStay: "a video on any spine-chilling horror story or urban legend with supernatural elements",

      historicalFacts: "a video on any very popular historical facts or significant historical events",

      bedTimeStory: "a video on any gentle, magical bedtime story perfect for children with friendly characters",

      motivational: "a video on any inspirational success story or motivational message about overcoming challenges",

      funFacts: "a video on any amazing and mind-blowing fun facts about science, nature, space, or everyday things"
    }

    const scriptPrompt = contentType === 'customPrompt'
      ? prompt
      : contentTypePrompts[contentType as keyof typeof contentTypePrompts] || contentTypePrompts.randomAiStory;

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

    const noOfScenes = duration === VideoDuration.DURATION_60 ? 20 : duration === VideoDuration.DURATION_30 ? 10 : 5;

    const aiPrompt = `Generate a script for each scene to generate a ${convertValueToLabel({ type: "VideoDuration", input: duration })} video. The scenes should be each of approximately 3 seconds long. Hence, for ${convertValueToLabel({ type: "VideoDuration", input: duration })} video, there should be approximately ${noOfScenes} no of scenes. 

Give me the result in JSON format with the following structure:
- title: An engaging title for the video (max 60 characters)
- description: A compelling description for the video (max 200 characters)
- scenes: An array of scene objects, each containing imagePrompt and contentText fields

For each scene:
- imagePrompt: The detailed prompt to generate the image with AI
- contentText: Script which will be played while the image generated from the respective imagePrompt is shown

Topic of the video: ${scriptPrompt}

Return only valid JSON with no additional text or formatting.`;

    // generate video image prompt and script with AI
    const scriptRes: string = await generateScript({ prompt: aiPrompt }) as string;

    if (!scriptRes) {
      return NextResponse.json(
        { error: "Failed to generate script" },
        { status: 500 }
      );
    }

    const script = JSON.parse(scriptRes.replace(/```json\s*/g, '').replace(/```\s*$/g, '').trim());
    console.log({ data: script }); // Debug log

    const video = await prisma.video.create({
      data: {
        userId: user.id,
        title: script.title,
        description: script.description,
        frames: script.scenes,
        prompt: prompt,
        contentType: contentType,
        style: style,
        voiceType: voiceType,
        aspectRatio: aspectRatio,
        duration: duration,
      }
    });

    console.log({ video }); // Debug log

    if (!video) {
      return NextResponse.json({ error: "Failed to create video" });
    }

    return NextResponse.json({ success: true, script, videoId: video.id });
  } catch (error) {
    console.log(error); // Debug log
    return NextResponse.json(
      { error: "Failed to create video" },
      { status: 500 }
    );
  }
}

