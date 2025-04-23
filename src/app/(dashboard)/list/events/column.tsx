"use client";

import { ColumnDef, Row } from "@tanstack/react-table";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { DataTableColumnHeader } from "@/components/DataTableColumnHeaderProps";
import { Checkbox } from "@/components/ui/checkbox"
import { role } from "@/lib/data";
import { DeleteDialog } from "@/components/ui/delete-dialog";
import { useRouter } from "next/navigation";
import { useUser } from "@clerk/nextjs";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { toast } from "sonner";
import { Edit, Eye, Trash } from "lucide-react";


export type Event = {
  id: number;
  title: string;
  class: string;
  date: string;
  startTime: string;
  endTime: string;
};
export const useEventColumns = () => {
  const router = useRouter();
  const { user } = useUser();
  const role = user?.publicMetadata.role as string | undefined;
  console.log(role);
  const queryClient = useQueryClient();

  // delete event api

  const deleteEventMutation = useMutation({
    mutationFn: async (eventId: string) => {
      const res = await axios.delete(`/api/events/delete/${eventId}`);
      return res.data;
    },
    onSuccess: () => {
      toast.success("Event deleted successfully!");
      queryClient.invalidateQueries({ queryKey: ["events"] });
    },
    onError: (error: any) => {
      console.error("Error deleting event:", error);
      toast.error("Failed to delete event");
    },
  });

  // Usage
  const handleDelete = (eventId: string) => {
    deleteEventMutation.mutate(eventId);
  };
  const columns: ColumnDef<Event>[] = [
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
      accessorKey: "title",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Title" />
      ),
    },
    {
      accessorKey: "class",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Class" />
      ),
    },
    {
      accessorKey: "date",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Date" />
      ),
    },
    {
      accessorKey: "startTime",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Start Time" />
      ),
    },
    {
      accessorKey: "endTime",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="End Time" />
      ),
    },
    ...(role === "admin"
      ? [
        {
          id: "action",
          header: () => <div className="text-center">Action</div>,
          cell: ({ row }: { row: Row<Event> }) => (
            <div className="flex items-center justify-center space-x-2">
              <Link href={`/list/events/profile/${row.original.id}`}>
                <Button variant="ghost" size="icon">
                  <Eye />
                </Button>
              </Link>
              <Link
                href={`/list/events/manage?action=edit&id=${row.original.id}`}
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
                title="Delete Event"
                description="This action cannot be undone. This will permanently delete the event and remove their data from our servers."
                onDelete={() => {
                  handleDelete(row.original.id.toString());
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