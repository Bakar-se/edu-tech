import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET() {
    try {
        const subjects = await prisma.subject.findMany({
            include: {
                teachers: true, // Include associated teachers
            },
        });

        return NextResponse.json(subjects, { status: 200 });
    } catch (error: any) {
        console.error("Error fetching subjects:", error);
        return NextResponse.json(
            { message: error.message || "Internal Server Error" },
            { status: 500 }
        );
    }
}
