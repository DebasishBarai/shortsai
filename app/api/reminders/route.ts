import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { prisma } from "@/lib/prisma";
import { authOptions } from "@/lib/auth";
import { Prisma } from "@prisma/client";

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
    console.log("Request body:", body); // Debug log

    const { title, message, dateTime, frequency, contactId, groupId } = body;

    // Validate required fields
    if (!title || !message || !dateTime || (!contactId && !groupId)) {
      return NextResponse.json(
        { error: "Missing required fields. Either contact or group must be provided.", received: { title, message, dateTime, frequency, contactId, groupId } },
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

    // If contactId is provided, check if the contact exists and belongs to the user
    if (contactId) {
      const contact = await prisma.contact.findFirst({
        where: {
          id: contactId,
          userId: user.id
        }
      });

      if (!contact) {
        return NextResponse.json(
          { error: "Contact not found or does not belong to the user" },
          { status: 404 }
        );
      }

    }

    // If groupId is provided, check if the group exists and belongs to the user
    if (groupId) {
      const group = await prisma.group.findFirst({
        where: {
          id: groupId,
          userId: user.id
        },
        include: {
          contacts: true
        }
      });

      if (!group) {
        return NextResponse.json(
          { error: "Group not found or does not belong to the user" },
          { status: 404 }
        );
      }

      if (group.contacts.length === 0) {
        return NextResponse.json(
          { error: "Group has no contacts" },
          { status: 400 }
        );
      }
    }

    // Create reminder with type-safe data
    const reminderData: Prisma.ReminderCreateInput = {
      title,
      message,
      dateTime: new Date(new Date(dateTime).toISOString()),
      frequency: frequency || 'once',
      user: {
        connect: {
          id: user.id
        }
      }
    };

    // If contactId is provided, connect the reminder to the contact
    if (contactId) {
      reminderData.contact = {
        connect: {
          id: contactId
        }
      };
    }

    // If groupId is provided, connect the reminder to the group
    if (groupId) {
      reminderData.group = {
        connect: {
          id: groupId
        }
      };
    }

    console.log("Creating reminder with data:", reminderData); // Debug log

    const reminder = await prisma.reminder.create({
      data: reminderData,
    });

    console.log("Created reminder:", reminder); // Debug log
    return NextResponse.json({ success: true, data: reminder });
  } catch (error) {
    console.error('Detailed error:', error);
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      return NextResponse.json(
        { error: `Database error: ${error.message}`, code: error.code },
        { status: 500 }
      );
    }
    return NextResponse.json(
      { error: "Failed to create reminder" },
      { status: 500 }
    );
  }
}

export async function GET(request: Request) {
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
        reminders: {
          include: {
            group: {
              include: {
                contacts: true
              }
            }
          },
          orderBy: { createdAt: 'desc' },
        },
      },
    });

    return NextResponse.json(user?.reminders || []);
  } catch (error) {
    console.error('Error fetching reminders:', error);
    return NextResponse.json(
      { error: "Failed to fetch reminders" },
      { status: 500 }
    );
  }
} 
