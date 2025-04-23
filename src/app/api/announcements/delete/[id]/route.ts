import { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from '@prisma/client';

// Initialize Prisma client
const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const { method } = req;
    const { id } = req.query; // Get the announcement ID from the URL params

    if (!id || typeof id !== 'string') {
        return res.status(400).json({ message: 'Invalid ID' });
    }

    try {
        if (method === 'DELETE') {
            // Delete the announcement by ID
            const announcement = await prisma.announcement.delete({
                where: { id: parseInt(id) }, // Convert the ID to an integer
            });

            return res.status(200).json({ message: 'Announcement deleted successfully', data: announcement });
        } else {
            // Method not allowed
            res.status(405).json({ message: 'Method Not Allowed' });
        }
    } catch (error) {
        console.error('Error deleting announcement:', error);
        res.status(500).json({ message: 'Error deleting announcement', error: error instanceof Error ? error.message : 'Unknown error' });
    }
}
