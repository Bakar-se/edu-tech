import { NextResponse } from "next/server";
import { v4 as uuidv4 } from "uuid";
import { writeFile } from "fs/promises";
import path from "path";
import prisma from "@/lib/prisma"; // Your Prisma client

export async function POST(req: Request) {
    try {
        const formData = await req.formData();

        const transactionId = formData.get("transactionId") as string;
        const billingId = formData.get("billingId") as string;
        const imageFile = formData.get("image") as File;

        if (!transactionId || !billingId || !imageFile) {
            return NextResponse.json(
                { message: "All fields are required" },
                { status: 400 }
            );
        }

        // Validate image type if needed
        const allowedTypes = ["image/png", "image/jpeg", "image/jpg"];
        if (!allowedTypes.includes(imageFile.type)) {
            return NextResponse.json(
                { message: "Unsupported image type" },
                { status: 400 }
            );
        }

        const bytes = await imageFile.arrayBuffer();
        const buffer = Buffer.from(bytes);

        const fileExt = path.extname(imageFile.name);
        const fileName = `${uuidv4()}${fileExt}`;
        const filePath = path.join(process.cwd(), "public", "uploads", fileName);

        await writeFile(filePath, buffer);

        const payment = await prisma.payment.create({
            data: {
                transactionId,
                billingId,
                image: `/uploads/${fileName}`, // public URL
            },
        });

        return NextResponse.json({ data: payment }, { status: 201 });
    } catch (err) {
        console.error("Create payment error:", err);
        return NextResponse.json(
            { message: "Failed to create payment" },
            { status: 500 }
        );
    }
}
