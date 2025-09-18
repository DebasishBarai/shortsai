import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { headers } from 'next/headers';
import { generateAdsImageWithNanoBanana } from "@/lib/ai";
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

    const { base64Image, description, size, avatarName, base64Avatar } = body;

    // Validate required fields
    if (!base64Image) {
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

    const productBytes = Buffer.from(base64Image, 'base64');

    // create ad in database
    const ad = await prisma.ad.create({
      data: {
        userId: user.id,
        productData: productBytes,
        description,
        avatar: avatarName,
      },
    })

    if (!ad) {
      return NextResponse.json({ error: "Failed to create ad" });
    }

    // Generate ads image
    const image = await generateAdsImageWithNanoBanana({
      base64Image,
      description,
      size,
      avatarName,
      base64Avatar,
    });

    if (!image || !image.data) {
      throw new Error('No image generated');
    }

    // Convert base64 to buffer for S3 upload
    const imgBytes = Buffer.from(image.data, 'base64');

    // s3 uploads
    const key = `shortsai/${user.id}/${ad.id}/images/ad.png`; // or .png based on your image format

    const command = new PutObjectCommand({
      Bucket: process.env.AWS_BUCKET_NAME || '',
      Key: key,
      Body: imgBytes,
      ContentType: "image/png", // or "image/png"
      ACL: "public-read",
    });

    await s3.send(command);

    await prisma.ad.update({
      where: { id: ad.id },
      data: {
        adImageUrl: `https://${process.env.AWS_BUCKET_NAME}.s3.amazonaws.com/${key}`,
      },
    });

    return NextResponse.json({
      success: true,
      image: `https://${process.env.AWS_BUCKET_NAME}.s3.amazonaws.com/${key}`,
    });
  } catch (error) {
    console.log({ error });
    return NextResponse.json(
      { error: "Failed to check credits" },
      { status: 500 }
    );
  }
}
