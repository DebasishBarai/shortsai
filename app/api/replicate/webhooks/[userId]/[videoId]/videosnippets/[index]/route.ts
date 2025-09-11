import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

interface PageProps {
  params: Promise<{
    userId: string;
    videoId: string;
    index: string;
  }>
}

export async function POST(
  req: NextRequest,
  { params }: PageProps
) {
  console.log("🎯 Replicate Webhook received!");
  try {
    const body = await req.json();
    const { status, output } = body;
    const { userId, videoId, index } = await params;
    const idx = parseInt(index, 10);

    if (status === "succeeded" && output) {
      const video = await prisma.video.findUnique({
        where: { id: videoId, userId: userId },
        select: { videoSnippetsUrl: true },
      });

      if (!video) {
        return NextResponse.json({ error: "Video not found" }, { status: 404 });
      }

      const snippets: { index: number; url: string }[] =
        (video.videoSnippetsUrl as any) || [];

      const updatedSnippets = snippets.map((s) =>
        s.index === idx
          ? { ...s, url: Array.isArray(output) ? output[0] : output }
          : s
      );

      await prisma.video.update({
        where: { id: videoId },
        data: { videoSnippetsUrl: updatedSnippets },
      });
    }

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("Webhook error:", err);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

