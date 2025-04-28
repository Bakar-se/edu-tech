import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

interface Params {
    id: string;
}

export async function DELETE(req: Request, { params }: { params: Params }) {
    try {
        const { id } = params;

        const deletedLesson = await prisma.lesson.delete({
            where: { id },
        });

        return NextResponse.json(deletedLesson, { status: 200 });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ message: "Failed to delete lesson", error }, { status: 500 });
    }
}
