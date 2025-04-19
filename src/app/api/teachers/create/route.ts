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
    } = body;

    const role = "teacher";

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

    // ✅ Unique field checks in Prisma
    const existingTeacher = await prisma.teacher.findFirst({
      where: {
        OR: [
          { username },
          { email: email ?? undefined },
          { phone: phone ?? undefined },
        ],
      },
    });

    if (existingTeacher) {
      return NextResponse.json(
        {
          success: false,
          message:
            "A teacher with the same username, email, or phone already exists.",
        },
        { status: 409 }
      );
    }

    // ✅ Check Clerk for existing user
    const existingClerkUsers = await users.getUserList({
      emailAddress: [email],
    });
    let clerkUser;

    if (existingClerkUsers.length === 0) {
      clerkUser = await users.createUser({
        username,
        password,
        emailAddress: [email],
        publicMetadata: { role },
      });

      console.log(
        "✅ Teacher created in Clerk with metadata:",
        clerkUser.publicMetadata
      );
    } else {
      clerkUser = existingClerkUsers[0];
      console.log("⚠️ Teacher already exists in Clerk");

      // Optional: update metadata
      await users.updateUser(clerkUser.id, {
        publicMetadata: { role },
      });

      console.log("✅ Updated Clerk user metadata to include role: teacher");
    }

    // ✅ Create teacher in DB
    const teacher = await prisma.teacher.create({
      data: {
        id: clerkUser.id,
        username,
        email,
        phone,
        address,
        birthday: new Date(birthday),
        sex: sex as any,
        bloodType,
        name: firstname,
        surname: lastname,
        password,
      },
    });

    return NextResponse.json({ success: true, data: teacher }, { status: 201 });
  } catch (error: any) {
    console.error("[TEACHER_POST_ERROR]", error);
    return NextResponse.json(
      {
        success: false,
        message: error?.message || "Something went wrong",
      },
      { status: 500 }
    );
  }
}
