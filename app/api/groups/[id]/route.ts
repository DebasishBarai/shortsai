import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { prisma } from "@/lib/prisma";
import { authOptions } from "@/lib/auth";

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      include: {
        groups: {
          where: { id: params.id },
          include: {
            contacts: true
          }
        }
      }
    });

    if (!user || user.groups.length === 0) {
      return NextResponse.json(
        { error: "Group not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(user.groups[0]);
  } catch (error) {
    console.error('Error fetching group:', error);
    return NextResponse.json(
      { error: "Failed to fetch group" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    // Check if the group belongs to the user
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      include: {
        groups: {
          where: { id: params.id }
        }
      }
    });

    if (!user || user.groups.length === 0) {
      return NextResponse.json(
        { error: "Group not found" },
        { status: 404 }
      );
    }

    // Delete the group (this will cascade delete contacts due to the schema)
    await prisma.group.delete({
      where: { id: params.id }
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting group:', error);
    return NextResponse.json(
      { error: "Failed to delete group" },
      { status: 500 }
    );
  }
} 