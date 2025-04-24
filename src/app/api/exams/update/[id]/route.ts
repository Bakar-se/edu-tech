import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function PUT(
    req: Request,
    { params }: { params: { id: string } }
) {
    try {
        const { id } = params;
        const body = await req.json();
        const { title, startTime, endTime, lessonId } = body;

        // Validate required fields
        if (!title || !startTime || !endTime || !lessonId) {
            return NextResponse.json(
                { message: "Missing required fields: title, startTime, endTime, or lessonId" },
                { status: 400 }
            );
        }

        // Update exam details
        const updatedExam = await prisma.exam.update({
            where: {
                id: parseInt(id), // Use the provided ID for updating
            },
            data: {
                title,
                startTime: new Date(startTime), // Ensure startTime is in correct Date format
                endTime: new Date(endTime),     // Ensure endTime is in correct Date format
                lessonId,
            },
        });

        return NextResponse.json(updatedExam, { status: 200 });
    } catch (error) {
        console.error("Error updating exam:", error);
        return NextResponse.json(
            { message: "Internal Server Error" },
            { status: 500 }
        );
    }
}
