// File: /app/api/assignments/create/route.ts

import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { title, startDate, dueDate, lessonId } = body;

        // Basic validation
        if (!title || !startDate || !dueDate || !lessonId) {
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
                lessonId,
            },
        });

        return NextResponse.json(newAssignment, { status: 201 });
    } catch (error) {
        console.error("Error creating assignment:", error);
        return NextResponse.json(
            { message: "Internal Server Error" },
            { status: 500 }
        );
    }
}
