import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { studentId, examName, assignmentName, score } = body;

        // Basic validation
        if (!studentId || !examName || !score) {
            return NextResponse.json(
                { message: "Missing required fields: studentId, examName, or score" },
                { status: 400 }
            );
        }

        // Create the result in the database
        const newResult = await prisma.result.create({
            data: {
                studentId: studentId,
                examId: examName,
                score: Number(score),
            },
        });

        return NextResponse.json(newResult, { status: 201 });
    } catch (error) {
        console.error("Error creating result:", error);
        return NextResponse.json(
            { message: "Internal Server Error" },
            { status: 500 }
        );
    }
}
