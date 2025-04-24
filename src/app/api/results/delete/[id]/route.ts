import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function DELETE(req: Request) {
    try {
        const { searchParams } = new URL(req.url);
        const id = searchParams.get("id");

        // Basic validation
        if (!id) {
            return NextResponse.json(
                { message: "Missing required parameter: id" },
                { status: 400 }
            );
        }

        // Delete the result from the database
        const deletedResult = await prisma.result.delete({
            where: { id: Number(id) },
        });

        return NextResponse.json(deletedResult, { status: 200 });
    } catch (error) {
        console.error("Error deleting result:", error);
        return NextResponse.json(
            { message: "Internal Server Error" },
            { status: 500 }
        );
    }
}
