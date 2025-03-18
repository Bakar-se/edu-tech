"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Edit, Trash } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DataTableColumnHeader } from "@/components/DataTableColumnHeaderProps";
import { Checkbox } from "@/components/ui/checkbox"
import { role } from "@/lib/data";
import { DeleteDialog } from "@/components/ui/delete-dialog";

export type Parent = {
  id: number;
  name: string;
  students: string[];
  email: string;
  phone: string;
  address: string;
};

export const columns: ColumnDef<Parent>[] = [
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
              title="Delete Parent"
              description="This action cannot be undone. This will permanently delete the parent and remove their data from our servers."
              onDelete={() => {
                // Add your delete logic here
                console.log("Deleting parent:", row.original);
              }}
            />
          </div>
        ) : "not authorized";
      },
    },
];
