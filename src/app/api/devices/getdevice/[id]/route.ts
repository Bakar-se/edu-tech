import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    if (!id) {
      return NextResponse.json(
        { message: "Device not found!" },
        { status: 400 }
      );
    }

    const device = await prisma.device.findUnique({
      where: { id: id },
    });

    if (!device) {
      return NextResponse.json(
        { message: "Device not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(device, { status: 200 });
  } catch (error) {
    console.error("Error fetching device:", error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}
