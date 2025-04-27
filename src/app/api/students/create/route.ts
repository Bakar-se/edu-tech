import prisma from "@/lib/prisma";
import { users } from "@clerk/clerk-sdk-node";
import { NextResponse } from "next/server";

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

        // Basic validation
        if (!username || !email || !password || !firstname || !lastname || !birthday || !parentId) {
            return NextResponse.json(
                { message: "Missing required fields." },
                { status: 400 }
            );
        }

        const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^a-zA-Z0-9]).{8,}$/;
        if (!passwordRegex.test(password)) {
            return NextResponse.json(
                { message: "Password must be at least 8 characters long and include at least one lowercase letter, one uppercase letter, one number, and one special character." },
                { status: 400 }
            );
        }

        // Check if student already exists
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
                { message: "Student with same username, email, or phone already exists." },
                { status: 409 }
            );
        }

        // Check if parent exists
        const parentExists = await prisma.parent.findUnique({
            where: { id: parentId },
        });

        if (!parentExists) {
            return NextResponse.json(
                { message: "Parent not found with the given ID." },
                { status: 404 }
            );
        }

        // Create or get Clerk user
        let clerkUser;
        const existingClerkUsers = await users.getUserList({ emailAddress: email });

        if (existingClerkUsers.length === 0) {
            clerkUser = await users.createUser({
                username,
                password,
                emailAddress: [email],
                publicMetadata: { role },
            });
            console.log("✅ Clerk user created:", clerkUser.id);
        } else {
            clerkUser = existingClerkUsers[0];
            await users.updateUser(clerkUser.id, {
                publicMetadata: { role },
            });
            console.log("⚠️ Clerk user already existed. Metadata updated.");
        }

        // Parse birthday
        const parsedBirthday = new Date(birthday);
        if (isNaN(parsedBirthday.getTime())) {
            return NextResponse.json(
                { message: "Invalid birthday format." },
                { status: 400 }
            );
        }

        // Create student in database
        const newStudent = await prisma.student.create({
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
                classId: classId || null,
                gradeId: gradeId || null,
            },
        });

        return NextResponse.json(newStudent, { status: 201 });

    } catch (error: any) {
        console.error("Error creating student:", error);
        return NextResponse.json(
            { message: error?.message || "Internal Server Error" },
            { status: 500 }
        );
    }
}
