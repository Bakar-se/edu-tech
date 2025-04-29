import { NextApiRequest, NextApiResponse } from "next";
import prisma from "@/lib/prisma";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const { id } = req.query;

    if (req.method !== "PUT") {
        return res.status(405).json({ message: "Method not allowed" });
    }

    if (!id || typeof id !== "string") {
        return res.status(400).json({ message: "Invalid or missing billing ID" });
    }

    const {
        billName,
        month,
        amount,
        dueDate,
        description,
        classId,
    } = req.body;

    if (
        !billName ||
        !month ||
        !amount ||
        !dueDate ||
        !description
    ) {
        return res.status(400).json({ message: "Missing required fields" });
    }

    try {
        const updatedBilling = await prisma.billing.update({
            where: { id: id },
            data: {
                billName,
                month,
                amount: parseFloat(amount),
                dueDate: new Date(dueDate),
                description,
                classId: classId ? Number(classId) : null,
            },
        });

        res.status(200).json({ message: "Billing updated successfully", data: updatedBilling });
    } catch (error) {
        console.error("Update billing error:", error);
        res.status(500).json({ message: "Failed to update billing" });
    }
}
