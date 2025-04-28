import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { studentId, examId, grade } = body;

        // Validate required fields
        if (!studentId || !examId || !grade) {
            return NextResponse.json(
                { message: "Missing required fields: studentId, examId, and grade" },
                { status: 400 }
            );
        }

        // Create result in database
        const newResult = await prisma.result.create({
            data: {
                studentId,
                grade,
                examId: examId ? parseInt(examId) : null,
            },
        });
        console.log(newResult);

        return NextResponse.json(newResult, { status: 201 });
    } catch (error) {
        console.error("Error creating result:", error);
        return NextResponse.json(
            { message: "Internal Server Error" },
            { status: 500 }
        );
    }
}
