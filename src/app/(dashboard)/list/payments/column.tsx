import { ColumnDef } from "@tanstack/react-table";
import { DataTableColumnHeader } from "@/components/DataTableColumnHeaderProps";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { DeleteDialog } from "@/components/ui/delete-dialog";
import { Eye, Edit, Trash } from "lucide-react";
import Link from "next/link";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { toast } from "sonner";
import { useUser } from "@clerk/nextjs";

export type Payment = {
  id: string;
  studentId: string;
  billingId: string;
  amountPaid: number;
  paymentDate: string;
  method: string;
};

export const usePaymentColumns = () => {
  const queryClient = useQueryClient();
  const { user } = useUser();
  const role = user?.publicMetadata.role as string | undefined;

  const deletePaymentMutation = useMutation({
    mutationFn: async (id: string) => {
      await axios.delete(`/api/payments/delete/${id}`);
    },
    onSuccess: () => {
      toast.success("Payment deleted successfully!");
      queryClient.invalidateQueries({ queryKey: ["payments"] });
    },
    onError: () => {
      toast.error("Failed to delete payment.");
    },
  });

  const handleDelete = (id: string) => {
    deletePaymentMutation.mutate(id);
  };

  const columns: ColumnDef<Payment>[] = [
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
      accessorKey: "studentId",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Student ID" />
      ),
    },
    {
      accessorKey: "billingId",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Billing ID" />
      ),
    },
    {
      accessorKey: "amountPaid",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Amount Paid" />
      ),
    },
    {
      accessorKey: "paymentDate",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Payment Date" />
      ),
      cell: ({ row }) =>
        new Date(row.original.paymentDate).toLocaleDateString(),
    },
    {
      accessorKey: "method",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Method" />
      ),
    },
    ...(role === "admin"
      ? [
          {
            id: "action",
            header: () => <div className="text-center">Action</div>,
            cell: ({ row }: { row: any }) => (
              <div className="flex items-center justify-center space-x-2">
                <Link href={`/list/payments/profile?id=${row.original.id}`}>
                  <Button variant="ghost" size="icon">
                    <Eye />
                  </Button>
                </Link>
                <Link
                  href={`/list/payments/manage?action=edit&id=${row.original.id}`}
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
                  title="Delete Payment"
                  description="This action cannot be undone. This will permanently delete the payment record."
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
