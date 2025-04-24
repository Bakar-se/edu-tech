"use client";

import { ColumnDef, Row } from "@tanstack/react-table";
import { Edit, Trash } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DataTableColumnHeader } from "@/components/DataTableColumnHeaderProps";
import { Checkbox } from "@/components/ui/checkbox";
import { DeleteDialog } from "@/components/ui/delete-dialog";
import Link from "next/link";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { toast } from "sonner";
import { useUser } from "@clerk/nextjs";


export type Exam = {
  id: number;
  subject: string;
  class: string;
  teacher: string;
  date: string;
};

export const useExamColumns = () => {
  const { user } = useUser();
  const role = user?.publicMetadata.role as string | undefined;
  console.log(role);
  const queryClient = useQueryClient();

  // delete exam api

  const deleteExamMutation = useMutation({
    mutationFn: async (examId: number) => {
      const res = await axios.delete(`/api/exams/delete/${examId}`);
      return res.data;
    },
    onSuccess: () => {
      toast.success("Exam deleted successfully!");
      queryClient.invalidateQueries({ queryKey: ["exams"] });
    },
    onError: (error: any) => {
      console.error("Error deleting exams:", error);
      toast.error("Failed to delete exams");
    },
  });

  // Usage
  const handleDelete = (examId: number) => {
    deleteExamMutation.mutate(examId);
  };

  const columns: ColumnDef<Exam>[] = [
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
      cell: ({ row }: { row: Row<Exam> }) => (
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
    {
      accessorKey: "date",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Date" />
      ),
    },
    ...(role === "admin"
      ? [
        {
          id: "action",
          header: () => <div className="text-center">Action</div>,
          cell: ({ row }: { row: Row<Exam> }) => (
            <div className="flex items-center justify-center space-x-2">
              <Link
                href={`/list/exams/manage?action=edit&id=${row.original.id}`}
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
                description="This action cannot be undone. This will permanently delete the exam and remove its data from our servers."
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
