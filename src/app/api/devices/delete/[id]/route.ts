import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function DELETE(
  _: Request,
  { params }: { params: Promise<{ id: number }> }
) {
  const { id } = await params;

  try {
    console.log(id);
    await prisma.device.delete({ where: { id: Number(id) } });
    return NextResponse.json({ message: "Device deleted" }, { status: 200 });
  } catch (error) {
    console.error("Failed to delete device:", error);
    return NextResponse.json(
      { error: "Failed to delete device", detail: error },
      { status: 400 }
    );
  }
}
