import { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from '@prisma/client';

// Initialize Prisma client
const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const { method } = req;
    const { id } = req.query;  // Get the announcement ID from the query parameters

    try {
        if (method === 'GET' && id) {
            // Fetch the announcement by ID
            const announcement = await prisma.announcement.findUnique({
                where: {
                    id: Number(id), // Convert the id to a number (it comes as a string from the URL)
                },
                include: {
                    // Include related models if needed, such as 'class' or any other related fields
                    class: true, // Assuming announcements are linked with a 'class' model
                },
            });

            if (!announcement) {
                return res.status(404).json({ message: 'Announcement not found' });
            }

            return res.status(200).json({ data: announcement });
        } else {
            // Method not allowed or missing ID
            return res.status(405).json({ message: 'Method Not Allowed or ID Missing' });
        }
    } catch (error) {
        console.error('Error fetching announcement:', error);
        return res.status(500).json({ message: 'Error fetching announcement', error: error instanceof Error ? error.message : 'Unknown error' });
    }
}
