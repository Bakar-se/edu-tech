// app/api/devices/route.ts
import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const devices = await prisma.device.findMany();
    console.log(devices);
    return NextResponse.json(devices);
  } catch (error) {
    console.error("GET /api/devices error:", error);
    return NextResponse.json(
      { error: "Failed to fetch devices", detail: error },
      { status: 500 }
    );
  }
}
