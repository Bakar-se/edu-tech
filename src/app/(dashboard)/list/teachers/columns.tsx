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
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Badge } from "@/components/ui/badge";

export type Teacher = {
  class: any;
  subject: any;
  id: string;
  teacherId: string;
  name: string;
  surname: string;
  email: string;
  subjects: string[];
  classes: string[];
  phone: string;
  address: string;
};

export const useTeacherColumns = () => {
  const router = useRouter();
  const { user } = useUser();
  const role = user?.publicMetadata.role as string | undefined;
  const queryClient = useQueryClient();

  // delete teacher api

  const deleteTeacherMutation = useMutation({
    mutationFn: async (teacherId: string) => {
      const res = await axios.delete(`/api/teachers/delete/${teacherId}`);
      return res.data;
    },
    onSuccess: () => {
      toast.success("Teacher deleted successfully!");
      queryClient.invalidateQueries({ queryKey: ["teachers"] });
    },
    onError: (error: any) => {
      console.error("Error deleting teacher:", error);
      toast.error("Failed to delete teacher");
    },
  });

  // Usage
  const handleDelete = (teacherId: string) => {
    deleteTeacherMutation.mutate(teacherId);
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
      accessorKey: "name",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="First name" />
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
      accessorKey: "subject",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Subject" />
      ),
      cell: ({ row }: { row: Row<Teacher> }) => {
        const subject = row.original.subject; // This is a single object, not an array.

        return (
          <Badge>{subject.name}</Badge> // Display the name of the subject
        );
      },
    },
    {
      accessorKey: "class",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Class" />
      ),
      cell: ({ row }: { row: Row<Teacher> }) => {
        const classInfo = row.original.class; // This is a single object, not an array.

        return (
          <Badge>{classInfo.name}</Badge> // Display the name of the class
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
          cell: ({ row }: { row: Row<Teacher> }) => (
            <div className="flex items-center justify-center space-x-2">
              <Link href={`/list/teachers/profile?id=${row.original.id}`}>
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
