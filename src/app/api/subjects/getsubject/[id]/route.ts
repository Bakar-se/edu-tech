import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(
    request: NextRequest,
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
        const subject = await prisma.subject.findUnique({
            where: { id: Number(id) },
            include: {
                teachers: true,
                lessons: true,
            },
        });

        if (!subject) {
            return NextResponse.json(
                { success: false, message: "Subject not found" },
                { status: 404 }
            );
        }

        return NextResponse.json({ success: true, data: subject }, { status: 200 });
    } catch (error: any) {
        console.error("[GET_SUBJECT_BY_ID_ERROR]", error);
        return NextResponse.json(
            {
                success: false,
                message: error?.message || "Failed to fetch subject",
            },
            { status: 500 }
        );
    }
}
