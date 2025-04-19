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
      { success: false, message: "Teacher ID is required" },
      { status: 400 }
    );
  }

  try {
    // Step 1: Find teacher and get their Clerk user ID
    const teacher = await prisma.teacher.findUnique({
      where: { id },
    });

    if (!teacher) {
      return NextResponse.json(
        { success: false, message: "Teacher not found" },
        { status: 404 }
      );
    }

    const clerkUserId = teacher.id; // Assuming your model stores Clerk ID here

    // Step 2: Delete user from Clerk (if exists)
    await users.deleteUser(clerkUserId);

    // Step 3: Delete from your local database
    await prisma.teacher.delete({
      where: { id },
    });

    return NextResponse.json({
      success: true,
      message: "Teacher deleted from Clerk and database",
    });
  } catch (error: any) {
    console.error("[DELETE_TEACHER_ERROR]", error);

    return NextResponse.json(
      {
        success: false,
        message: error?.message || "Failed to delete teacher",
      },
      { status: 500 }
    );
  }
}
