import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";
export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: number }> }
) {
  const { id } = await params;
  const body = await req.json();
  const { deviceId, name } = body;

  try {
    const updatedDevice = await prisma.device.update({
      where: { id: Number(id) },
      data: { deviceId, name },
    });
    return NextResponse.json(updatedDevice);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to update device", detail: error },
      { status: 400 }
    );
  }
}
