import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { headers } from 'next/headers';
import { replicate } from "@/lib/replicate";

export async function POST(request: Request) {
  try {
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
    console.log("generate images request body:", body); // Debug log

    const { videoId, videoScript, style, aspectRatio } = body;

    // Validate required fields
    if (!videoId || !videoScript || !style || !aspectRatio) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

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

    // generate video snippets from video script

    const getStyleDescription = ({ style }: { style: "realistic" | "cartoon" | "watercolor" | "sketch" }) => {
      const styles = {
        realistic: "photorealistic, high-quality photography style with natural lighting and detailed textures",
        cartoon: "vibrant cartoon illustration with bold colors, clean lines, and animated style",
        watercolor: "soft watercolor painting with flowing colors, gentle brushstrokes, and artistic texture",
        sketch: "hand-drawn pencil sketch with detailed line work, shading, and artistic sketching"
      };
      return styles[style] || styles.realistic;
    };

    console.log({ videoScript })

    videoScript.forEach(async (element: { contentText: string; imagePrompt: string }, index: number) => {
      const input = {
        prompt: `Create a ${getStyleDescription({ style })} video of 5 secs based on the topic: ${element.imagePrompt}`,
        aspect_ratio: '9:16',
      }
      await replicate.predictions.create({
        model: "wan-video/wan-2.2-t2v-fast",
        input: input,
        webhook: `${process.env.REPLICATE_WEBHOOK_URL}/api/replicate/webhooks/${user.id}/${videoId}/videosnippets/${index}`,
        webhook_events_filter: ["completed"],
      });
    })

    return NextResponse.json({ success: true, videoId: videoId });
  } catch (error) {
    console.log({ error });
    return NextResponse.json(
      { error: "Failed to create video" },
      { status: 500 }
    );
  }
}


