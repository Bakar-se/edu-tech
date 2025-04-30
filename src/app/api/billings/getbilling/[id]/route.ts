import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  if (!id || typeof id !== "string") {
    return NextResponse.json(
      { message: "Invalid or missing billing ID" },
      { status: 400 }
    );
  }

  try {
    const billing = await prisma.billing.findUnique({
      where: { id },
      include: {
        class: true, // Include related class data if needed
      },
    });

    if (!billing) {
      return NextResponse.json(
        { message: "Billing not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ data: billing }, { status: 200 });
  } catch (error) {
    console.error("Failed to fetch billing data:", error);
    return NextResponse.json(
      { message: "Failed to fetch billing data" },
      { status: 500 }
    );
  }
}
