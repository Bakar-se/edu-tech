import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function DELETE(
    req: NextRequest,
    { params }: { params: { id: string } }
) {
    const { id } = params;

    if (!id) {
        return NextResponse.json(
            { success: false, message: "Subject ID is required" },
            { status: 400 }
        );
    }

    try {
        const existingSubject = await prisma.subject.findUnique({ where: { id } });

        if (!existingSubject) {
            return NextResponse.json(
                { success: false, message: "Subject not found" },
                { status: 404 }
            );
        }

        await prisma.subject.delete({ where: { id } });

        return NextResponse.json({
            success: true,
            message: "Subject deleted successfully",
        });
    } catch (error: any) {
        console.error("[SUBJECT_DELETE_ERROR]", error);
        return NextResponse.json(
            { success: false, message: error?.message || "Failed to delete subject" },
            { status: 500 }
        );
    }
}
