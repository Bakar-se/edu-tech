import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    const { id } = await params;

    if (!id) {
        return NextResponse.json(
            { success: false, message: "Event ID is required" },
            { status: 400 }
        );
    }

    try {
        const event = await prisma.event.findUnique({
            where: { id: Number(id) }, // Make sure to convert `id` to a number
        });

        if (!event) {
            return NextResponse.json(
                { success: false, message: "Event not found" },
                { status: 404 }
            );
        }

        return NextResponse.json({ success: true, data: event });
    } catch (error: any) {
        console.error("[GET_EVENT_BY_ID_ERROR]", error);
        return NextResponse.json(
            {
                success: false,
                message: error?.message || "Failed to fetch event",
            },
            { status: 500 }
        );
    }
}
