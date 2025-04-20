import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const { name, code, description, teacherId } = body;

        if (!name || !code || !teacherId) {
            return NextResponse.json(
                { success: false, message: "Name, code, and teacherId are required" },
                { status: 400 }
            );
        }

        // Optional: Check if the subject already exists
        const existingSubject = await prisma.subject.findFirst({
            where: {
                OR: [{ name }, { code }],
            },
        });

        if (existingSubject) {
            return NextResponse.json(
                { success: false, message: "Subject with this name or code already exists" },
                { status: 409 }
            );
        }

        const subject = await prisma.subject.create({
            data: {
                name,
                code,
                description,
                teacherId,
            },
        });

        return NextResponse.json({ success: true, data: subject }, { status: 201 });
    } catch (error: any) {
        console.error("[SUBJECT_POST_ERROR]", error);
        return NextResponse.json(
            { success: false, message: error?.message || "Failed to create subject" },
            { status: 500 }
        );
    }
}
