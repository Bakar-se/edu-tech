import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";
import { string } from "zod";

export async function PUT(req: Request, { params }: { params: { id: string } }) {
    const { id } = params;

    try {
        // Parse the incoming data
        const body = await req.formData();
        const transactionId = body.get("transactionId") as string;
        const billingId = body.get("billingId") as string;
        const image = body.get("image") as File;

        // Validate fields
        if (!transactionId || !billingId || !image) {
            return NextResponse.json(
                { message: "Missing required fields" },
                { status: 400 }
            );
        }

        // Check if the payment exists
        const existingPayment = await prisma.payment.findUnique({
            where: { id: (id) },
        });

        if (!existingPayment) {
            return NextResponse.json({ message: "Payment not found" }, { status: 404 });
        }

        // Prepare the update data
        const updateData = {
            transactionId,
            billingId,
            image: image.name, // Save the image name or handle file upload appropriately
        };

        // Update the payment
        const updatedPayment = await prisma.payment.update({
            where: { id: (id) },
            data: updateData,
        });

        return NextResponse.json(updatedPayment, { status: 200 });
    } catch (error) {
        console.error("Error updating payment:", error);
        return NextResponse.json(
            { message: "Failed to update payment", error: error instanceof Error ? error.message : error },
            { status: 500 }
        );
    }
}
