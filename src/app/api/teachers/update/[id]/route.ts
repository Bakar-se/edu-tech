import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { clerkClient } from "@clerk/nextjs/server";
import { users } from "@clerk/clerk-sdk-node";

// PUT /api/teachers/[id]
export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    if (!id) {
      return NextResponse.json(
        { success: false, message: "Teacher ID is required" },
        { status: 400 }
      );
    }

    const body = await req.json();
    const {
      firstname,
      lastname,
      email,
      phone,
      username,
      password,
      birthday,
      sex,
      bloodType,
    } = body;

    const existingTeacher = await prisma.teacher.findUnique({ where: { id } });
    if (!existingTeacher || !existingTeacher.id) {
      return NextResponse.json(
        { success: false, message: "Teacher or Clerk user not found" },
        { status: 404 }
      );
    }

    const clerkUserId = existingTeacher.id;

    // Unique email check (excluding current teacher)
    const existingEmail = await prisma.teacher.findFirst({
      where: {
        email,
        NOT: { id },
      },
    });

    if (existingEmail) {
      return NextResponse.json(
        { success: false, message: "Email already in use" },
        { status: 409 }
      );
    }

    // Unique phone check (excluding current teacher)
    const existingPhone = await prisma.teacher.findFirst({
      where: {
        phone,
        NOT: { id },
      },
    });

    if (existingPhone) {
      return NextResponse.json(
        { success: false, message: "Phone number already in use" },
        { status: 409 }
      );
    }

    // Unique username check (excluding current teacher)
    const existingUsername = await prisma.teacher.findFirst({
      where: {
        username,
        NOT: { id },
      },
    });

    if (existingUsername) {
      return NextResponse.json(
        { success: false, message: "Username already taken" },
        { status: 409 }
      );
    }

    // Optional: validate password (Clerk-style rules)
    if (password) {
      const passwordRegex = /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[\W_]).{8,}$/;
      if (!passwordRegex.test(password)) {
        return NextResponse.json(
          {
            success: false,
            message:
              "Password must be at least 8 characters long, and include uppercase, lowercase, number, and special character.",
          },
          { status: 400 }
        );
      }
    }

    await users.updateUser(clerkUserId, {
      emailAddress: email,
      username,
      ...(password && { password }),
    });

    // Update the teacher
    const updatedTeacher = await prisma.teacher.update({
      where: { id },
      data: {
        name: firstname,
        surname: lastname,
        email,
        phone,
        username,
        birthday: birthday ? new Date(birthday) : undefined,
        sex,
        bloodType,
        ...(password && { password }), // Only update if password is provided
      },
    });

    return NextResponse.json(
      { success: true, data: updatedTeacher },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("[UPDATE_TEACHER_ERROR]", error);
    return NextResponse.json(
      {
        success: false,
        message: error?.message || "Failed to update teacher",
      },
      { status: 500 }
    );
  }
}
