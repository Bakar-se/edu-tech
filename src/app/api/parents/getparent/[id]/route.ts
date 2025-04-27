import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  if (!id) {
    return NextResponse.json(
      { success: false, message: "Parent ID is required" },
      { status: 400 }
    );
  }

  try {
    const parent = await prisma.parent.findUnique({
      where: { id },
      include: {
        students: true,
      },
    });

    if (!parent) {
      return NextResponse.json(
        { success: false, message: "Parent not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data: parent });
  } catch (error: any) {
    console.error("[GET_PARENT_BY_ID_ERROR]", error);
    return NextResponse.json(
      {
        success: false,
        message: error?.message || "Failed to fetch parent",
      },
      { status: 500 }
    );
  }
}
