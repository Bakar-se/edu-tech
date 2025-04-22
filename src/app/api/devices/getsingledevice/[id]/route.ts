// app/api/devices/route.ts
import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(
  _: Request,
  { params }: { params: Promise<{ id: number }> }
) {
  try {
    const { id } = await params;

    if (!id || isNaN(Number(id))) {
      return NextResponse.json({ error: "Invalid ID" }, { status: 400 });
    }

    const device = await prisma.device.findUnique({
      where: { id: Number(id) },
    });

    if (!device) {
      return NextResponse.json({ error: "Device not found" }, { status: 404 });
    }

    return NextResponse.json(device);
  } catch (error) {
    console.error("GET /api/devices error:", error);
    return NextResponse.json(
      { error: "Failed to fetch device", detail: error },
      { status: 500 }
    );
  }
}
