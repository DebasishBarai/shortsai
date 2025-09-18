import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { headers } from 'next/headers';

export async function POST(request: Request) {
  try {
    const session = await auth.api.getSession({
      headers: await headers()
    });
    console.log("Session:", session); // Debug log

    if (!session?.user?.id) {
      console.log('🔴 Unauthorized request attempt');
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    // Get user
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
    });
    console.log("Found user:", user); // Debug log

    if (!user) {
      console.log('🔴 User not found');
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      );
    }

    // Get user's videos
    const ads = await prisma.ad.findMany({
      where: {
        userId: user.id,
      },
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        productData: true,
        productImageUrl: true,
        adImageUrl: true,
        adVideoUrl: true,
        description: true,
        createdAt: true,
      }
    });

    // console.log("Found videos:", videos); // Debug log

    return NextResponse.json(ads);
  } catch (error) {
    console.log({ error });
    return NextResponse.json(
      { error: "Failed to fetch videos" },
      { status: 500 }
    );
  }
} 
