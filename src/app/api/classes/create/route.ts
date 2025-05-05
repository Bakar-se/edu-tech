import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { name, capacity, teacherId, gradeId } = body;

    // Basic validation
    if (!name || !capacity) {
      return NextResponse.json(
        { message: "Missing required fields: name or capacity" },
        { status: 400 }
      );
    }

    const newClass = await prisma.class.create({
      data: {
        name,
        capacity: Number(capacity),
        teacherId: teacherId || null,
        gradeId: gradeId === 0 ? null : gradeId,
      },
    });

    return NextResponse.json(newClass, { status: 201 });
  } catch (error) {
    console.error("Error creating class:", error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}
