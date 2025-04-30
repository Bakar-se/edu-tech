import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const devices = await prisma.device.findMany({
      orderBy: {
        createdAt: "desc", // Optional: sorts by newest first
      },
    });

    return NextResponse.json(devices, { status: 200 });
  } catch (error) {
    console.error("Error fetching devices:", error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}
