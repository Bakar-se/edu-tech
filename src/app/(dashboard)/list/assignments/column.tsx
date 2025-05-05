"use client";

import { ColumnDef, Row } from "@tanstack/react-table";
import { Edit, Trash, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DataTableColumnHeader } from "@/components/DataTableColumnHeaderProps";
import { Checkbox } from "@/components/ui/checkbox";
import { DeleteDialog } from "@/components/ui/delete-dialog";
import { useUser } from "@clerk/nextjs";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { toast } from "sonner";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import moment from "moment";
import { useRouter } from "next/navigation";

export type Assignment = {
  id: number;
  subject: string;
  class: string;
  teacher: string;
  dueDate: string;
};

export const useAssignmentColumns = () => {
  const { user } = useUser();
  const role = user?.publicMetadata.role as string | undefined;
  const queryClient = useQueryClient();

  // delete classes api

  const deleteAssignmentMutation = useMutation({
    mutationFn: async (assignmentId: number) => {
      const res = await axios.delete(`/api/assignments/delete/${assignmentId}`);
      return res.data.data;
    },
    onSuccess: () => {
      toast.success("Assignment deleted successfully!");
      queryClient.invalidateQueries({ queryKey: ["assignments"] });
    },
    onError: (error: any) => {
      console.error("Error deleting assignments:", error);
      toast.error("Failed to delete assignments");
    },
  });

  // Usage
  const handleDelete = (assignmentId: number) => {
    deleteAssignmentMutation.mutate(assignmentId);
  };

  const columns: ColumnDef<Assignment>[] = [
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
      accessorKey: "subject",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Subject" />
      ),
    },
    {
      accessorKey: "class",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Class" />
      ),
    },
    {
      accessorKey: "teacher",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Teacher" />
      ),
    },
    {
      accessorKey: "dueDate",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Due Date" />
      ),
    },
    ...(role === "admin" || "teacher"
      ? [
        {
          id: "action",
          header: () => <div className="text-center">Action</div>,
          cell: ({ row }: { row: Row<Assignment> }) => (
            <div className="flex items-center justify-center space-x-2">
              <Link
                href={`/list/assignments/manage?action=edit&id=${row.original.id}`}
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
                title="Delete Class"
                description="This action cannot be undone. This will permanently delete the assignment and remove its data from our servers."
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
