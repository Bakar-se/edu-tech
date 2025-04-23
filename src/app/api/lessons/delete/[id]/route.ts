import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function DELETE(
    req: NextRequest,
    { params }: { params: Promise<{ id: number }> }
) {
    try {
        const { id } = await params;

        const deletedLesson = await prisma.lesson.delete({
            where: { id: Number(id) },
        });

        return NextResponse.json({ data: deletedLesson }, { status: 200 });
    } catch (error) {
        console.error("Error deleting lesson:", error);
        return NextResponse.json(
            { message: "Internal Server Error" },
            { status: 500 }
        );
    }
}
