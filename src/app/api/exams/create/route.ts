import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { title, startTime, endTime, lessonId } = body;

        // Basic validation
        if (!title || !startTime || !endTime || !lessonId) {
            return NextResponse.json(
                { message: "Missing required fields" },
                { status: 400 }
            );
        }

        const newExam = await prisma.exam.create({
            data: {
                title,
                startTime: new Date(startTime),
                endTime: new Date(endTime),
                lessonId,
            },
        });

        return NextResponse.json(newExam, { status: 201 });
    } catch (error) {
        console.error("Error creating exam:", error);
        return NextResponse.json(
            { message: "Internal Server Error" },
            { status: 500 }
        );
    }
}
