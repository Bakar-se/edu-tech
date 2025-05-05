"use client";
import React, { useEffect, useState } from "react";
import { DataTable } from "@/components/ui/data-table";
import { Button } from "@/components/ui/button";
import { Download, Loader2, PlusCircle } from "lucide-react";
import { studentsData } from "@/lib/data";
import { useStudentColumns } from "./columns";
import { useRouter } from "next/navigation";
import axios from "axios";
import { useQuery } from "@tanstack/react-query";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { QRCodeCanvas } from "qrcode.react";
import { useUser } from "@clerk/nextjs";

const StudentList = () => {
  const router = useRouter();
  const { user } = useUser();
  const role = user?.publicMetadata.role as string | undefined;
  const {
    columns,
    selectedStudent,
    isQrModalOpen,
    setIsQrModalOpen,
    setSelectedStudent,
    qrRef,
    downloadQr,
  } = useStudentColumns();

  const fetchStudents = async () => {
    const response = await axios.get("/api/students/getallstudents");
    return response.data.data;
  };

  const {
    data: students,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["students"],
    queryFn: fetchStudents,
  });

  return (
    <div className="container mx-auto px-4 py-10">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold mb-4">Students</h1>
        {role === "admin" && (
          <Button
            onClick={() => router.push("/list/students/manage?action=create")}
            className="mb-4 flex items-center"
          >
            <PlusCircle /> Register Student
          </Button>
        )}
      </div>
      {isLoading ? (
        <Loader2 className="h-10 w-10 animate-spin" />
      ) : (
        <DataTable
          columns={columns}
          data={students}
          filterableColumns={["email", "name", "classes", "phone"]}
        />
      )}
      <Dialog open={isQrModalOpen} onOpenChange={setIsQrModalOpen}>
        <DialogContent className="max-w-md text-center flex flex-col justify-center items-center">
          <DialogHeader>
            <DialogTitle>Student QR Code</DialogTitle>
          </DialogHeader>
          {selectedStudent && (
            <>
              <QRCodeCanvas
                ref={qrRef}
                value={selectedStudent.id}
                size={200}
                includeMargin
              />
              <p className="mt-2 text-sm text-gray-500">
                Student: {selectedStudent.name} {selectedStudent.surname}
              </p>
              <Button className="mt-4" onClick={downloadQr}>
                <Download className="mr-2 h-4 w-4" /> Download QR
              </Button>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default StudentList;
