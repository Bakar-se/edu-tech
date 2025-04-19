"use client";

import { ColumnDef, Row } from "@tanstack/react-table";
import { Edit, Eye, Trash } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DataTableColumnHeader } from "@/components/DataTableColumnHeaderProps";
import { Checkbox } from "@/components/ui/checkbox";
import { DeleteDialog } from "@/components/ui/delete-dialog";
import Link from "next/link";
import { useUser } from "@clerk/nextjs";
import axios from "axios";

export type Teacher = {
  id: string;
  teacherId: string;
  name: string;
  email: string;
  subjects: string[];
  classes: string[];
  phone: string;
  address: string;
};

export const useTeacherColumns = () => {
  const { user } = useUser();
  const role = user?.publicMetadata.role as string | undefined;

  const deleteTeacher = async (teacherId: string) => {
    try {
      const res = await axios.delete(`/api/teachers/delete/${teacherId}`);
      console.log("Deleted:", res.data);
      return res.data;
    } catch (error) {
      console.error("Error deleting teacher:", error);
      throw error;
    }
  };

  const columns: ColumnDef<Teacher>[] = [
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
      accessorKey: "id",
      header: "Teacher ID",
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
      accessorKey: "subjects",
      header: "Subject",
    },
    {
      accessorKey: "classes",
      header: "Classes",
    },
    {
      accessorKey: "phone",
      header: "Phone",
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
            cell: ({ row }: { row: Row<Teacher> }) => (
              <div className="flex items-center justify-center space-x-2">
                <Link href={`/list/teachers/profile/${row.original.id}`}>
                  <Button variant="ghost" size="icon">
                    <Eye />
                  </Button>
                </Link>
                <Link
                  href={`/list/teachers/manage?action=edit&id=${row.original.id}`}
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
                  title="Delete Teacher"
                  description="This action cannot be undone. This will permanently delete the teacher and remove their data from our servers."
                  onDelete={() => {
                    deleteTeacher(row.original.id);
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
