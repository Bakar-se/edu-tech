import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function PUT(req: Request) {
    try {
        const body = await req.json();
        const { id, title, startDate, dueDate, lessonId } = body;

        if (!id || !title || !startDate || !dueDate || !lessonId) {
            return NextResponse.json(
                { message: "Missing required fields" },
                { status: 400 }
            );
        }

        const updatedAssignment = await prisma.assignment.update({
            where: { id: Number(id) },
            data: {
                title,
                startDate: new Date(startDate),
                dueDate: new Date(dueDate),
                lessonId,
            },
        });

        return NextResponse.json(updatedAssignment, { status: 200 });
    } catch (error) {
        console.error("Error updating assignment:", error);
        return NextResponse.json(
            { message: "Internal Server Error" },
            { status: 500 }
        );
    }
}
