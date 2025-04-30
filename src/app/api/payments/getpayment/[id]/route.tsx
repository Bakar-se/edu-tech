import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  if (!id || typeof id !== "string") {
    return NextResponse.json(
      { message: "Invalid or missing ID" },
      { status: 400 }
    );
  }

  try {
    const payment = await prisma.payment.findUnique({
      where: { id },
      include: {
        billing: {
          select: {
            billName: true,
            amount: true,
            month: true,
          },
        },
      },
    });

    if (!payment) {
      return NextResponse.json(
        { message: "Payment not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { message: "Payment fetched successfully", data: payment },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching payment:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
