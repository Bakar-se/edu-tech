import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function PUT(req: Request) {
    try {
        const body = await req.json();
        const { id, studentId, examName, assignmentName, score } = body;

        // Basic validation for required fields
        if (!id || !studentId || !examName || !score) {
            return NextResponse.json(
                { message: "Missing required fields: id, studentId, examName, or score" },
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
                exam: examName,
                assignment: assignmentName || null,  // Optional field
                score: Number(score),  // Ensure score is a number
            },
        });

        return NextResponse.json(updatedResult, { status: 200 });
    } catch (error) {
        console.error("Error updating result:", error);
        return NextResponse.json(
            { message: "Internal Server Error" },
            { status: 500 }
        );
    }
}
