import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(req: Request) {
    try {
        // Fetch the list of teachers from the database
        const teachers = await prisma.teacher.findMany({
            select: {
                id: true,
                name: true,
                surname: true,
            },
        });

        return NextResponse.json({ data: teachers }, { status: 200 });
    } catch (error: any) {
        console.error("[TEACHER_POST_ERROR]", error);
        const message =
            error instanceof Error ? error.message : "Something went wrong";
        return NextResponse.json(
            {
                success: false,
                message: message,
            },
            { status: 500 }
        );
    }
}
