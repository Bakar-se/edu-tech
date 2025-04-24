import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
    try {
        const { searchParams } = new URL(req.url);
        const idParam = searchParams.get("id");

        if (!idParam) {
            return NextResponse.json(
                { message: "Missing assignment ID" },
                { status: 400 }
            );
        }

        const id = parseInt(idParam, 10);

        if (isNaN(id)) {
            return NextResponse.json(
                { message: "Invalid ID format" },
                { status: 400 }
            );
        }

        const assignment = await prisma.assignment.findUnique({
            where: { id },
        });

        if (!assignment) {
            return NextResponse.json(
                { message: "Assignment not found" },
                { status: 404 }
            );
        }

        return NextResponse.json(assignment, { status: 200 });
    } catch (error) {
        console.error("Error fetching assignment:", error);
        return NextResponse.json(
            { message: "Internal Server Error" },
            { status: 500 }
        );
    }
}
