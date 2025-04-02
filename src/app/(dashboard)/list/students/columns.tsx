"use client";

import { ColumnDef, Row } from "@tanstack/react-table";
import { Edit, Trash } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DataTableColumnHeader } from "@/components/DataTableColumnHeaderProps";
import { Checkbox } from "@/components/ui/checkbox";
import { DeleteDialog } from "@/components/ui/delete-dialog";
import { useUser } from "@clerk/nextjs";

export type Student = {
  id: number;
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
  const { user } = useUser();
  const role = user?.publicMetadata.role as string | undefined;

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
              <Button variant="ghost" size="icon">
                <Edit />
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
                  console.log("Deleting student:", row.original);
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
