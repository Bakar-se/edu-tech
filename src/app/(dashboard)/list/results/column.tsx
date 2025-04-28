"use client";

import { ColumnDef, Row } from "@tanstack/react-table";
import { Edit, Trash } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { DeleteDialog } from "@/components/ui/delete-dialog";
import { DataTableColumnHeader } from "@/components/DataTableColumnHeaderProps";
import Link from "next/link";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { toast } from "sonner";
import { useUser } from "@clerk/nextjs";

export type Result = {
  id: number;
  subject: string;
  class: string;
  grade: string;
};

export const useResultColumns = () => {
  const { user } = useUser();
  const role = user?.publicMetadata.role as string | undefined;
  const queryClient = useQueryClient();

  const deleteResultMutation = useMutation({
    mutationFn: (resultId: number) => axios.delete(`/api/results/delete/${resultId}`),
    onSuccess: () => {
      toast.success("Result deleted successfully!");
      queryClient.invalidateQueries({ queryKey: ["results"] });
    },
    onError: () => {
      toast.error("Failed to delete result");
    },
  });

  const handleDelete = (resultId: number) => {
    deleteResultMutation.mutate(resultId);
  };

  const columns: ColumnDef<Result>[] = [
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
      header: ({ column }) => <DataTableColumnHeader column={column} title="Subject" />,
    },
    {
      accessorKey: "class",
      header: ({ column }) => <DataTableColumnHeader column={column} title="Class" />,
    },
    {
      accessorKey: "grade",
      header: ({ column }) => <DataTableColumnHeader column={column} title="Grade" />,
    },
    ...(role === "admin" || role === "teacher"
      ? [
        {
          id: "action",
          header: () => <div className="text-center">Action</div>,
          cell: ({ row }: { row: Row<Result> }) => (
            <div className="flex items-center justify-center space-x-2">
              <Link href={`/list/results/manage?action=edit&id=${row.original.id}`}>
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
                title="Delete Result"
                description="This action cannot be undone. This will permanently delete the result."
                onDelete={() => handleDelete(row.original.id)}
              />
            </div>
          ),
        },
      ]
      : []),
  ];

  return columns;
};
