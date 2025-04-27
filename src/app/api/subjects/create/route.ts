import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { name, teacherId } = body;

        // Basic validation
        if (!name || !teacherId) {
            return NextResponse.json(
                { message: "Missing required fields: name or teacherId" },
                { status: 400 }
            );
        }

        // Create subject with teacher connection
        const newSubject = await prisma.subject.create({
            data: {
                name,
                teachers: {
                    connect: [{ id: teacherId }],
                },
            },
        });

        return NextResponse.json(newSubject, { status: 201 });
    } catch (error: any) {
        console.error("Error creating subject:", error);
        return NextResponse.json(
            { message: error.message || "Internal Server Error" },
            { status: 500 }
        );
    }
}