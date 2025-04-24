import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
    try {
        const exams = await prisma.exam.findMany({

        });

        return NextResponse.json(exams, { status: 200 });
    } catch (error) {
        console.error("Error fetching exams:", error);
        return NextResponse.json(
            { message: "Internal Server Error" },
            { status: 500 }
        );
    }
}
