import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET() {
    try {
        const lessons = await prisma.lesson.findMany({
            include: {
                subject: true,
                teacher: true,
                class: true,
            },
        });

        return NextResponse.json({ data: lessons }, { status: 200 });
    } catch (error) {
        console.error("Error fetching lessons:", error);
        return NextResponse.json(
            { message: "Internal Server Error" },
            { status: 500 }
        );
    }
}
