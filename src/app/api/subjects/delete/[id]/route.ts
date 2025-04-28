// /api/classes/delete/[id]/route.ts
import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function DELETE(
    req: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;

        const deletedExam = await prisma.exam.delete({
            where: { id: Number(id) },
        });

        return NextResponse.json({ data: deletedExam }, { status: 200 });
    } catch (error) {
        console.error("Error deleting exam:", error);
        return NextResponse.json(
            { message: "Internal Server Error" },
            { status: 500 }
        );
    }
}
