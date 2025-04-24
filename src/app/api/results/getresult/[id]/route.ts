import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
    try {
        const { searchParams } = new URL(req.url);
        const resultId = searchParams.get("id"); // Get the 'id' from query params

        // Basic validation for ID
        if (!resultId) {
            return NextResponse.json(
                { message: "Missing required query parameter: id" },
                { status: 400 }
            );
        }

        // Fetch the specific result from the database by its ID
        const result = await prisma.result.findUnique({
            where: {
                id: Number(resultId), // Convert the ID to a number for querying
            },
        });

        // If the result is not found
        if (!result) {
            return NextResponse.json({ message: "Result not found" }, { status: 404 });
        }

        return NextResponse.json(result, { status: 200 });
    } catch (error) {
        console.error("Error fetching result:", error);
        return NextResponse.json(
            { message: "Internal Server Error" },
            { status: 500 }
        );
    }
}

