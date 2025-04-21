// /api/classes/update/[id]/route.ts
import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: number }> }
) {
  try {
    const { id } = await params;
    const body = await req.json();
    const { name, capacity, supervisorId, gradeId } = body;

    const updatedClass = await prisma.class.update({
      where: { id: Number(id) },
      data: {
        name,
        capacity: Number(capacity),
        supervisorId: supervisorId || null,
        gradeId: gradeId || null,
      },
    });

    return NextResponse.json({ data: updatedClass }, { status: 200 });
  } catch (error) {
    console.error("Error updating class:", error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}
