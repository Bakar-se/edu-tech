"use client";

import React from "react";
import { DataTable } from "@/components/ui/data-table";
import { Button } from "@/components/ui/button";
import { Loader2, PlusCircle } from "lucide-react";
import { useResultColumns } from "./column";
import { useRouter } from "next/navigation";
import axios from "axios";
import { useQuery } from "@tanstack/react-query";

// Function to fetch results data
const fetchResults = async () => {
  const response = await axios.get("/api/results/getallresults");
  return response.data.data; // Adjust based on your API response structure
};

const ResultList = () => {
  const router = useRouter();
  const columns = useResultColumns();

  const {
    data: results,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["results"],
    queryFn: fetchResults,
  });
  console.log(results)

  if (isError) {
    return <div className="text-red-500">Error fetching results. Please try again later.</div>;
  }

  return (
    <div className="container mx-auto px-4 py-10">
      {/* Header */}
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-semibold">Results</h1>
        <Button
          onClick={() => router.push("/list/results/manage?action=create")}
          className="flex items-center gap-2"
        >
          <PlusCircle className="h-5 w-5" /> Register Result
        </Button>
      </div>

      {/* Loading or Data Table */}
      {isLoading ? (
        <div className="flex justify-center items-center">
          <Loader2 className="h-10 w-10 animate-spin" />
        </div>
      ) : (
        <DataTable
          columns={columns}
          data={results}
          filterableColumns={["subject", "class", "student", "grade"]} // Use the correct column names for filtering
        />
      )}
    </div>
  );
};

export default ResultList;
