import prisma from "@/lib/prisma"; // or wherever your prisma client is
import { NextResponse } from "next/server";

export async function GET() {
    try {
        const results = await prisma.result.findMany({
            select: {
                id: true,
                score: true,
                student: {
                    select: {
                        id: true,
                        name: true,
                    },
                },
                exam: {
                    select: {
                        id: true,
                        title: true,
                    },
                },
            },
        });

        return NextResponse.json({ data: results }, { status: 200 });
    } catch (error: any) {
        return NextResponse.json(
            { message: "Failed to fetch results", error: error.message },
            { status: 500 }
        );
    }
}
