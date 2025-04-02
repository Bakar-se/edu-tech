import prisma from "@/lib/prisma";
import { users } from "@clerk/clerk-sdk-node";
import axios from "axios";

const adminUsername = "admin";
const adminEmail = `${adminUsername}@example.com`;
const adminPassword = "@Graysclub10";

async function main() {
    // Step 1: Check if the admin user exists in Clerk
    const existingClerkUsers = await users.getUserList({
        emailAddress: [adminEmail],
    });

    let clerkUser;

    if (existingClerkUsers.length === 0) {
        // Create Clerk user with public metadata
        clerkUser = await users.createUser({
            username: adminUsername,
            password: adminPassword,
            emailAddress: [adminEmail],
            publicMetadata: { role: "admin" },
        });

        console.log("✅ Admin created in Clerk with metadata:", clerkUser.publicMetadata);
    } else {
        clerkUser = existingClerkUsers[0];
        console.log("⚠️ Admin already exists in Clerk");

        // Ensure metadata is set if the user already exists
        await users.updateUser(clerkUser.id, {
            publicMetadata: { role: "admin" },
        });

        console.log("✅ Updated Clerk user metadata to include role: admin");
    }

    // Step 2: Ensure admin exists in Postgres using Prisma
    const existingAdminByUsername = await prisma.admin.findUnique({
        where: { username: adminUsername },
    });

    if (existingAdminByUsername) {
        await prisma.admin.update({
            where: { username: adminUsername },
            data: { id: clerkUser.id },
        });

        console.log("✅ Existing admin updated with Clerk ID");
    } else {
        await prisma.admin.create({
            data: {
                id: clerkUser.id,
                username: adminUsername,
            },
        });

        console.log("✅ Admin created in Postgres");
    }
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
