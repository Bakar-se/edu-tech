import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { users } from "@clerk/clerk-sdk-node";

export async function POST(req: Request) {
    try {
        const body = await req.json();

        const {
            title,
            description,
            startTime,
            endTime,
            classId,
        } = body;

        const role = "teacher";

        // Validate the incoming data
        if (!title || !description || !startTime || !endTime) {
            return NextResponse.json({ message: "All fields are required" }, { status: 400 });
        }

        const newEvent = await prisma.event.create({
            data: {
                title,
                description,
                startTime: new Date(startTime),
                endTime: new Date(endTime),
                classId: classId || null, // optional field
            },
        });
        return NextResponse.json({ message: "Event created successfully", data: newEvent }, { status: 201 });
    } catch (error) {
        console.error("Error creating event:", error);
        return NextResponse.json({
            success: false,
            message: (error as Error).message || "Something went wrong",
        }, { status: 500 });
    }
}