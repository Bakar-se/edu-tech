import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { string } from "zod";

export async function PUT(
    req: NextRequest,
    { params }: { params: Promise<{ id: number }> }
) {
    try {
        const { id } = await params;
        const body = await req.json();
        const { name, startTime, endTime, subjectId, teacherId, day, classId } = body;

        const updatedLesson = await prisma.lesson.update({
            where: { id: id.toString() },  // Assuming toString() method extracts the string value
            data: {
                name,
                startTime: new Date(startTime), // Assuming startTime and endTime are in string format
                endTime: new Date(endTime),       // Convert these to Date objects if necessary
                subjectId: subjectId || null,
                teacherId: teacherId || null,
                day: day || null,
                classId: classId || null,
            },
        });

        return NextResponse.json({ data: updatedLesson }, { status: 200 });
    } catch (error) {
        console.error("Error updating lesson:", error);
        return NextResponse.json(
            { message: "Internal Server Error" },
            { status: 500 }
        );
    }
}
