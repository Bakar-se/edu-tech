import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
    try {
        const lessons = await prisma.lesson.findMany({
            include: {
                subject: true,
                teacher: true,
                class: true,
            },
            orderBy: {
                startTime: "asc",
            },
        });

        return NextResponse.json(lessons, { status: 200 });
    } catch (error: any) {
        console.error("Error fetching subjects:", error);
        return NextResponse.json({ message: "Failed to fetch lessons", error }, { status: 500 });
    }
}
