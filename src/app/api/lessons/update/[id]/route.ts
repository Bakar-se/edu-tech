import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

// Helper function
function convertTimeToDate(time: string): Date {
  const date = new Date();
  const [hours, minutes] = time.split(":").map(Number);
  date.setHours(hours, minutes, 0, 0); // Set hours, minutes, zero seconds
  return date;
}

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  const { id } = params;
  const data = await request.json();

  try {
    // Check if the lesson exists
    const existingLesson = await prisma.lesson.findUnique({
      where: { id },
    });

    if (!existingLesson) {
      return NextResponse.json(
        { message: "Lesson not found" },
        { status: 404 }
      );
    }

    // Prepare the update data
    const updateData = {
      startTime: data.startTime
        ? convertTimeToDate(data.startTime)
        : existingLesson.startTime,
      endTime: data.endTime
        ? convertTimeToDate(data.endTime)
        : existingLesson.endTime,
      day: data.day ?? existingLesson.day,
      subjectId: data.subjectId ?? existingLesson.subjectId,
      teacherId: data.teacherId ?? existingLesson.teacherId,
      classId: data.classId ?? existingLesson.classId,
    };

    // Update the lesson
    const updatedLesson = await prisma.lesson.update({
      where: { id },
      data: updateData,
    });

    return NextResponse.json(updatedLesson, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      {
        message: "Failed to update lesson",
        error: error instanceof Error ? error.message : error,
      },
      { status: 500 }
    );
  }
}
