// /api/classes/delete/[id]/route.ts
import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function DELETE(
    req: NextRequest,
    { params }: { params: Promise<{ id: number }> }
) {
    try {
        const { id } = await params;

        const deletedResult = await prisma.result.delete({
            where: { id: Number(id) },
        });

        return NextResponse.json({ data: deletedResult }, { status: 200 });
    } catch (error) {
        console.error("Error deleting result:", error);
        return NextResponse.json(
            { message: "Internal Server Error" },
            { status: 500 }
        );
    }
}
