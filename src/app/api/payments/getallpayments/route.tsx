import { NextApiRequest, NextApiResponse } from "next";
import prisma from "@/lib/prisma";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== "GET") {
        return res.status(405).json({ message: "Method not allowed" });
    }

    try {
        const payments = await prisma.payment.findMany({
            include: {
                billing: {
                    select: {
                        billName: true,
                        amount: true,
                        month: true,
                    },
                },
            },
            orderBy: {
                createdAt: "desc",
            },
        });

        res.status(200).json({
            message: "Payments fetched successfully",
            data: payments,
        });
    } catch (error) {
        console.error("Error fetching payments:", error);
        res.status(500).json({ message: "Internal server error" });
    }
}
