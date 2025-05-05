import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET() {
    try {
        const events = await prisma.event.findMany({
            orderBy: {
                startTime: "desc", // Sort by createdAt, assuming you've added it to the schema
            },
            include: {
                class: true, // Include related class data
            },
        });
        return NextResponse.json(
            { success: true, data: events },
            { status: 200 }
        );
    } catch (error: any) {
        console.error("[GET_EVENTS_ERROR]", error);

        return NextResponse.json(
            {
                success: false,
                message: error?.message || "Failed to fetch events",
            },
            { status: 500 }
        );
    }
}