import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { users } from "@clerk/clerk-sdk-node";

// PUT /api/parents/[id]
export async function PUT(
    req: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;

        if (!id) {
            return NextResponse.json(
                { success: false, message: "Parent ID is required" },
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
            relationship,
            birthday,
            password,
            emergencyContact,
            nationality,
            sex,
            bloodType,
            occupation,
            address,
        } = body;

        const existingParent = await prisma.parent.findUnique({ where: { id } });
        if (!existingParent || !existingParent.id) {
            return NextResponse.json(
                { success: false, message: "Parent or Clerk user not found" },
                { status: 404 }
            );
        }

        const clerkUserId = existingParent.id;

        // Unique email check (excluding current parent)
        const existingEmail = await prisma.parent.findFirst({
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

        // Unique phone check (excluding current parent)
        const existingPhone = await prisma.parent.findFirst({
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

        // Unique username check (excluding current parent)
        const existingUsername = await prisma.parent.findFirst({
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

        // Update the parent
        const updatedParent = await prisma.parent.update({
            where: { id },
            data: {
                name: firstname,
                surname: lastname,
                email,
                phone,
                username,
                address,
                occupation,
                relationship,
                emergencyContact,
                birthday: birthday ? new Date(birthday) : undefined,
                sex,
                bloodType,
                ...(password && { password }), // Only update if password is provided
            },
        });
        return NextResponse.json(
            { success: true, data: updatedParent },
            { status: 200 }
        );
    } catch (error: any) {
        console.error("[UPDATE_PARENT_ERROR]", error);
        return NextResponse.json(
            {
                success: false,
                message: error?.message || "Failed to update parent",
            },
            { status: 500 }
        );


    }
}
