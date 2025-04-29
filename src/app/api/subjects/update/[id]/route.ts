import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  if (!id) {
    return NextResponse.json(
      { success: false, message: "Subject ID is required" },
      { status: 400 }
    );
  }

  try {
    const body = await req.json();
    const { name, teacherIds } = body;

    if (!name || name.trim() === "") {
      return NextResponse.json(
        { success: false, message: "Subject name is required" },
        { status: 400 }
      );
    }

    if (!Array.isArray(teacherIds) || teacherIds.length === 0) {
      return NextResponse.json(
        { success: false, message: "At least one teacher ID is required" },
        { status: 400 }
      );
    }

    // Check if name already exists, excluding current subject
    const existing = await prisma.subject.findFirst({
      where: {
        name,
        NOT: [{ id }],
      },
    });

    if (existing) {
      return NextResponse.json(
        { success: false, message: "Subject name already exists" },
        { status: 409 }
      );
    }

    // Update subject by string id and associate the teachers
    const updatedSubject = await prisma.subject.update({
      where: { id },
      data: {
        name,
        teachers: {
          connect: teacherIds.map((teacherId: string) => ({
            id: teacherId,
          })),
        },
      },
      include: {
        teachers: true, // Including teachers in the response to confirm the update
      },
    });

    return NextResponse.json(
      { success: true, data: updatedSubject },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("[UPDATE_SUBJECT_ERROR]", error);
    return NextResponse.json(
      {
        success: false,
        message: error?.message || "Failed to update subject",
      },
      { status: 500 }
    );
  }
}
