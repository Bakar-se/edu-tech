// /api/classes/getall/route.ts
import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET() {
    try {
        const results = await prisma.result.findMany({
            include: {
                student: true,
            },
        });
        return NextResponse.json({ data: results }, { status: 200 });
    } catch (error) {
        console.error("Error fetching results:", error);
        return NextResponse.json(
            { message: "Internal Server Error" },
            { status: 500 }
        );
    }
}
