import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
    try {
        // Extract query parameters from the URL
        const { searchParams } = new URL(req.url);
        const resultId = searchParams.get("id");

        // Validate if 'id' parameter exists
        if (!resultId) {
            return NextResponse.json(
                { message: "Missing required query parameter: id" },
                { status: 400 }
            );
        }

        // Validate that 'id' is a valid number
        const parsedId = Number(resultId);
        if (isNaN(parsedId)) {
            return NextResponse.json(
                { message: "Invalid ID format. 'id' must be a number." },
                { status: 400 }
            );
        }

        // Fetch the specific result by ID
        const result = await prisma.result.findUnique({
            where: {
                id: parsedId,
            },
        });

        // If the result doesn't exist
        if (!result) {
            return NextResponse.json({ message: "Result not found" }, { status: 404 });
        }

        // Return the result if found
        return NextResponse.json(result, { status: 200 });
    } catch (error) {
        console.error("Error fetching result:", error);
        return NextResponse.json(
            { status: 500 }
        );
    }
}
