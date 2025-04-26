"use client";
import React from "react";
import { DataTable } from "@/components/ui/data-table";
import { Button } from "@/components/ui/button";
import { Loader2, PlusCircle } from "lucide-react";
import { assignmentsData, classesData } from "@/lib/data";
import { useRouter } from "next/navigation";
import axios from "axios";
import { useQuery } from "@tanstack/react-query";
import { useAssignmentColumns } from "./column";

const AssignmentList = () => {
  const router = useRouter();
  const columns = useAssignmentColumns();

  const fetchLessons = async () => {
    const response = await axios.get("/api/assignments/getallassignments");
    return response.data;
  };

  const {
    data: assignments,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["assignments"],
    queryFn: fetchLessons,
  });

  return (
    <div className="container mx-auto px-4 py-10">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold mb-4">Assignments</h1>
        <Button
          onClick={() => router.push("/list/assignments/manage?action=create")}
          className="mb-4 flex items-center"
        >
          <PlusCircle /> Register Assignment
        </Button>
      </div>
      {isLoading ? (
        <Loader2 className="h-10 w-10 animate-spin" />
      ) : (
        <DataTable
          columns={columns}
          data={assignments}
          filterableColumns={["subject", "class", "teacher", "dueDate"]}
        />
      )}
    </div>
  );
};
export default AssignmentList;
