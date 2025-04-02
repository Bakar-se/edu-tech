"use client";

import { ColumnDef, Row } from "@tanstack/react-table";
import { Edit, Trash } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DataTableColumnHeader } from "@/components/DataTableColumnHeaderProps";
import { Checkbox } from "@/components/ui/checkbox";
import { DeleteDialog } from "@/components/ui/delete-dialog";

export type Lesson = {
  id: number;
  subject: string;
  class: string; // Renamed 'class' to 'className' to avoid keyword conflict
  teacher: string;
};

// ✅ Wrap columns in a function to accept role dynamically
export const useLessonColumns = (role?: string) => {
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
              <Button variant="ghost" size="icon">
                <Edit />
              </Button>
              <DeleteDialog
                trigger={
                  <Button variant="ghost" size="icon">
                    <Trash className="text-destructive" />
                  </Button>
                }
                title="Delete Lesson"
                description="This action cannot be undone. This will permanently delete the lesson and remove its data from our servers."
                onDelete={() => {
                  console.log("Deleting lesson:", row.original);
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
