import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  if (!id || typeof id !== "string") {
    return NextResponse.json(
      { message: "Invalid billing ID" },
      { status: 400 }
    );
  }

  try {
    const deletedBilling = await prisma.billing.delete({
      where: { id },
    });

    return NextResponse.json(
      {
        message: "Billing record deleted successfully",
        data: deletedBilling,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Failed to delete billing record:", error);
    return NextResponse.json(
      { message: "Failed to delete billing record" },
      { status: 500 }
    );
  }
}
