import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const deletedTeacher = await prisma.teacher.delete({
      where: { id },
    });

    return NextResponse.json(deletedTeacher, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { message: "Failed to delete teacher", error },
      { status: 500 }
    );
  }
}
