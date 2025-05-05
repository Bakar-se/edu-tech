import { ColumnDef, Row } from "@tanstack/react-table";
import { Edit, Trash, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DataTableColumnHeader } from "@/components/DataTableColumnHeaderProps";
import { Checkbox } from "@/components/ui/checkbox";
import { DeleteDialog } from "@/components/ui/delete-dialog";
import { useUser } from "@clerk/nextjs";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { toast } from "sonner";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import moment from "moment";

export type Lesson = {
  id: string; // Updated id type to string
  startTime: string;
  endTime: string;
  subject: {
    id: string;
    name: string;
  };
  teacher: {
    id: string;
    name: string;
    surname: string;
  };
  class: {
    id: number;
    name: string;
  };
  day: string[]; // Array of days for the lesson
};

export const useLessonColumns = () => {
  const { user } = useUser();
  const role = user?.publicMetadata.role as string | undefined;
  const queryClient = useQueryClient();

  const deleteLessonMutation = useMutation({
    mutationFn: async (lessonId: string) => {
      const res = await axios.delete(`/api/lessons/delete/${lessonId}`);
      return res.data;
    },
    onSuccess: () => {
      toast.success("Lesson deleted successfully!");
      queryClient.invalidateQueries({ queryKey: ["lessons"] });
    },
    onError: (error: any) => {
      console.error("Error deleting lesson:", error);
      toast.error("Failed to delete lesson");
    },
  });

  const handleDelete = (lessonId: string) => {
    deleteLessonMutation.mutate(lessonId);
  };

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
      accessorKey: "startTime",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Start Time" />
      ),
      cell: ({ row }: { row: Row<Lesson> }) => (
        <div>{moment(row.original.startTime).format("hh:mm A")}</div>
      ),
    },
    {
      accessorKey: "endTime",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="End Time" />
      ),
      cell: ({ row }: { row: Row<Lesson> }) => (
        <div>{moment(row.original.endTime).format("hh:mm A")}</div>
      ),
    },
    {
      accessorKey: "subject",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Subject" />
      ),
      cell: ({ row }: { row: Row<Lesson> }) => {
        const subject = row.original.subject; // This is a single object, not an array.

        return (
          <Badge>{subject.name}</Badge> // Display the name of the subject
        );
      },
    },
    {
      accessorKey: "teacher",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Teacher" />
      ),
      cell: ({ row }: { row: Row<Lesson> }) => {
        const teacher = row.original.teacher; // This is a single object, not an array.

        return (
          <div className="flex flex-wrap">
            <Badge key={teacher.id}>
              {teacher.name} {teacher.surname}
            </Badge>
          </div>
        );
      },
    },
    {
      accessorKey: "class",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Class" />
      ),
      cell: ({ row }: { row: Row<Lesson> }) => {
        const classInfo = row.original.class; // This is a single object, not an array.

        return (
          <Badge>{classInfo.name}</Badge> // Display the name of the class
        );
      },
    },
    {
      accessorKey: "day",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Days" />
      ),
      cell: ({ row }: { row: Row<Lesson> }) => {
        const days = row.original.day; // Assuming day is an array

        return (
          <div className="flex flex-wrap gap-1">
            {days.map((day: string) => (
              <Badge key={day}>{day}</Badge>
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
          cell: ({ row }: { row: Row<Lesson> }) => (
            <div className="flex items-center justify-center space-x-2">
              <Link
                href={`/list/lessons/manage?action=edit&id=${row.original.id}`}
              >
                <Button variant="ghost" size="icon">
                  <Edit />
                </Button>
              </Link>
              <Link href={`/list/lessons/view?id=${row.original.id}`}>
                <Button variant="ghost" size="icon">
                  <Eye />
                </Button>
              </Link>
              <DeleteDialog
                trigger={
                  <Button variant="ghost" size="icon">
                    <Trash className="text-destructive" />
                  </Button>
                }
                title="Delete Lesson"
                description="This action cannot be undone. This will permanently delete the lesson and remove its data from our servers."
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
