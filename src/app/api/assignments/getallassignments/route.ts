import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
    try {
        const assignments = await prisma.assignment.findMany({
            include: {
                lesson: true, // Include associated teachers
            },
        });
        console.log(assignments)
        return NextResponse.json(assignments, { status: 200 });
    } catch (error) {
        console.error("Error fetching assignments:", error);
        return NextResponse.json(
            { message: "Internal Server Error" },
            { status: 500 }
        );
    }
}
