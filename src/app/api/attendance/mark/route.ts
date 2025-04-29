import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { studentId, deviceId } = body;

    if (!studentId || !deviceId) {
      return NextResponse.json(
        { message: "Missing required fields" },
        { status: 400 }
      );
    }

    // Validate student
    const student = await prisma.student.findUnique({
      where: { id: studentId },
      include: { parent: true },
    });
    if (!student)
      return NextResponse.json(
        { message: "Student not found" },
        { status: 404 }
      );

    // Validate device
    const device = await prisma.device.findUnique({
      where: { deviceId },
    });
    if (!device)
      return NextResponse.json(
        { message: "Device not found" },
        { status: 404 }
      );

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const existingAttendance = await prisma.attendance.findFirst({
      where: {
        studentId,
        date: { gte: today },
      },
      orderBy: { date: "desc" },
    });

    const now = new Date();
    const parentEmail = student.parent?.email;

    if (!existingAttendance) {
      // First check-in
      const newAttendance = await prisma.attendance.create({
        data: {
          studentId,
          deviceId: device.id, // Internal ID
          present: true,
          date: now,
          checkInTime: now,
        },
      });

      if (parentEmail) {
        await resend.emails.send({
          from: "Acme <onboarding@resend.dev>",
          to: parentEmail,
          subject: `Check-in: ${student.name} ${student.surname}`,
          html: `<p>${student.name} has checked in at ${now.toLocaleTimeString()}.</p>`,
        });
      }

      return NextResponse.json(newAttendance, { status: 201 });
    } else {
      // Update checkout time
      const updatedAttendance = await prisma.attendance.update({
        where: { id: existingAttendance.id },
        data: {
          checkOutTime: now,
        },
      });

      if (parentEmail) {
        await resend.emails.send({
          from: "Acme <onboarding@resend.dev>",
          to: parentEmail,
          subject: `Check-out: ${student.name} ${student.surname}`,
          html: `<p>${student.name} has checked out at ${now.toLocaleTimeString()}.</p>`,
        });
      }

      return NextResponse.json(updatedAttendance, { status: 200 });
    }
  } catch (error) {
    console.error("Error marking attendance:", error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}
