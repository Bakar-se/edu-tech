import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { z } from "zod";

// Zod validation schema
const schema = z.object({
    title: z.string().min(3).max(100),
    description: z.string().min(10).max(1000),
    date: z.string().refine((val) => !isNaN(Date.parse(val)), {
        message: "Invalid date format",
    }),
    classId: z.number().nullable().optional(),
});

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const data = schema.parse(body);

        const announcement = await prisma.announcement.create({
            data: {
                title: data.title,
                description: data.description,
                date: new Date(data.date),
                classId: data.classId ?? null,
            },
        });

        return NextResponse.json({ success: true, data: announcement }, { status: 201 });
    } catch (error: any) {
        console.error("[ANNOUNCEMENT_POST_ERROR]", error);
        return NextResponse.json(
            {
                success: false,
                message: error?.message || "Something went wrong",
            },
            { status: 500 }
        );
    }
}
