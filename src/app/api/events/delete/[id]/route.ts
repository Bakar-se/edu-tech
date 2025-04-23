import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function DELETE(
    req: NextRequest,
    { params }: { params: { id: string } }
) {
    const id = parseInt(params.id);

    if (isNaN(id)) {
        return NextResponse.json(
            { success: false, message: "Event ID is required" },
            { status: 400 }
        );
    }

    try {
        const event = await prisma.event.findUnique({
            where: { id },
        });

        if (!event) {
            return NextResponse.json(
                { success: false, message: "Event not found" },
                { status: 404 }
            );
        }

        await prisma.event.delete({
            where: { id },
        });

        return NextResponse.json(
            { success: true, message: "Event deleted successfully" },
            { status: 200 }
        );
    } catch (error: unknown) {
        const err = error as Error;
        return NextResponse.json(
            { success: false, message: err.message || "Something went wrong" },
            { status: 500 }
        );
    }
}
