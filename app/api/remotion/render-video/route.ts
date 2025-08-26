import { auth } from "@/lib/auth";
import { headers } from 'next/headers';
import { NextResponse } from "next/server";
import { getFunctions, renderMediaOnLambda } from '@remotion/lambda/client';
import { prisma } from "@/lib/prisma";


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
    console.log("Request body:", body); // Debug log

    const { videoId, frames, audioUrl, caption, imagesUrl } = body;

    if (!videoId) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    //Implement video rendering logic
    const functions = await getFunctions({
      region: 'ap-south-1',
      compatibleOnly: true,
    });

    const functionName = functions[0].functionName;

    const { renderId, bucketName } = await renderMediaOnLambda({
      region: 'ap-south-1',
      functionName,
      serveUrl: process.env.SERVE_URL || '',
      composition: 'shortsai',
      inputProps: {
        frames,
        audioUrl,
        caption,
        imagesUrl,
      },
      codec: 'h264',
      imageFormat: 'jpeg',
      maxRetries: 1,
      framesPerLambda: 20,
      privacy: 'public',
      webhook: {
        url: `${process.env.REMOTION_WEBHOOK_URL}`,
        secret: process.env.REMOTION_WEBHOOK_SECRET || '',
      }
    });

    await prisma.video.update({
      where: {
        id: videoId,
      },
      data: {
        renderId,
        bucketName
      },
    });

    return NextResponse.json({ success: true, renderId, bucketName });
  } catch (error) {
    console.error('Error rendering video:', error);
    return NextResponse.json(
      { error: "Failed to render video" },
      { status: 500 }
    );
  }
}
