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

export type Class = {
  id: number;
  name: string;
  capacity: number;
  supervisor: {
    name: string;
    surname: string;
  };
};

// ✅ Wrap columns in a function to accept role dynamically
export const useClassColumns = () => {
  const { user } = useUser();
  const role = user?.publicMetadata.role as string | undefined;
  const queryClient = useQueryClient();

  // delete classes api

  const deleteClassMutation = useMutation({
    mutationFn: async (classId: number) => {
      const res = await axios.delete(`/api/classes/delete/${classId}`);
      return res.data;
    },
    onSuccess: () => {
      toast.success("Class deleted successfully!");
      queryClient.invalidateQueries({ queryKey: ["classes"] });
    },
    onError: (error: any) => {
      console.error("Error deleting classes:", error);
      toast.error("Failed to delete classes");
    },
  });

  // Usage
  const handleDelete = (classId: number) => {
    deleteClassMutation.mutate(classId);
  };

  const columns: ColumnDef<Class>[] = [
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
      cell: ({ row }: { row: Row<Class> }) => (
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
      accessorKey: "capacity",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Capacity" />
      ),
    },
    {
      accessorKey: "supervisor",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Supervisor" />
      ),
      cell: ({ row }: { row: Row<Class> }) => {
        const supervisor = row.original.supervisor;
        return supervisor ? (
          <div>{`${supervisor.name} ${supervisor.surname}`}</div>
        ) : (
          <div className="text-muted-foreground italic">No Supervisor</div>
        );
      },
    },
    ...(role === "admin"
      ? [
          {
            id: "action",
            header: () => <div className="text-center">Action</div>,
            cell: ({ row }: { row: Row<Class> }) => (
              <div className="flex items-center justify-center space-x-2">
                <Link
                  href={`/list/classes/manage?action=edit&id=${row.original.id}`}
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
                  description="This action cannot be undone. This will permanently delete the class and remove its data from our servers."
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
