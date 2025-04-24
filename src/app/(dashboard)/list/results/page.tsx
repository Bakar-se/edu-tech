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
  return response.data.data; // Adjust based on your actual API response structure
};

const ResultList = () => {
  const router = useRouter();
  const columns = useResultColumns(); // Assuming this function defines columns for the DataTable

  const fetchStudents = async () => {
    const response = await axios.get("/api/results/getallresults");
    return response.data.data;
  };

  const fetchExams = async () => {
    const response = await axios.get("/api/results/getallresults");
    return response.data.data;
  };
  // Fetching results data using React Query
  const {
    data: results,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["results"],
    queryFn: fetchResults,
  });

  // If there's an error while fetching results, show an error message
  if (isError) {
    return <div>Error fetching results. Please try again later.</div>;
  }

  return (
    <div className="container mx-auto px-4 py-10">
      {/* Header with title and register result button */}
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold mb-4">Results</h1>
        <Button
          onClick={() => router.push("/list/results/manage?action=create")}
          className="mb-4 flex items-center"
        >
          <PlusCircle /> Register Result
        </Button>
      </div>

      {/* Display loading spinner if results are being fetched */}
      {isLoading ? (
        <Loader2 className="h-10 w-10 animate-spin" />
      ) : (
        // Display the data table once data is loaded
        <DataTable
          columns={columns}
          data={results}
          filterableColumns={["subject", "class", "teacher", "student", "date", "type", "score"]} // Filterable columns
        />
      )}
    </div>
  );
};

export default ResultList;