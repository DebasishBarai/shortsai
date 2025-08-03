import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { prisma } from "@/lib/prisma";
import { authOptions } from "@/lib/auth";

export async function POST(
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

    const { name, phone } = await request.json();

    if (!phone || !phone.trim()) {
      return NextResponse.json(
        { error: "Phone number is required" },
        { status: 400 }
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

    // Check if the phone number already exists in the database
    const existingContact = await prisma.contact.findFirst({
      where: { phone }
    });

    if (existingContact) {
      const contact = await prisma.contact.update({
        where: { id: existingContact.id },
        data: {
          groups: {
            connect: { id: params.id }
          }
        },
      })
      return NextResponse.json(contact);
    }

    // Create the contact
    const contact = await prisma.contact.create({
      data: {
        userId: user.id,
        name,
        phone,
        groups: {
          connect: {
            id: params.id
          }
        }
      }
    });

    return NextResponse.json(contact);
  } catch (error) {
    console.error('Error creating contact:', error);
    return NextResponse.json(
      { error: "Failed to create contact" },
      { status: 500 }
    );
  }
} 
