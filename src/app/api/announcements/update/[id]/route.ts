// File: app/api/announcements/update/[id]/route.ts
import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: number }> }
) {
  const { id } = await params;
  const body = await req.json();
  const { title, description, date, classId } = body;

  if (!title || !description || !date) {
    return NextResponse.json(
      { message: "Missing required fields" },
      { status: 400 }
    );
  }

  try {
    const updatedAnnouncement = await prisma.announcement.update({
      where: { id: parseInt(id as any) },
      data: {
        title,
        description,
        date: new Date(date),
        classId: classId ? Number(classId) : null,
      },
    });

    return NextResponse.json(
      {
        message: "Announcement updated successfully",
        data: updatedAnnouncement,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error updating announcement:", error);
    return NextResponse.json(
      {
        message: "Error updating announcement",
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
