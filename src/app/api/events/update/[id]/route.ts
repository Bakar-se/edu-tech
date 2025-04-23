import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

// PUT /api/events/[id]
export async function PUT(
    req: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;

        if (!id) {
            return NextResponse.json(
                { success: false, message: "Event ID is required" },
                { status: 400 }
            );
        }

        const body = await req.json();
        const { title, description, startTime, endTime, classId } = body;

        // Check if the event exists
        const existingEvent = await prisma.event.findUnique({
            where: { id: Number(id) },
        });

        if (!existingEvent) {
            return NextResponse.json(
                { success: false, message: "Event not found" },
                { status: 404 }
            );
        }

        // Update the event
        const updatedEvent = await prisma.event.update({
            where: { id: Number(id) },
            data: {
                title,
                description,
                startTime: new Date(startTime),
                endTime: new Date(endTime),
                classId: classId ? Number(classId) : null, // If classId is provided
            },
        });

        return NextResponse.json(
            { success: true, data: updatedEvent },
            { status: 200 }
        );
    } catch (error: any) {
        console.error("[UPDATE_EVENT_ERROR]", error);
        return NextResponse.json(
            {
                success: false,
                message: error?.message || "Failed to update event",
            },
            { status: 500 }
        );
    }
}
