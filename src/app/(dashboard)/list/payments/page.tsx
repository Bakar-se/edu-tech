"use client";
import React from "react";
import { DataTable } from "@/components/ui/data-table";
import { Button } from "@/components/ui/button";
import { Loader2, PlusCircle } from "lucide-react";
import { useRouter } from "next/navigation";

import axios from "axios";
import { toast } from "sonner";
import { useQuery } from "@tanstack/react-query";
import { usePaymentColumns } from "./column"; // Make sure you have this file
import { useUser } from "@clerk/nextjs";

const PaymentList = () => {
  const router = useRouter();
  const columns = usePaymentColumns();
  const { user } = useUser();
  const role = user?.publicMetadata.role as string | undefined;

  const fetchPayments = async () => {
    const response = await axios.get("/api/payments/getallpayments");
    return response.data.data;
  };

  const {
    data: payments,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["payments"],
    queryFn: fetchPayments,
  });

  return (
    <div className="container mx-auto px-4 py-10">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold mb-4">Payment Records</h1>
        {role === "admin" && (
          <Button
            className="mb-4 flex items-center"
            onClick={() => router.push("/list/payments/manage?action=create")}
          >
            <PlusCircle className="mr-2" /> Add Payment
          </Button>
        )}
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center">
          <Loader2 className="h-10 w-10 animate-spin" />
          <span className="ml-2">Loading...</span>
        </div>
      ) : isError ? (
        <div className="text-red-500">
          Error loading payment records. Please try again later.
        </div>
      ) : (
        <DataTable
          columns={columns}
          data={payments}
          filterableColumns={[
            "studentId",
            "billingId",
            "method",
            "paymentDate",
          ]} // Customize as needed
        />
      )}
    </div>
  );
};

export default PaymentList;
