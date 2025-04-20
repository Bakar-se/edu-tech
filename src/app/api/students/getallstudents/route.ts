import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET() {
    try {
        const students = await prisma.student.findMany({
            orderBy: { createdAt: "desc" }, // Optional: newest first
            include: {
                class: true, // Include related class data
                grade: true, // Include related grade data
                parent: true, // Optional: include related parent data
            },
        });

        return NextResponse.json(
            { success: true, data: students },
            { status: 200 }
        );
    } catch (error: any) {
        console.error("[GET_STUDENTS_ERROR]", error);

        return NextResponse.json(
            {
                success: false,
                message: error?.message || "Failed to fetch students",
            },
            { status: 500 }
        );
    }
}
