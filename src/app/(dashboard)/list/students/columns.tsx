"use client";

import { ColumnDef, Row } from "@tanstack/react-table";
import { Download, Edit, Eye, QrCode, Trash } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DataTableColumnHeader } from "@/components/DataTableColumnHeaderProps";
import { Checkbox } from "@/components/ui/checkbox";
import { DeleteDialog } from "@/components/ui/delete-dialog";
import { useUser } from "@clerk/nextjs";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { toast } from "sonner";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useRef, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { QRCodeCanvas } from "qrcode.react";
import { Badge } from "@/components/ui/badge";

export type Student = {
  id: string;
  studentId: string;
  name: string;
  surname: string;
  email: string;
  phone: string;
  classes: string[];
  address: string;
};

// ✅ Wrap columns inside a function to get role dynamically
export const useStudentColumns = () => {
  const { user } = useUser();
  const role = user?.publicMetadata.role as string | undefined;

  const queryClient = useQueryClient();

  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [isQrModalOpen, setIsQrModalOpen] = useState(false);
  const qrRef = useRef<HTMLCanvasElement | null>(null);

  const handleQrOpen = (student: Student) => {
    setSelectedStudent(student);
    setIsQrModalOpen(true);
  };

  const downloadQr = () => {
    if (qrRef.current) {
      const url = qrRef.current.toDataURL("image/png");
      const a = document.createElement("a");
      a.href = url;
      a.download = `${selectedStudent?.name}-${selectedStudent?.surname}.png`;
      a.click();
    }
  };

  // delete student api

  const deleteStudentMutation = useMutation({
    mutationFn: async (studentId: string) => {
      const res = await axios.delete(`/api/students/delete/${studentId}`);
      return res.data;
    },
    onSuccess: () => {
      toast.success("Student deleted successfully!");
      queryClient.invalidateQueries({ queryKey: ["students"] });
    },
    onError: (error: any) => {
      console.error("Error deleting student:", error);
      toast.error("Failed to delete student");
    },
  });

  // Usage
  const handleDelete = (studentId: string) => {
    deleteStudentMutation.mutate(studentId);
  };

  const columns: ColumnDef<Student>[] = [
    {
      id: "select",
      header: ({ table }) => (
        <Checkbox
          checked={
            table.getIsAllPageRowsSelected() ||
            (table.getIsSomePageRowsSelected() && "indeterminate")
          }
          onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
          aria-label="Select all"
        />
      ),
      cell: ({ row }) => (
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(value) => row.toggleSelected(!!value)}
          aria-label="Select row"
        />
      ),
      enableSorting: false,
      enableHiding: false,
    },

    {
      accessorKey: "name",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="First Name" />
      ),
    },
    {
      accessorKey: "surname",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Last name" />
      ),
    },
    {
      accessorKey: "email",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Email" />
      ),
    },
    {
      accessorKey: "classes",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Classes" />
      ),
      cell: ({ row }) => {
        const classes = row.original.classes || [];
        return (
          <div className="flex flex-wrap gap-1">
            {classes.map((classe: any) => (
              <Badge key={classe.id}>{classe.name}</Badge>
            ))}
          </div>
        );
      },
    },
    {
      accessorKey: "phone",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Phone" />
      ),
    },
    {
      accessorKey: "address",
      header: "Address",
    },
    ...(role === "admin"
      ? [
          {
            id: "action",
            header: () => <div className="text-center">Action</div>,
            cell: ({ row }: { row: Row<Student> }) => (
              <div className="flex items-center justify-center space-x-2">
                <Link href={`/list/students/profile?id=${row.original.id}`}>
                  <Button variant="ghost" size="icon">
                    <Eye />
                  </Button>
                </Link>
                <Link
                  href={`/list/students/manage?action=edit&id=${row.original.id}`}
                >
                  <Button variant="ghost" size="icon">
                    <Edit />
                  </Button>
                </Link>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => handleQrOpen(row.original)}
                >
                  <QrCode />
                </Button>
                <DeleteDialog
                  trigger={
                    <Button variant="ghost" size="icon">
                      <Trash className="text-destructive" />
                    </Button>
                  }
                  title="Delete Student"
                  description="This action cannot be undone. This will permanently delete the student and remove their data from our servers."
                  onDelete={() => {
                    handleDelete(row.original.id);
                  }}
                />
              </div>
            ),
          },
        ]
      : []),
  ];

  return {
    columns,
    selectedStudent,
    isQrModalOpen,
    setIsQrModalOpen,
    setSelectedStudent,
    qrRef,
    downloadQr,
  };
};
