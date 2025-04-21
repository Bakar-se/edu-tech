// /api/classes/delete/[id]/route.ts
import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: number }> }
) {
  try {
    const { id } = await params;

    const deletedClass = await prisma.class.delete({
      where: { id: Number(id) },
    });

    return NextResponse.json({ data: deletedClass }, { status: 200 });
  } catch (error) {
    console.error("Error deleting class:", error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}
