import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { headers } from 'next/headers';
import { generateAdsImageWithNanoBanana } from "@/lib/ai";

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

    const body = await request.json();

    const { base64Image, description, size, base64Avatar } = body;

    // Validate required fields
    if (!base64Image) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Generate ads image
    const image = await generateAdsImageWithNanoBanana({
      base64Image,
      description,
      size,
      base64Avatar,
    });

    if (!image || !image.data) {
      throw new Error('No image generated');
    }

    return NextResponse.json({
      success: true,
      image,
    });
  } catch (error) {
    console.log({ error });
    return NextResponse.json(
      { error: "Failed to check credits" },
      { status: 500 }
    );
  }
}
