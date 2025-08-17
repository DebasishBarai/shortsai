import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { prisma } from "@/lib/prisma";
import { authOptions } from "@/lib/auth";
import { VoiceType } from "@prisma/client";

import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { PollyClient, SynthesizeSpeechCommand } from '@aws-sdk/client-polly';

const polly = new PollyClient({
  region: process.env.AWS_REGION || '',
  credentials: {
    accessKeyId: process.env.AWS_PUBLIC_ACCESS_KEY || '',
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || '',
  }
})

const s3 = new S3Client({
  region: 'ap-south-1',
  credentials: {
    accessKeyId: process.env.AWS_PUBLIC_ACCESS_KEY || '',
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || '',
  }
})

export async function POST(request: Request) {
  console.log('AWS Region: , process.env.AWS_REGION)
  console.log('AWS Access Key: , process.env.AWS_PUBLIC_ACCESS_KEY)
  console.log('AWS Secret Access Key: , process.env.AWS_PUBLIC_ACCESS_KEY)
  try {
    const session = await getServerSession(authOptions);
    console.log("Session:", session); // Debug log

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const { videoId, script, voice } = await request.json();

    // Validate required fields
    if (!videoId || !script || !voice) {
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

    console.log({ videoId, script, voice });

    // Validate voice type
    if (!Object.values(VoiceType).includes(voice as VoiceType)) {
      return NextResponse.json(
        { error: "Invalid voice type" },
        { status: 400 }
      );
    }

    // generate audio file with aws polly
    const pollyCommand = new SynthesizeSpeechCommand({
      Text: script,
      TextType: "text",
      VoiceId: voice,
      OutputFormat: "mp3",
      Engine: "standard",
    });

    const audioResponse = await polly.send(pollyCommand);

    if (!audioResponse.AudioStream) {
      await prisma.video.update({
        where: { id: videoId },
        data: {
          error: true,
        },
      });
      return NextResponse.json(
        { error: "Failed to generate audio" },
        { status: 500 }
      );
    }


    const audioBuffer = await audioResponse.AudioStream.transformToByteArray();

    // save the audio in s3
    const audioFile = `shortsai/${user.id}/${videoId}/audio.mp3`

    const putObjectCommand = new PutObjectCommand({
      Bucket: process.env.AWS_BUCKET_NAME || '',
      Key: audioFile,
      Body: audioBuffer,
      ContentType: 'audio/mpeg',
      ACL: 'public-read',
    });

    await s3.send(putObjectCommand);

    const audioUrl = `https://${process.env.AWS_BUCKET_NAME}.s3.amazonaws.com/${audioFile}`

    // Update the video record with the audioUrl
    await prisma.video.update({
      where: { id: videoId },
      data: {
        audioUrl: audioUrl,
        error: false,
      },
    });

    return NextResponse.json({ success: true, audioUrl });
  } catch (error) {
    console.error(error)
    return NextResponse.json(
      { error: "Failed to create video" },
      { status: 500 }
    );
  }
}
