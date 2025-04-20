import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { users } from "@clerk/clerk-sdk-node";

// PUT /api/students/[id]
export async function PUT(
    req: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;

        if (!id) {
            return NextResponse.json(
                { success: false, message: "Student ID is required" },
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
            classId,
            gradeId,
            parentId,
        } = body;

        const existingStudent = await prisma.student.findUnique({ where: { id } });
        if (!existingStudent || !existingStudent.id) {
            return NextResponse.json(
                { success: false, message: "Student or Clerk user not found" },
                { status: 404 }
            );
        }

        const clerkUserId = existingStudent.id;

        // Unique email check (excluding current student)
        const existingEmail = await prisma.student.findFirst({
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

        // Unique phone check (excluding current student)
        const existingPhone = await prisma.student.findFirst({
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

        // Unique username check (excluding current student)
        const existingUsername = await prisma.student.findFirst({
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

        // Update the student
        const updatedStudent = await prisma.student.update({
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
                classId,
                gradeId,
                parentId,
                ...(password && { password }), // Only update if password is provided
            },
        });

        return NextResponse.json(
            { success: true, data: updatedStudent },
            { status: 200 }
        );
    } catch (error: any) {
        console.error("[UPDATE_STUDENT_ERROR]", error);
        return NextResponse.json(
            {
                success: false,
                message: error?.message || "Failed to update student",
            },
            { status: 500 }
        );
    }
}