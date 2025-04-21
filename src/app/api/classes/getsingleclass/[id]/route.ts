// /api/classes/getclass/[id]/route.ts
import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: number }> }
) {
  const { id } = await params;

  try {
    console.log(id);
    const classData = await prisma.class.findUnique({
      where: { id: Number(id) },
      include: {
        supervisor: true,
        grade: true,
      },
    });

    if (!classData) {
      return NextResponse.json({ message: "Class not found" }, { status: 404 });
    }

    return NextResponse.json({ data: classData }, { status: 200 });
  } catch (error) {
    console.error("Error fetching class:", error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}
