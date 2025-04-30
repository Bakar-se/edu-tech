// File: /app/api/students/by-parent-id/route.ts
import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma"; // Ensure prisma is properly configured

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  if (!id) {
    return NextResponse.json(
      { success: false, message: "Parent ID is required" },
      { status: 400 }
    );
  }

  try {
    // Fetch all students that belong to the given parentId, including related data
    const students = await prisma.student.findMany({
      where: { id },
      include: {
        class: {
          include: {
            lessons: true,
          },
        }, // Include class data
        parent: true, // Include parent data
        attendances: true, // Include attendance records (if needed)
        results: true, // Include results (if needed)
      },
    });

    if (students.length === 0) {
      return NextResponse.json(
        { success: false, message: "No students found for this parent" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data: students });
  } catch (error: any) {
    console.error("[GET_STUDENTS_BY_PARENT_ID_ERROR]", error);
    return NextResponse.json(
      {
        success: false,
        message: error?.message || "Failed to fetch students",
      },
      { status: 500 }
    );
  }
}
