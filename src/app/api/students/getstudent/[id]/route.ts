import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    const { id } = await params;

    if (!id) {
        return NextResponse.json(
            { success: false, message: "Student ID is required" },
            { status: 400 }
        );
    }

    try {
        const student = await prisma.student.findUnique({
            where: { id },
            include: {
                class: true, // Optional: Include class data
                grade: true, // Optional: Include grade data
                parent: true, // Optional: Include parent data if required
            },
        });

        if (!student) {
            return NextResponse.json(
                { success: false, message: "Student not found" },
                { status: 404 }
            );
        }

        return NextResponse.json({ success: true, data: student });
    } catch (error: any) {
        console.error("[GET_STUDENT_BY_ID_ERROR]", error);
        return NextResponse.json(
            {
                success: false,
                message: error?.message || "Failed to fetch student",
            },
            { status: 500 }
        );
    }
}
