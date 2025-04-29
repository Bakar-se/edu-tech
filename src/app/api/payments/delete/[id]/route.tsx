import { NextApiRequest, NextApiResponse } from "next";
import prisma from "@/lib/prisma";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== "DELETE") {
        return res.status(405).json({ message: "Method not allowed" });
    }

    const { id } = req.query;

    if (!id || typeof id !== "string") {
        return res.status(400).json({ message: "Invalid or missing payment ID" });
    }

    try {
        const payment = await prisma.payment.findUnique({ where: { id } });

        if (!payment) {
            return res.status(404).json({ message: "Payment not found" });
        }

        await prisma.payment.delete({ where: { id } });

        return res.status(200).json({ message: "Payment deleted successfully" });
    } catch (error) {
        console.error("Error deleting payment:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
}
