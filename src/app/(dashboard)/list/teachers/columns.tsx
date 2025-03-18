"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Edit, Eye, Trash } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DataTableColumnHeader } from "@/components/DataTableColumnHeaderProps";
import { Checkbox } from "@/components/ui/checkbox"
import { role } from '@/lib/data';
import { DeleteDialog } from "@/components/ui/delete-dialog";
import { useRouter } from "next/navigation";

export type Teacher = {
  id: number;
  teacherId: string;
  name: string;
  email: string;
  subjects: string[];
  classes: string[];
  phone: string;
  address: string;
};

export const columns: ColumnDef<Teacher>[] = [
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
        accessorKey: "teacherId",
        header: "Teacher ID",
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
    accessorKey: "subjects",
    header: "Subject",
  },
  {
    accessorKey: "classes",
    header: "Classes",
  },
  {
    accessorKey: "phone",
    header: "Phone",
  },
  {
    accessorKey: "address",
    header: "Address",
  },
  {
    id: "action",
    header: () => <div className="text-center">Action</div>,
    cell: ({ row }) => {
      const router = useRouter()
      return role === "admin" ? (
        <div className="flex items-center justify-center space-x-2">
          <Button variant="ghost" size="icon" onClick={() => router.push(`/list/teachers/profile/${row.original.id}`)}>
            <Eye />
          </Button>
          <Button variant="ghost" size="icon" onClick={() => router.push(`/list/teachers/manage?action=edit&id=${row.original.id}`)}>
            <Edit />
          </Button>
          <DeleteDialog
            trigger={
              <Button variant="ghost" size="icon">
                <Trash className="text-destructive" />
              </Button>
            }
            title="Delete Teacher"
            description="This action cannot be undone. This will permanently delete the teacher and remove their data from our servers."
            onDelete={() => {
              // Add your delete logic here
              console.log("Deleting teacher:", row.original);
            }}
          />
        </div>
      ) : "not authorized";
    },
  },
];
