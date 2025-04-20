import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { users } from "@clerk/clerk-sdk-node";

export async function POST(req: Request) {
    try {
        const body = await req.json();

        const {
            username,
            email,
            password,
            firstname,
            lastname,
            phone,
            address,
            birthday,
            sex,
            bloodType,
            classId,
            gradeId,
            parentId,
        } = body;

        const role = "student";

        // ✅ Validate password
        const passwordRegex =
            /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^a-zA-Z0-9]).{8,}$/;
        if (!passwordRegex.test(password)) {
            return NextResponse.json(
                {
                    success: false,
                    message:
                        "Password must be at least 8 characters long and include at least one lowercase letter, one uppercase letter, one number, and one special character.",
                },
                { status: 400 }
            );
        }

        // ✅ Check for existing student
        const existingStudent = await prisma.student.findFirst({
            where: {
                OR: [
                    { username },
                    { email: email ?? undefined },
                    { phone: phone ?? undefined },
                ],
            },
        });

        if (existingStudent) {
            return NextResponse.json(
                {
                    success: false,
                    message:
                        "A student with the same username, email, or phone already exists.",
                },
                { status: 409 }
            );
        }

        // ✅ Check if parent ID exists
        if (!parentId) {
            return NextResponse.json(
                {
                    success: false,
                    message: "Parent ID is required.",
                },
                { status: 400 }
            );
        }

        const parentExists = await prisma.parent.findUnique({
            where: { id: parentId },
        });

        if (!parentExists) {
            return NextResponse.json(
                {
                    success: false,
                    message: "Parent not found with the given ID.",
                },
                { status: 404 }
            );
        }

        // ✅ Create or fetch Clerk user
        const existingClerkUsers = await users.getUserList({
            emailAddress: email,
        });

        let clerkUser;

        if (existingClerkUsers.length === 0) {
            clerkUser = await users.createUser({
                username,
                password,
                emailAddress: [email],
                publicMetadata: { role },
            });

            console.log("✅ Student created in Clerk:", clerkUser.id);
        } else {
            clerkUser = existingClerkUsers[0];
            console.log("⚠️ Student already exists in Clerk");

            await users.updateUser(clerkUser.id, {
                publicMetadata: { role },
            });

            console.log("✅ Updated Clerk user metadata to include role: student");
        }

        // ✅ Parse birthday
        const parsedBirthday = new Date(birthday);
        if (isNaN(parsedBirthday.getTime())) {
            return NextResponse.json(
                {
                    success: false,
                    message: "Invalid birthday format.",
                },
                { status: 400 }
            );
        }

        // ✅ Create student record in the DB
        const student = await prisma.student.create({
            data: {
                id: clerkUser.id,
                username,
                email,
                phone,
                address,
                birthday: parsedBirthday,
                sex,
                bloodType,
                name: firstname,
                surname: lastname,
                password,
                parentId,
                classId,
                gradeId,
            },
        });

        return NextResponse.json({ success: true, data: student }, { status: 201 });
    } catch (error: any) {
        console.error("[STUDENT_POST_ERROR]", error);
        return NextResponse.json(
            {
                success: false,
                message: error?.message || "Something went wrong",
            },
            { status: 500 }
        );
    }
}
