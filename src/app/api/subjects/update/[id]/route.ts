import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function PUT(
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
        const body = await req.json();
        const { name } = body;

        if (!name || name.trim() === "") {
            return NextResponse.json(
                { success: false, message: "Subject name is required" },
                { status: 400 }
            );
        }

        // Check if the new name already exists (excluding current subject)
        const existing = await prisma.subject.findFirst({
            where: {
                name,
                NOT: { id: Number(id) },
            },
        });

        if (existing) {
            return NextResponse.json(
                { success: false, message: "Subject name already exists" },
                { status: 409 }
            );
        }

        const updatedSubject = await prisma.subject.update({
            where: { id: Number(id) },
            data: { name },
        });

        return NextResponse.json(
            { success: true, data: updatedSubject },
            { status: 200 }
        );
    } catch (error: any) {
        console.error("[UPDATE_SUBJECT_ERROR]", error);
        return NextResponse.json(
            {
                success: false,
                message: error?.message || "Failed to update subject",
            },
            { status: 500 }
        );
    }
}
