"use client";
import React from "react";
import { DataTable } from "@/components/ui/data-table";
import { Button } from "@/components/ui/button";
import { Loader2, PlusCircle } from "lucide-react";
import { useRouter } from "next/navigation";

import axios from "axios";
import { toast } from "sonner";
import { useQuery } from "@tanstack/react-query";
import { useBillingColumns } from "./column";

const BillingList = () => {
    const router = useRouter();
    const columns = useBillingColumns();

    const fetchBillings = async () => {
        const response = await axios.get("/api/billings/getallbillings");
        return response.data.data;
    };

    const {
        data: billings,
        isLoading,
        isError,
    } = useQuery({
        queryKey: ["billings"],
        queryFn: fetchBillings,
    });

    return (
        <div className="container mx-auto px-4 py-10">
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-semibold mb-4">Billing Records</h1>
                <Button
                    className="mb-4 flex items-center"
                    onClick={() => router.push("/list/billings/manage?action=create")}
                >
                    <PlusCircle className="mr-2" /> Create Bill
                </Button>
            </div>

            {isLoading ? (
                <div className="flex justify-center items-center">
                    <Loader2 className="h-10 w-10 animate-spin" />
                    <span className="ml-2">Loading...</span>
                </div>
            ) : isError ? (
                <div className="text-red-500">Error loading billing records. Please try again later.</div>
            ) : (
                <DataTable
                    columns={columns}
                    data={billings}
                    filterableColumns={["month", "student.name", "billName", "amount", "dueDate", "classId"]} // Filterable columns based on the form data
                />
            )}
        </div>
    );
};

export default BillingList;
