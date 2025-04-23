import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(
    req: NextRequest,
    { params }: { params: Promise<{ id: number }> }
) {
    const { id } = await params;

    try {
        console.log(id);
        const lessonData = await prisma.lesson.findUnique({
            where: { id: Number(id) },
            include: {
                subject: true,
                teacher: true,
                class: true,
            },
        });

        if (!lessonData) {
            return NextResponse.json({ message: "Lesson not found" }, { status: 404 });
        }

        return NextResponse.json({ data: lessonData }, { status: 200 });
    } catch (error) {
        console.error("Error fetching lesson:", error);
        return NextResponse.json(
            { message: "Internal Server Error" },
            { status: 500 }
        );
    }
}
