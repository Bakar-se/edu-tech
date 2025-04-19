import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET() {
  try {
    const teachers = await prisma.teacher.findMany({
      orderBy: { createdAt: "desc" }, // Optional: newest first
      include: {
        subjects: true, // Optional: include related data
        classes: true,
        lessons: true,
      },
    });

    return NextResponse.json(
      { success: true, data: teachers },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("[GET_TEACHERS_ERROR]", error);

    return NextResponse.json(
      {
        success: false,
        message: error?.message || "Failed to fetch teachers",
      },
      { status: 500 }
    );
  }
}
