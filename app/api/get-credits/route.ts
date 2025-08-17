import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { prisma } from "@/lib/prisma";
import { authOptions } from "@/lib/auth";

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
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

    const currentCredits = (user as any).credits || 0;

    console.log("Credit check result:", {
      currentCredits,
    }); // Debug log

    return NextResponse.json({
      success: true,
      currentCredits,
    });
  } catch (error) {
    console.log({ error });
    return NextResponse.json(
      { error: "Failed to check credits" },
      { status: 500 }
    );
  }
} 
