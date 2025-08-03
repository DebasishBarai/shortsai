import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { prisma } from "@/lib/prisma";
import { authOptions } from "@/lib/auth";

export async function DELETE(
  request: Request,
  { params }: { params: { id: string; contactId: string } }
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

    // Check if the contact exists and belongs to the group
    const contact = await prisma.contact.findFirst({
      where: {
        id: params.contactId,
        userId: user.id,
      },
      include: {
        groups: true
      }
    });

    if (!contact) {
      return NextResponse.json(
        { error: "Contact not found" },
        { status: 404 }
      );
    }

    const hasGroup = contact.groups.some(group => group.id === params.id)

    if (hasGroup){
    // Delete the contact
    await prisma.contact.update({
      where: {
        id: params.contactId,
        userId: user.id,
      },
      data: {
        groups: {
          disconnect: {
            id: params.id
          }
        }
      }
    })
      
    return NextResponse.json({ success: true });
      
    } else {
      throw new Error('not part of the group')
    }
  } catch (error) {
    console.error('Error deleting contact:', error);
    return NextResponse.json(
      { error: "Failed to delete contact" },
      { status: 500 }
    );
  }
} 
