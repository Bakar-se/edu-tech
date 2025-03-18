"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Edit, Trash } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DataTableColumnHeader } from "@/components/DataTableColumnHeaderProps";
import { Checkbox } from "@/components/ui/checkbox"
import { role } from "@/lib/data";
import { DeleteDialog } from "@/components/ui/delete-dialog";

export type Result = {
    id: number;
    subject: string;
    class: string;
    teacher: string;
    student: string;
    date: string;
    type: string;
    score: number;
};

export const columns: ColumnDef<Result>[] = [
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
    accessorKey: "student",
    header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Student" />
      ),
  },
  {
    accessorKey: "date",
    header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Date" />
      ),
  },
  {
    accessorKey: "type",
    header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Type" />
      ),
  },
  {
    accessorKey: "score",
    header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Score" />
      ),
  },
  {
      id: "action",
      header: () => <div className="text-center">Action</div>,
      cell: ({ row }) => {
        return role === "admin" ? (
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
              title="Delete Result"
              description="This action cannot be undone. This will permanently delete the result and remove their data from our servers."
              onDelete={() => {
                // Add your delete logic here
                console.log("Deleting result:", row.original);
              }}
            />
          </div>
        ) : "not authorized";
      },
    },
];
