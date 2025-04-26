import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function PUT(request: Request, { params }: { params: { id: string } }) {
    const { id } = params;
    const data = await request.json();

    try {
        // Check if the lesson exists
        const existingLesson = await prisma.lesson.findUnique({
            where: { id },
        });

        if (!existingLesson) {
            return NextResponse.json({ message: "Lesson not found" }, { status: 404 });
        }

        // Update the lesson
        const updatedLesson = await prisma.lesson.update({
            where: { id },
            data: {
                name: data.name ?? existingLesson.name,
                startTime: data.startTime ?? existingLesson.startTime,
                endTime: data.endTime ?? existingLesson.endTime,
                day: data.day ?? existingLesson.day,
                subjectId: data.subjectId ?? existingLesson.subjectId,
                teacherId: data.teacherId ?? existingLesson.teacherId,
                classId: data.classId ?? existingLesson.classId,
            },
        });

        return NextResponse.json(updatedLesson, { status: 200 });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ message: "Failed to update lesson", error }, { status: 500 });
    }
}
