import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { users } from "@clerk/clerk-sdk-node";
import { string } from "zod";

export async function POST(req: Request) {
    try {
        const body = await req.json();

        // Destructure fields from the request body
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
            occupation,
            relationship,
            emergencyContact,
            nationality,
        } = body;

        const role = "parent";  // Role is set as "parent"

        // ✅ Password validation (based on Clerk requirements)
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

        // ✅ Unique field checks in Prisma (make sure the parent isn't already registered)
        const existingParent = await prisma.parent.findFirst({
            where: {
                OR: [
                    { username },
                    { email: email ?? undefined },
                    { phone: phone ?? undefined },
                ],
            },
        });

        if (existingParent) {
            return NextResponse.json(
                {
                    success: false,
                    message:
                        "A parent with the same username, email, or phone already exists.",
                },
                { status: 409 }
            );
        }

        // ✅ Check Clerk for existing user
        const existingClerkUsers = await users.getUserList({
            emailAddress: [email],
        });
        let clerkUser;

        // If no user exists in Clerk, create one
        if (existingClerkUsers.length === 0) {
            clerkUser = await users.createUser({
                username,
                password,
                emailAddress: [email],
                publicMetadata: { role },
            });

            console.log(
                "✅ Parent created in Clerk with metadata:",
                clerkUser.publicMetadata
            );
        } else {
            clerkUser = existingClerkUsers[0];
            console.log("⚠️ Parent already exists in Clerk");

            // Optional: update metadata
            await users.updateUser(clerkUser.id, {
                publicMetadata: { role },
            });

            console.log("✅ Updated Clerk user metadata to include role: parent");
        }

        // ✅ Ensure the birthday is correctly formatted and converted to a Date object
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


        // ✅ Create parent in the DB (use the Clerk user ID and related fields)
        const parent = await prisma.parent.create({
            data: {
                id: clerkUser.id,  // Linking the parent to the Clerk user ID
                username,
                email,
                phone,
                address,
                birthday: new Date(birthday),
                sex,
                bloodType,
                occupation,
                emergencyContact,
                nationality,
                name: firstname,
                surname: lastname,
                password,
                relationship,
            },
        }

        );


        return NextResponse.json({ success: true, data: parent }, { status: 201 });
    } catch (error: any) {
        console.error("[PARENT_POST_ERROR]", error);
        return NextResponse.json(
            {
                success: false,
                message: error?.message || "Something went wrong",
            },
            { status: 500 }
        );
    }
}
