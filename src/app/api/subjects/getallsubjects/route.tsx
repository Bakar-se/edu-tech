import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET() {
    try {
        const subjects = await prisma.subject.findMany({
            orderBy: { id: "desc" }, // Optional: latest first
            include: {
                teachers: true, // include associated teachers
                lessons: true,  // include associated lessons
            },
        });

        return NextResponse.json(
            { success: true, data: subjects },
            { status: 200 }
        );
    } catch (error: any) {
        console.error("[GET_SUBJECTS_ERROR]", error);
        return NextResponse.json(
            {
                success: false,
                message: error?.message || "Failed to fetch subjects",
            },
            { status: 500 }
        );
    }
}
