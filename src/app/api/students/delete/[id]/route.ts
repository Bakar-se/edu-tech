import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { users } from "@clerk/clerk-sdk-node";

const CLERK_SECRET_KEY = process.env.CLERK_SECRET_KEY!;

type RouteContext = {
    params: {
        id: string;
    };
};

export async function DELETE(
    req: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    const { id } = await params;

    if (!id) {
        return NextResponse.json(
            { success: false, message: "Student ID is required" },
            { status: 400 }
        );
    }

    try {
        // Step 1: Find student and get their Clerk user ID
        const student = await prisma.student.findUnique({
            where: { id },
        });

        if (!student) {
            return NextResponse.json(
                { success: false, message: "Student not found" },
                { status: 404 }
            );
        }

        const clerkUserId = student.id; // Assuming your model stores Clerk ID here

        // Step 2: Delete user from Clerk (if exists)
        await users.deleteUser(clerkUserId);

        // Step 3: Delete from your local database
        await prisma.student.delete({
            where: { id },
        });

        return NextResponse.json({
            success: true,
            message: "Student deleted from Clerk and database",
        });
    } catch (error: any) {
        console.error("[DELETE_STUDENT_ERROR]", error);

        return NextResponse.json(
            {
                success: false,
                message: error?.message || "Failed to delete student",
            },
            { status: 500 }
        );
    }
}
