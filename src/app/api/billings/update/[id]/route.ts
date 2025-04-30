import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function PUT(
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
    const body = await req.json();
    const { billName, month, amount, dueDate, description, classId } = body;

    if (!billName || !month || !amount || !dueDate || !description) {
      return NextResponse.json(
        { message: "Missing required fields" },
        { status: 400 }
      );
    }

    const updatedBilling = await prisma.billing.update({
      where: { id },
      data: {
        billName,
        month,
        amount: parseFloat(amount),
        dueDate: new Date(dueDate),
        description,
        classId: classId ? Number(classId) : null,
      },
    });

    return NextResponse.json({
      message: "Billing updated successfully",
      data: updatedBilling,
    });
  } catch (error) {
    console.error("Update billing error:", error);
    return NextResponse.json(
      { message: "Failed to update billing" },
      { status: 500 }
    );
  }
}
