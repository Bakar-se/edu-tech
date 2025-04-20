import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET() {
    try {
        const parents = await prisma.parent.findMany({
            orderBy: { createdAt: "desc" },
            select: {
                id: true,
                username: true,
                name: true,
                surname: true,
                email: true,
                phone: true,
                address: true,
                occupation: true,
                relationship: true,
                sex: true,
                birthday: true,
                emergencyContact: true,
                nationality: true,
                bloodType: true,
                createdAt: true,
                updatedAt: true,
            },
        });
        console.log(parents)
        return NextResponse.json(
            { success: true, data: parents },
            { status: 200 }
        );
    } catch (error: any) {
        console.error("[GET_PARENTS_ERROR]", error);

        return NextResponse.json(
            {
                success: false,
                message: error?.message || "Failed to fetch parents",
            },
            { status: 500 }
        );
    }
}
