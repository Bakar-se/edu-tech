import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  if (!id) {
    return NextResponse.json(
      { success: false, message: "Teacher ID is required" },
      { status: 400 }
    );
  }

  try {
    const teacher = await prisma.teacher.findUnique({
      where: { id },
      include: {
        subjects: true,
        classes: true,
        lessons: true,
      },
    });

    if (!teacher) {
      return NextResponse.json(
        { success: false, message: "Teacher not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data: teacher });
  } catch (error: any) {
    console.error("[GET_TEACHER_BY_ID_ERROR]", error);
    return NextResponse.json(
      {
        success: false,
        message: error?.message || "Failed to fetch teacher",
      },
      { status: 500 }
    );
  }
}
