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
    console.log("Check credits request body:", body); // Debug log

    const { requiredCredits = 1 } = body;

    // Validate required fields
    if (typeof requiredCredits !== 'number' || requiredCredits <= 0) {
      return NextResponse.json(
        { error: "Invalid required credits amount" },
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

    const hasEnoughCredits = (user as any).credits >= requiredCredits;
    const currentCredits = (user as any).credits || 0;

    console.log("Credit check result:", { 
      hasEnoughCredits, 
      currentCredits, 
      requiredCredits 
    }); // Debug log

    return NextResponse.json({ 
      success: true, 
      hasEnoughCredits,
      currentCredits,
      requiredCredits
    });
  } catch (error) {
    console.log({ error });
    return NextResponse.json(
      { error: "Failed to check credits" },
      { status: 500 }
    );
  }
} 