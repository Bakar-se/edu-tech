import { NextApiRequest, NextApiResponse } from "next";
import prisma from "@/lib/prisma";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const { method } = req;
    const { id } = req.query;

    if (!id || typeof id !== "string") {
        return res.status(400).json({ message: "Invalid billing ID" });
    }

    if (method === "DELETE") {
        try {
            // Delete the billing record from the database using Prisma
            const deletedBilling = await prisma.billing.delete({
                where: { id },
            });

            return res.status(200).json({
                message: "Billing record deleted successfully",
                data: deletedBilling,
            });
        } catch (error) {
            console.error(error);
            return res.status(500).json({ message: "Failed to delete billing record" });
        }
    } else {
        // Method Not Allowed
        return res.status(405).json({ message: `Method ${method} Not Allowed` });
    }
}
