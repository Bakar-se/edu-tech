import { NextApiRequest, NextApiResponse } from "next";
import prisma from "@/lib/prisma"; // Assuming you have Prisma client set up in `lib/prisma.ts`

const getBilling = async (req: NextApiRequest, res: NextApiResponse) => {
    const { id } = req.query; // Extract `id` from query parameters

    if (!id || typeof id !== 'string') {
        return res.status(400).json({ message: "Invalid or missing billing ID" });
    }

    try {
        // Fetch a specific billing by its ID, including class data if needed
        const billing = await prisma.billing.findUnique({
            where: { id: id }, // Find billing by ID
            include: {
                class: true, // Optionally include related class data
            },
        });

        if (!billing) {
            return res.status(404).json({ message: "Billing not found" });
        }

        // Return the billing data
        res.status(200).json({ data: billing });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Failed to fetch billing data" });
    }
};

export default getBilling;
