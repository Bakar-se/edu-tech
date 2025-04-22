// app/api/devices/route.ts
import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function POST(req: Request) {
  const body = await req.json();
  console.log(body);
  const { deviceId, name } = body;

  try {
    const device = await prisma.device.create({
      data: {
        deviceId,
        name,
      },
    });
    return NextResponse.json(device, { status: 201 });
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { error: "Failed to create device", detail: error },
      { status: 400 }
    );
  }
}
