import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: number }> }
) {
  try {
    const { id } = await params;

    const announcement = await prisma.announcement.findUnique({
      where: {
        id: id,
      },
      include: {
        class: true, // Adjust this if your relation is named differently
      },
    });

    if (!announcement) {
      return NextResponse.json(
        { message: "Announcement not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(announcement, { status: 200 });
  } catch (error) {
    console.error("Error fetching announcement:", error);
    return NextResponse.json(
      {
        message: "Error fetching announcement",
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
