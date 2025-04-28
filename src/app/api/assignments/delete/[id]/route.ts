// /api/classes/delete/[id]/route.ts
import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function DELETE(
    req: NextRequest,
    { params }: { params: Promise<{ id: number }> }
) {
    try {
        const { id } = await params;

        const deletedAssignment = await prisma.assignment.delete({
            where: { id: Number(id) },
        });

        return NextResponse.json({ data: deletedAssignment }, { status: 200 });
    } catch (error) {
        console.error("Error deleting assignment:", error);
        return NextResponse.json(
            { message: "Internal Server Error" },
            { status: 500 }
        );
    }
}
