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
import { Badge } from "@/components/ui/badge";

export type Subject = {
  id: string;
  name: string;
  teachers: {
    id: string;
    name: string;
    surname: string;
  }[];
};

// ✅ Wrap columns inside a function to get role dynamically
export const useSubjectColumns = () => {
  const router = useRouter();
  const { user } = useUser();
  const role = user?.publicMetadata.role as string | undefined;

  const queryClient = useQueryClient();

  const deleteSubjectMutation = useMutation({
    mutationFn: async (subjectId: string) => {
      const res = await axios.delete(`/api/subjects/delete/${subjectId}`);
      return res.data;
    },
    onSuccess: () => {
      toast.success("Subject deleted successfully!");
      queryClient.invalidateQueries({ queryKey: ["subjects"] });
    },
    onError: (error: any) => {
      console.error("Error deleting subject:", error);
      toast.error("Failed to delete subject");
    },
  });
  // Usage
  const handleDelete = (subjectId: string) => {
    deleteSubjectMutation.mutate(subjectId);
  };

  const columns: ColumnDef<Subject>[] = [
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
      cell: ({ row }: { row: Row<Subject> }) => (
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
      accessorKey: "teachers",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Teachers" />
      ),
      cell: ({ row }: { row: Row<Subject> }) => {
        const teachers = row.original.teachers || [];

        return (
          <div className="flex flex-wrap">
            {teachers.map((teacher) => (
              <Badge className="m-1" key={teacher.id}>
                {teacher.name} {teacher.surname}
              </Badge>
            ))}
          </div>
        );
      },
    },
    ...(role === "admin"
      ? [
        {
          id: "action",
          header: () => <div className="text-center">Action</div>,
          cell: ({ row }: { row: Row<Subject> }) => (
            <div className="flex items-center justify-center space-x-2">
              <Link
                href={`/list/subjects/manage?action=edit&id=${row.original.id}`}
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
                title="Delete Subject"
                description="This action cannot be undone. This will permanently delete the subject and remove their data from our servers."
                onDelete={() => {
                  console.log("Deleting subject:", row.original);
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
