import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { billName, month, amount, dueDate, description, classId } = body;

        // Basic validation
        if (!billName || !month || !amount || !dueDate || !description) {
            return NextResponse.json(
                { message: "Missing required fields" },
                { status: 400 }
            );
        }

        const newBilling = await prisma.billing.create({
            data: {
                billName,
                month,
                amount: Number(amount),
                dueDate: new Date(dueDate),
                description,
                classId: classId === 0 ? null : classId || null,
            },
        });

        return NextResponse.json(newBilling, { status: 201 });
    } catch (error) {
        console.error("Error creating billing:", error);
        return NextResponse.json(
            { message: "Internal Server Error" },
            { status: 500 }
        );
    }
}
