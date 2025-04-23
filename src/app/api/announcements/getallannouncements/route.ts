import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET() {
    try {
        const announcements = await prisma.announcement.findMany({

            include: {
                class: true, // This should match the relation name in your schema
            },
        });

        return NextResponse.json(
            { success: true, data: announcements },
            { status: 200 }
        );
    } catch (error: any) {
        console.error("[GET_ANNOUNCEMENT_ERROR]", error);

        return NextResponse.json(
            {
                success: false,
                message: error?.message || "Failed to fetch announcements",
            },
            { status: 500 }
        );
    }
}