import { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from '@prisma/client';

// Initialize Prisma client
const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const { method } = req;
    const { id } = req.query; // Get the announcement ID from the query parameters

    // Check if the ID is valid
    if (!id || Array.isArray(id)) {
        return res.status(400).json({ message: 'Invalid ID' });
    }

    try {
        if (method === 'PUT') {
            const { title, description, date, classId } = req.body;

            // Check if all required fields are provided
            if (!title || !description || !date) {
                return res.status(400).json({ message: 'Missing required fields' });
            }

            // Update the announcement in the database
            const updatedAnnouncement = await prisma.announcement.update({
                where: {
                    id: Number(id), // Ensure ID is a number
                },
                data: {
                    title,
                    description,
                    date: new Date(date), // Ensure the date is in Date format
                    classId: classId ? Number(classId) : null, // If classId is provided, convert it to number
                },
            });

            return res.status(200).json({ message: 'Announcement updated successfully', data: updatedAnnouncement });
        } else {
            // Method not allowed if not PUT
            return res.status(405).json({ message: 'Method Not Allowed' });
        }
    } catch (error) {
        console.error('Error updating announcement:', error);
        return res.status(500).json({ message: 'Error updating announcement', error: error instanceof Error ? error.message : 'Unknown error' });
    }
}
