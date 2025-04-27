import prisma from "@/lib/prisma";
import { z } from "zod";
import { NextResponse } from "next/server";

export async function DELETE(req: Request) {
    try {
        const body = await req.json();

        const DeleteLessonSchema = z.object({
            id: z.string().uuid(), // Lesson id must be a UUID
        });

        const { id } = DeleteLessonSchema.parse(body);

        const deletedLesson = await prisma.lesson.delete({
            where: { id },
        });

        return NextResponse.json(deletedLesson, { status: 200 });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ message: "Failed to delete lesson", error }, { status: 500 });
    }
}
