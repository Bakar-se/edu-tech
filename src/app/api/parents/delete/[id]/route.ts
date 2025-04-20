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
            { success: false, message: "Parent ID is required" },
            { status: 400 }
        );
    }

    try {
        // Step 1: Find parent and get their Clerk user ID
        const parent = await prisma.parent.findUnique({
            where: { id },
        });

        if (!parent) {
            return NextResponse.json(
                { success: false, message: "Parent not found" },
                { status: 404 }
            );
        }

        const clerkUserId = parent.id; // Assuming your model stores Clerk ID here

        // Step 2: Delete user from Clerk (if exists)
        await users.deleteUser(clerkUserId);

        // Step 3: Delete from your local database
        await prisma.parent.delete({
            where: { id },
        });

        return NextResponse.json({
            success: true,
            message: "Parent deleted from Clerk and database",
        });
    } catch (error: any) {
        console.error("[DELETE_PARENT_ERROR]", error);

        return NextResponse.json(
            {
                success: false,
                message: error?.message || "Failed to delete parent",
            },
            { status: 500 }
        );
    }
}
