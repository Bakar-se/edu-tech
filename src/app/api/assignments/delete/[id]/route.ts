import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function DELETE(req: Request) {
    try {
        const url = new URL(req.url);
        const idParam = url.searchParams.get("id");

        if (!idParam) {
            return NextResponse.json(
                { message: "Missing assignment ID" },
                { status: 400 }
            );
        }

        const id = Number(idParam);
        if (isNaN(id)) {
            return NextResponse.json(
                { message: "Invalid assignment ID" },
                { status: 400 }
            );
        }

        const deletedAssignment = await prisma.assignment.delete({
            where: { id },
        });

        return NextResponse.json(deletedAssignment, { status: 200 });
    } catch (error) {
        console.error("Error deleting assignment:", error);
        return NextResponse.json(
            { message: "Internal Server Error" },
            { status: 500 }
        );
    }
}
