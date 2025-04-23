import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { name, startTime, endTime, subjectId, teacherId, day, classId } = body;

        console.log("Request body:", body); // Log incoming data for debugging

        // Basic validation with non-empty check
        if (!name || !startTime || !endTime || !subjectId || !teacherId || !classId ||
            name.trim() === "" || startTime.trim() === "" || endTime.trim() === "" ||
            subjectId.trim() === "" || teacherId.trim() === "" || classId.trim() === "") {
            return NextResponse.json(
                { message: "Missing or empty required fields, ensure all fields are provided." },
                { status: 400 }
            );
        }

        // Check if the subject, teacher, and class exist
        const subjectExists = await prisma.subject.findUnique({ where: { id: subjectId } });
        if (!subjectExists) {
            return NextResponse.json(
                { message: "Subject not found" },
                { status: 404 }
            );
        }

        const teacherExists = await prisma.teacher.findUnique({ where: { id: teacherId } });
        if (!teacherExists) {
            return NextResponse.json(
                { message: "Teacher not found" },
                { status: 404 }
            );
        }

        const classExists = await prisma.class.findUnique({ where: { id: classId } });
        if (!classExists) {
            return NextResponse.json(
                { message: "Class not found" },
                { status: 404 }
            );
        }

        // Validate DateTime fields
        const parsedStartTime = new Date(`1970-01-01T${startTime}:00`);
        const parsedEndTime = new Date(`1970-01-01T${endTime}:00`);

        if (isNaN(parsedStartTime.getTime()) || isNaN(parsedEndTime.getTime())) {
            return NextResponse.json(
                { message: "Invalid DateTime format" },
                { status: 400 }
            );
        }

        // Create the lesson
        const newLesson = await prisma.lesson.create({
            data: {
                name,
                day: day || undefined, // Handle optional day field
                startTime: parsedStartTime, // Ensure valid DateTime format
                endTime: parsedEndTime, // Ensure valid DateTime format
                subject: { connect: { id: subjectId } },
                teacher: { connect: { id: teacherId } },
                class: { connect: { id: classId } },
            },
        });

        return NextResponse.json(newLesson, { status: 201 });
    } catch (error: any) {
        console.error("Error creating lesson:", error);
        return NextResponse.json(
            { message: "Internal Server Error", error: error.message || "Unknown error" },
            { status: 500 }
        );
    }
}
