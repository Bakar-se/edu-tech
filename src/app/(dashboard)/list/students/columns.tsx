"use client";

import { ColumnDef, Row } from "@tanstack/react-table";
import { Edit, Eye, Trash } from "lucide-react";
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

export type Student = {
  id: string;
  studentId: string;
  name: string;
  email: string;
  phone: string;
  grade: number;
  class: string;
  address: string;
};

// ✅ Wrap columns inside a function to get role dynamically
export const useStudentColumns = () => {
  const router = useRouter();
  const { user } = useUser();
  const role = user?.publicMetadata.role as string | undefined;

  const queryClient = useQueryClient();

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
      cell: ({ row }: { row: Row<Student> }) => (
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
      accessorKey: "studentId",
      header: "Student ID",
    },
    {
      accessorKey: "name",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Name" />
      ),
    },
    {
      accessorKey: "email",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Email" />
      ),
    },
    {
      accessorKey: "phone",
      header: "Phone",
    },
    {
      accessorKey: "grade",
      header: "Grade",
    },
    {
      accessorKey: "class",
      header: "Class",
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
              <Link href={`/list/students/profile/${row.original.id}`}>
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

  return columns;
};