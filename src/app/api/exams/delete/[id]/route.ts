import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function DELETE(req: Request) {
    try {
        const body = await req.json();
        const { examId } = body;

        if (!examId) {
            return NextResponse.json(
                { message: "Missing required field: examId" },
                { status: 400 }
            );
        }

        await prisma.exam.delete({
            where: {
                id: examId,
            },
        });

        return NextResponse.json(
            { message: "Exam deleted successfully" },
            { status: 200 }
        );
    } catch (error) {
        console.error("Error deleting exam:", error);
        return NextResponse.json(
            { message: "Internal Server Error" },
            { status: 500 }
        );
    }
}
