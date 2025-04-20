"use client";

import { ColumnDef, Row } from "@tanstack/react-table";
import { Edit, Trash } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DataTableColumnHeader } from "@/components/DataTableColumnHeaderProps";
import { Checkbox } from "@/components/ui/checkbox";
import { DeleteDialog } from "@/components/ui/delete-dialog";
import { useRouter } from "next/navigation";
import { useUser } from "@clerk/nextjs";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { toast } from "sonner";
import Link from "next/link";

export type Parent = {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  students: string[]; // Array of student IDs
  occupation: string;
  emergencyContact: string;
  nationality: string;
  createdAt: string; // Example timestamp field
  updatedAt: string; // Example timestamp field
};

// ✅ Wrap columns in a function to accept role dynamically
export const useParentColumns = () => {
  const router = useRouter();
  const { user } = useUser();
  const role = user?.publicMetadata.role as string | undefined;

  const queryClient = useQueryClient();

  // Delete parent API
  const deleteParentMutation = useMutation({
    mutationFn: async (parentId: string) => {
      const res = await axios.delete(`/api/parents/delete/${parentId}`);
      return res.data;
    },
    onSuccess: () => {
      toast.success("Parent deleted successfully!");
      queryClient.invalidateQueries({ queryKey: ["parents"] });
    },
    onError: (error: any) => {
      console.error("Error deleting parent:", error);
      toast.error("Failed to delete parent");
    },
  });

  // Usage
  const handleDelete = (parentId: string) => {
    deleteParentMutation.mutate(parentId);
  };

  const columns: ColumnDef<Parent>[] = [
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
      cell: ({ row }: { row: Row<Parent> }) => (
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
      accessorKey: "students",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Students" />
      ),
      cell: ({ row }) => {
        const students = row.original.students;
        return (
          <div>
            {Array.isArray(students) && students.length > 0
              ? students.join(", ")
              : "No students"}
          </div>
        );
      }

    },
    {
      accessorKey: "phone",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Phone" />
      ),
    },
    {
      accessorKey: "address",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Address" />
      ),
    },
    {
      accessorKey: "emergencyContact",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Emergency Contact" />
      ),
    },

    ...(role === "admin"
      ? [
        {
          id: "action",
          header: () => <div className="text-center">Action</div>,
          cell: ({ row }: { row: Row<Parent> }) => (
            <div className="flex items-center justify-center space-x-2">
              <Link
                href={`/list/parents/manage?action=edit&id=${row.original.id}`}
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
                title="Delete Parent"
                description="This action cannot be undone. This will permanently delete the parent and remove their data from our servers."
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
