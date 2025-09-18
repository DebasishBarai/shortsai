import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { headers } from 'next/headers';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { replicate } from '@/lib/replicate';
import { Readable } from 'node:stream';

const s3 = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_PUBLIC_ACCESS_KEY || '',
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || '',
  }
})

export async function POST(request: Request) {
  try {
    const session = await auth.api.getSession({
      headers: await headers()
    });
    console.log("Session:", session); // Debug log

    if (!session?.user?.id) {
      return NextResponse.json({
        success: true,
        currentCredits: 0,
      });
    }

    const body = await request.json();

    const { adId } = body;

    // Validate required fields
    if (!adId) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Get ad
    const ad = await prisma.ad.findUnique({
      where: { id: adId, userId: session.user.id },
    });

    console.log("Found ad:", ad); // Debug log

    if (!ad) {
      return NextResponse.json({ error: "Ad not found" });
    }

    // check if ad video is already present
    if (ad.adVideoUrl && ad.adVideoUrl !== "") {
      return NextResponse.json({
        success: true,
        message: "Ad video already exists",
        id: ad.id,
        image: ad.adImageUrl,
        video: ad.adVideoUrl,
      });
    }

    if (!ad.adImageUrl) {
      return NextResponse.json({ error: "Ad image not found" });
    }

    // Direct prompts for video generation
    const PROMPT = `Transform the uploaded image into a short dynamic advertisement video.
Add gentle camera movement such as slow zoom-in, panning or slight rotation
to create depth and energy. Introduce subtle animated particles or light
streaks around the product to emphasize motion and vibrance.
Keep the overall look clean, colorful and professional, highlighting the
product as the main focus throughout the clip.`;

    const AVATAR_PROMPT = `Transform the uploaded image into a short dynamic advertisement video.
Focus on subtle environmental animation while keeping the person and product completely stable and sharp.
Add gentle animated particles, light streaks, or floating elements in the background around the scene
to create energy and movement. Use very minimal camera movement - perhaps a slow, gentle zoom-in
or slight drift - but ensure the person holding the product remains the clear, steady focal point.
Keep the person's pose and the product position fixed to maintain a natural, professional look
while the background elements provide the dynamic motion and vibrance.`;

    const finalPrompt = ad.avatar && ad.avatar !== '' ? AVATAR_PROMPT : PROMPT;


    // Generate ads video
    const input = {
      image: ad.adImageUrl,
      prompt: finalPrompt,
    };

    const output = await replicate.run("wan-video/wan-2.2-i2v-fast", { input });

    console.log('wan video output')
    console.log(output);
    console.log(typeof output);

    if (!output) {
      throw new Error('No video generated');
    }

    // s3 uploads
    const key = `shortsai/${session.user.id}/${ad.id}/videos/ad.mp4`; // based on your image format

    // @ts-expect-error replicate.run() has the url() method
    const resp = await fetch(output.url());
    const videoBytes = Buffer.from(await resp.arrayBuffer());

    const command = new PutObjectCommand({
      Bucket: process.env.AWS_BUCKET_NAME || '',
      Key: key,
      Body: videoBytes,
      ContentType: "video/mp4",
      ACL: "public-read",
    });

    await s3.send(command);

    await prisma.ad.update({
      where: { id: ad.id },
      data: {
        adVideoUrl: `https://${process.env.AWS_BUCKET_NAME}.s3.amazonaws.com/${key}`,
      },
    });

    return NextResponse.json({
      success: true,
      id: ad.id,
      image: ad.adImageUrl,
      video: `https://${process.env.AWS_BUCKET_NAME}.s3.amazonaws.com/${key}`,
    });
  } catch (error) {
    console.log({ error });
    return NextResponse.json(
      { error: "Failed to check credits" },
      { status: 500 }
    );
  }
}
