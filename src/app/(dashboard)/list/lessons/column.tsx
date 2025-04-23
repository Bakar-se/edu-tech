"use client";

import { ColumnDef, Row } from "@tanstack/react-table";
import { Edit, Trash } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DataTableColumnHeader } from "@/components/DataTableColumnHeaderProps";
import { Checkbox } from "@/components/ui/checkbox";
import { DeleteDialog } from "@/components/ui/delete-dialog";
import { useUser } from "@clerk/nextjs";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { toast } from "sonner";
import Link from "next/link";

export type Lesson = {
  id: number;
  subject: string;
  class: string; // Renamed 'class' to 'className' to avoid keyword conflict
  teacher: string;
};

// ✅ Wrap columns in a function to accept role dynamically
export const useLessonColumns = () => {
  const { user } = useUser();
  const role = user?.publicMetadata.role as string | undefined;
  console.log(role);
  const queryClient = useQueryClient();

  // delete lesson api

  const deleteLessonMutation = useMutation({
    mutationFn: async (lessonId: number) => {
      const res = await axios.delete(`/api/lessons/delete/${lessonId}`);
      return res.data;
    },
    onSuccess: () => {
      toast.success("Lesson deleted successfully!");
      queryClient.invalidateQueries({ queryKey: ["lessons"] });
    },
    onError: (error: any) => {
      console.error("Error deleting lessons:", error);
      toast.error("Failed to delete lessons");
    },
  });

  // Usage
  const handleDelete = (lessonId: number) => {
    deleteLessonMutation.mutate(lessonId);
  };

  const columns: ColumnDef<Lesson>[] = [
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
      cell: ({ row }: { row: Row<Lesson> }) => (
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
      accessorKey: "class", // Updated to match the renamed field
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
    ...(role === "admin"
      ? [
        {
          id: "action",
          header: () => <div className="text-center">Action</div>,
          cell: ({ row }: { row: Row<Lesson> }) => (
            <div className="flex items-center justify-center space-x-2">
              <Link
                href={`/list/lessons/manage?action=edit&id=${row.original.id}`}
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
                title="Delete Lesson"
                description="This action cannot be undone. This will permanently delete the lesson and remove its data from our servers."
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