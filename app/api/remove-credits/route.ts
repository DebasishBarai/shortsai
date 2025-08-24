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
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const body = await request.json();
    console.log("Remove credits request body:", body); // Debug log

    const { credits } = body;

    // Validate required fields
    if (!credits || typeof credits !== 'number' || credits <= 0) {
      return NextResponse.json(
        { error: "Invalid credits amount" },
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

    // Add credits to user
    const updatedUser = await prisma.user.update({
      where: { id: user.id },
      data: {
        credits: {
          decrement: credits
        }
      },
    });

    console.log("Updated user credits:", updatedUser); // Debug log

    return NextResponse.json({
      success: true,
      currentCredits: updatedUser.credits,
      removedCredits: credits
    });
  } catch (error) {
    console.log({ error });
    return NextResponse.json(
      { error: "Failed to remove credits" },
      { status: 500 }
    );
  }
} 
