import { ColumnDef } from "@tanstack/react-table";
import { DataTableColumnHeader } from "@/components/DataTableColumnHeaderProps";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { DeleteDialog } from "@/components/ui/delete-dialog";
import { Eye, Edit, Trash } from "lucide-react";
import Link from "next/link";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { toast } from "sonner";
import { useQueryClient } from "@tanstack/react-query";

// Updated Billing Type to include `classId`
export type Billing = {
    id: string;
    billName: string;
    month: string;
    amount: number;
    dueDate: string;
    description: string;
    classId: string;  // Added classId here
};

export const useBillingColumns = () => {
    const queryClient = useQueryClient();

    // Mutation: delete billing
    const deleteBillingMutation = useMutation({
        mutationFn: async (id: string) => {
            await axios.delete(`/api/billings/delete/${id}`);
        },
        onSuccess: () => {
            toast.success("Billing deleted successfully!");
            queryClient.invalidateQueries({ queryKey: ["billings"] });
        },
        onError: () => {
            toast.error("Failed to delete billing.");
        },
    });

    const handleDelete = (id: string) => {
        deleteBillingMutation.mutate(id);
    };

    const columns: ColumnDef<Billing>[] = [
        {
            id: "select",
            header: ({ table }) => (
                <Checkbox
                    checked={table.getIsAllPageRowsSelected() || (table.getIsSomePageRowsSelected() && "indeterminate")}
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
            accessorKey: "billName",
            header: ({ column }) => <DataTableColumnHeader column={column} title="Bill Name" />,
        },
        {
            accessorKey: "month",
            header: ({ column }) => <DataTableColumnHeader column={column} title="Month" />,
        },
        {
            accessorKey: "amount",
            header: ({ column }) => <DataTableColumnHeader column={column} title="Amount" />,
        },
        {
            accessorKey: "dueDate",
            header: ({ column }) => <DataTableColumnHeader column={column} title="Due Date" />,
            cell: ({ row }) => new Date(row.original.dueDate).toLocaleDateString(),
        },
        {
            accessorKey: "description",
            header: ({ column }) => <DataTableColumnHeader column={column} title="Description" />,
        },
        {
            accessorKey: "classId",  // Added classId column
            header: ({ column }) => <DataTableColumnHeader column={column} title="Class ID" />,  // Updated column header
        },
        {
            id: "action",
            header: () => <div className="text-center">Action</div>,
            cell: ({ row }) => (
                <div className="flex items-center justify-center space-x-2">
                    <Link href={`/list/billings/profile?id=${row.original.id}`}>
                        <Button variant="ghost" size="icon">
                            <Eye />
                        </Button>
                    </Link>
                    <Link href={`/list/billings/manage?action=edit&id=${row.original.id}`}>
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
                        title="Delete Billing"
                        description="This action cannot be undone. This will permanently delete the billing record."
                        onDelete={() => handleDelete(row.original.id)}
                    />
                </div>
            ),
        },
    ];

    return columns;
};
