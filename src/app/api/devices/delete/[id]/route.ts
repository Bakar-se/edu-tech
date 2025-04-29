import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    // Check if the device exists before attempting to delete
    const deviceExists = await prisma.device.findUnique({
      where: { id: id },
    });

    if (!deviceExists) {
      return NextResponse.json(
        { message: "Device not found" },
        { status: 404 }
      );
    }

    // Perform the deletion
    await prisma.device.delete({
      where: { id: id },
    });

    return NextResponse.json(
      { message: "Device deleted successfully" },
      {
        status: 200,
      }
    );
  } catch (error) {
    console.error("Error deleting device:", error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}
