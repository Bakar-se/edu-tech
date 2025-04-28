import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function PUT(req: Request) {
    try {
        const body = await req.json();
        const { id, studentId, examId, grade } = body;

        // Basic validation for required fields
        if (!id || !studentId || !examId || !grade) {
            return NextResponse.json(
                { message: "Missing required fields: id, studentId, examId/assignmentId, or grade" },
                { status: 400 }
            );
        }

        // Find the result by ID and update it
        const updatedResult = await prisma.result.update({
            where: {
                id: Number(id), // The ID should be passed and converted to a number
            },
            data: {
                studentId: studentId,
                examId: examId ?? null, // If no examId, set to null
                grade: grade,  // Keep grade as a string
            },
        });

        return NextResponse.json(updatedResult, { status: 200 });
    } catch (error) {
        console.error("Error updating result:", error);
        return NextResponse.json(

            { status: 500 }
        );
    }
}
