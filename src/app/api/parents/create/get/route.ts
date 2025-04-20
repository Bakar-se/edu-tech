import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

// GET /api/parents/[id]
export async function GET(
    req: Request,
    { params }: { params: { id: string } }
) {
    try {
        const parentId = params.id;

        if (!parentId) {
            return NextResponse.json(
                { success: false, message: "Parent ID is required." },
                { status: 400 }
            );
        }

        const parent = await prisma.parent.findUnique({
            where: {
                id: parentId,
            },
        });

        if (!parent) {
            return NextResponse.json(
                { success: false, message: "Parent not found." },
                { status: 404 }
            );
        }

        return NextResponse.json({ success: true, data: parent });
    } catch (error) {
        console.error("[PARENT_GET_ERROR]", error);
        return NextResponse.json(
            { success: false, message: "Something went wrong." },
            { status: 500 }
        );
    }
}
