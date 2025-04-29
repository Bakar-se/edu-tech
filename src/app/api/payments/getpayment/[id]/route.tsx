import { NextApiRequest, NextApiResponse } from "next";
import prisma from "@/lib/prisma";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== "GET") {
        return res.status(405).json({ message: "Method not allowed" });
    }

    const { id } = req.query;

    if (!id || typeof id !== "string") {
        return res.status(400).json({ message: "Invalid or missing ID" });
    }

    try {
        const payment = await prisma.payment.findUnique({
            where: { id },
            include: {
                billing: {
                    select: {
                        billName: true,
                        amount: true,
                        month: true,
                    },
                },
            },
        });

        if (!payment) {
            return res.status(404).json({ message: "Payment not found" });
        }

        res.status(200).json({
            message: "Payment fetched successfully",
            data: payment,
        });
    } catch (error) {
        console.error("Error fetching payment:", error);
        res.status(500).json({ message: "Internal server error" });
    }
}
