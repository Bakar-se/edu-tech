import { NextResponse } from "next/server";
import prisma from "@/lib/prisma"; // Assuming you have Prisma client set up in `lib/prisma.ts`

export async function GET() {
    try {
        // Fetch all billings, with optional class data if available
        const billings = await prisma.billing.findMany({
            include: {
                class: true, // Include class information in the response if needed
            },
        });
        return NextResponse.json({ data: billings }, { status: 200 });
    } catch (error) {
        console.error("Error fetching billings:", error);
        return NextResponse.json(
            { message: "Internal Server Error" },
            { status: 500 }
        );
    }
}
