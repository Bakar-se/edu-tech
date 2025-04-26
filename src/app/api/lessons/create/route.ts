import prisma from "@/lib/prisma";
import { z } from "zod";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
    try {
        const body = await req.json();

        const { name, startTime, endTime, subjectId, teacherId, classId } = body;

        if (!name || !startTime) {
            return NextResponse.json(
                { message: "Missing required fields: name or startTime" },
                { status: 400 }
            );
        }

        const newLesson = await prisma.lesson.create({
            data: {
                name,
                startTime,
                endTime,
                subjectId,
                teacherId,
                classId,
            },
        });

        return NextResponse.json(newLesson, { status: 201 });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ message: "Failed to create lesson", error }, { status: 500 });
    }
}
