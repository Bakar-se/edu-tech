import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const body = await req.json();
    const { deviceId, name } = body;

    // Basic validation
    if (!deviceId || !name) {
      return NextResponse.json(
        { message: "Missing required fields" },
        { status: 400 }
      );
    }

    const updatedDevice = await prisma.device.update({
      where: { id: id },
      data: {
        deviceId,
        name,
      },
    });

    return NextResponse.json(updatedDevice, { status: 200 });
  } catch (error) {
    console.error("Error updating device:", error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}
