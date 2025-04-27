import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(request: Request, { params }: { params: { id: string } }) {
    const { id } = params;

    try {
        const lesson = await prisma.lesson.findUnique({
            where: { id },
            include: {
                subject: true,
                teacher: true,
                class: true,
            },
        });

        if (!lesson) {
            return NextResponse.json({ message: "Lesson not found" }, { status: 404 });
        }

        return NextResponse.json(lesson, { status: 200 });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ message: "Failed to fetch lesson", error }, { status: 500 });
    }
}
