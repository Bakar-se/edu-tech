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

export type Device = {
  id: number;
  deviceId: string;
  name: string;
  createdAt: string;
};

export const useDeviceColumns = () => {
  const { user } = useUser();
  const role = user?.publicMetadata.role as string | undefined;

  const queryClient = useQueryClient();

  // delete device API call
  const deleteDeviceMutation = useMutation({
    mutationFn: async (deviceId: number) => {
      const res = await axios.delete(`/api/devices/delete/${deviceId}`);
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

  const handleDelete = (deviceId: number) => {
    deleteDeviceMutation.mutate(deviceId);
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
      cell: ({ row }: { row: Row<Device> }) => (
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
                  description="This action cannot be undone. This will permanently delete the device and remove its data from our servers."
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
