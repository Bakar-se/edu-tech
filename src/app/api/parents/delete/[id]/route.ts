import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function DELETE(
    req: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;

        const deletedParent = await prisma.parent.delete({
            where: { id },
        });

        return NextResponse.json(deletedParent, { status: 200 });
    } catch (error) {
        console.error(error);
        return NextResponse.json(
            { message: "Failed to delete parent", error },
            { status: 500 }
        );
    }
}
