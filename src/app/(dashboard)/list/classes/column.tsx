"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Edit, Trash } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DataTableColumnHeader } from "@/components/DataTableColumnHeaderProps";
import { Checkbox } from "@/components/ui/checkbox"
import { role } from "@/lib/data";
import { DeleteDialog } from "@/components/ui/delete-dialog";

export type Class = {
  id: number;
  name: string;
  capacity: number;
  grade: number;
  supervisor: string;
};

export const columns: ColumnDef<Class>[] = [
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
    accessorKey: "grade",
    header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Grade" />
      ),
  },
  {
    accessorKey: "supervisor",
    header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Supervisior" />
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
              title="Delete Class"
              description="This action cannot be undone. This will permanently delete the class and remove their data from our servers."
              onDelete={() => {
                // Add your delete logic here
                console.log("Deleting Class:", row.original);
              }}
            />
          </div>
        ) : "not authorized";
      },
    },
];
