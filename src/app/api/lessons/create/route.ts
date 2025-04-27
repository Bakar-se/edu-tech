import prisma from "@/lib/prisma";
import { z } from "zod";
import { NextResponse } from "next/server";

// Function to convert time to a Date object
function convertTimeToDate(time: string): Date {
  const date = new Date();
  const [hours, minutes] = time.split(":").map(Number);
  date.setHours(hours, minutes, 0, 0); // Set the time (hours, minutes, seconds, milliseconds)
  return date;
}

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const { startTime, endTime, subjectId, teacherId, classId } = body;
    console.log(body);

    if (!startTime || !endTime) {
      return NextResponse.json(
        { message: "Missing required fields: startTime or endTime" },
        { status: 400 }
      );
    }

    // Convert the time strings to Date objects
    const startDate = convertTimeToDate(startTime);
    const endDate = convertTimeToDate(endTime);

    const newLesson = await prisma.lesson.create({
      data: {
        startTime: startDate,
        endTime: endDate,
        subjectId,
        teacherId,
        classId,
      },
    });

    return NextResponse.json(newLesson, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { message: "Failed to create lesson", error },
      { status: 500 }
    );
  }
}
