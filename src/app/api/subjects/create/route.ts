import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { name, teacherIds, startTime, endTime } = body;

    // Basic validation
    if (!name || !teacherIds || teacherIds.length === 0 || !startTime || !endTime) {
      return NextResponse.json(
        { message: "Missing required fields: name, teacherIds, startTime, or endTime" },
        { status: 400 }
      );
    }

    // Create subject with multiple teachers
    const newSubject = await prisma.subject.create({
      data: {
        name,
        startTime: new Date(startTime) as Date,
        endTime: new Date(endTime) as Date,
        teachers: {
          connect: teacherIds.map((id: string) => ({ id })),
        },
      },
    });



    return NextResponse.json(newSubject, { status: 201 });
  } catch (error: any) {
    console.error("Error creating subject:", error);
    return NextResponse.json(
      { message: error.message || "Internal Server Error" },
      { status: 500 }
    );
  }
}
