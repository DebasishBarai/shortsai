import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { prisma } from "@/lib/prisma";
import { authOptions } from "@/lib/auth";
import { generateImageWithFlash } from "@/lib/ai";
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';

const s3 = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_PUBLIC_ACCESS_KEY || '',
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || '',
  }
})

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

    // generate images from video script

    // Wait for all images to be generated
    const imageList = await Promise.all(
      videoScript.map(async (element: { contentText: string; imagePrompt: string }, index: number) => {
        const image = await generateImageWithFlash({ prompt: element.imagePrompt, style: style, aspectRatio: aspectRatio });
        if (!image || !image.data) {
          throw new Error(`No image generated for element ${index}`);
        }

        // Convert base64 to buffer for S3 upload
        const imgBytes = Buffer.from(image.data, 'base64');

        return { imgBytes, index }; // Include index for S3 key naming
      })
    );

    // Save all images to S3
    const s3UploadPromises = imageList.map(async ({ imgBytes, index }) => {
      const key = `shortsai/${user.id}/${videoId}/images/${index}.png`; // or .png based on your image format

      const command = new PutObjectCommand({
        Bucket: process.env.AWS_BUCKET_NAME || '',
        Key: key,
        Body: imgBytes,
        ContentType: "image/png", // or "image/png"
        ACL: "public-read",
      });

      try {
        await s3.send(command);
        return {
          success: true,
          key,
          url: `https://${process.env.AWS_BUCKET_NAME}.s3.amazonaws.com/${key}`,
          index
        };
      } catch (error) {
        console.error(`Failed to upload image ${index}:`, error);
        return {
          success: false,
          error,
          index
        };
      }
    });

    const uploadResults = await Promise.all(s3UploadPromises);

    if (!uploadResults.every(result => result.success)) {
      await prisma.video.update({
        where: { id: videoId },
        data: {
          error: true,
        },
      });
      return NextResponse.json({ error: "Failed to upload images", uploadResults });
    }

    const imagesUrl = uploadResults.map(result => result.url!);
    console.log({ imagesUrl });

    const video = await prisma.video.update({
      where: { id: videoId },
      data: {
        imagesUrl: imagesUrl,
        error: false,
      },
    });

    if (!video) {
      return NextResponse.json({ error: "Failed to update video", status: 500 });
    }

    return NextResponse.json({ success: true, videoId: videoId, imagesUrl });
  } catch (error) {
    console.log({ error });
    return NextResponse.json(
      { error: "Failed to create video" },
      { status: 500 }
    );
  }
}

