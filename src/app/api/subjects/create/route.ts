import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { z } from "zod";

// Schema for validating the incoming request data
const subjectSchema = z.object({
    name: z.string().min(3, "Subject name is required"), // Subject name validation
    teacherId: z.string().min(1, "Teacher ID is required"), // Teacher ID validation
});

export async function POST(req: Request) {
    try {
        const body = await req.json();

        // Validate the incoming request using the Zod schema
        const parsed = subjectSchema.parse(body);

        // Check if teacherId exists in the database
        const teacher = await prisma.teacher.findUnique({
            where: { id: parsed.teacherId },
        });

        if (!teacher) {
            return NextResponse.json(
                { error: "Teacher with this ID does not exist." },
                { status: 400 }
            );
        }

        // Create a new subject and link the teacher to it
        const newSubject = await prisma.subject.create({
            data: {
                name: parsed.name,
                teachers: {
                    connect: { id: parsed.teacherId },
                },
            },
            include: {
                teachers: true, // Include the teacher data in the response
            },
        });

        // Respond with success and the newly created subject
        return NextResponse.json(
            { message: "Subject created successfully", data: newSubject },
            { status: 201 }
        );
    } catch (error: any) {
        console.error(error);

        // Handle validation errors from Zod
        if (error instanceof z.ZodError) {
            return NextResponse.json(
                { error: "Validation error", details: error.errors },
                { status: 400 }
            );
        }

        // Generic error handling
        return NextResponse.json(
            { error: "Failed to create subject", message: error.message },
            { status: 500 }
        );
    }
}
