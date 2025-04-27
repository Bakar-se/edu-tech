import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { title, startDate, dueDate, subjectId } = body;

        if (!title || !startDate || !dueDate || !subjectId) {
            return NextResponse.json(
                { message: "Missing required fields" },
                { status: 400 }
            );
        }

        const newAssignment = await prisma.assignment.create({
            data: {
                title,
                startDate: new Date(startDate),
                dueDate: new Date(dueDate),
                subject: {
                    connect: { id: subjectId },
                },
            },
        });
        console.log(arguments);
        return NextResponse.json(newAssignment, { status: 201 });
    } catch (error) {
        console.error("Error creating assignment:", error);
        return NextResponse.json(
            { message: "Internal Server Error" },
            { status: 500 }
        );
    }
}
