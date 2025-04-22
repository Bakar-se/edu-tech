"use client";

import { ColumnDef, Row } from "@tanstack/react-table";
import { Edit, Eye, Trash } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DataTableColumnHeader } from "@/components/DataTableColumnHeaderProps";
import { Checkbox } from "@/components/ui/checkbox";
import { DeleteDialog } from "@/components/ui/delete-dialog";
import Link from "next/link";
import { useUser } from "@clerk/nextjs";
import axios from "axios";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export type Device = {
  id: number;
  name: string;
  deviceId: string;
};

export const useDeviceColumns = () => {
  const router = useRouter();
  const { user } = useUser();
  const role = user?.publicMetadata.role as string | undefined;

  const queryClient = useQueryClient();

  const deleteTeacherMutation = useMutation({
    mutationFn: async (id: number) => {
      const res = await axios.delete(`/api/devices/delete/${id}`);
      return res.data;
    },
    onSuccess: () => {
      toast.success("Device deleted successfully!");
      queryClient.invalidateQueries({ queryKey: ["devices"] });
    },
    onError: (error: any) => {
      console.error("Error deleting device:", error);
      toast.error("Failed to delete device");
    },
  });

  // Usage
  const handleDelete = (deviceId: number) => {
    deleteTeacherMutation.mutate(deviceId);
  };

  const columns: ColumnDef<Device>[] = [
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
      accessorKey: "deviceId",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Device ID" />
      ),
    },
    ...(role === "admin"
      ? [
          {
            id: "action",
            header: () => <div className="text-center">Action</div>,
            cell: ({ row }: { row: Row<Device> }) => (
              <div className="flex items-center justify-center space-x-2">
                <Link
                  href={`/list/devices/manage?action=edit&id=${row.original.id}`}
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
                  title="Delete Device"
                  description="This action cannot be undone. This will permanently delete the teacher and remove their data from our servers."
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
