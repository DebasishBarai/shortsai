import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { prisma } from "@/lib/prisma";
import { authOptions } from "@/lib/auth";

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    console.log("Session:", session); // Debug log

    if (!session?.user?.email) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const body = await request.json();
    console.log("Add credits request body:", body); // Debug log

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
      where: { email: session.user.email },
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
          increment: credits
        }
      },
    });

    console.log("Updated user credits:", updatedUser); // Debug log

    return NextResponse.json({ 
      success: true, 
      newCredits: updatedUser.credits,
      addedCredits: credits
    });
  } catch (error) {
    console.log({ error });
    return NextResponse.json(
      { error: "Failed to add credits" },
      { status: 500 }
    );
  }
} 