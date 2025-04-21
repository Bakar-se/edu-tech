"use client";
import React from "react";
import { DataTable } from "@/components/ui/data-table";
import { Button } from "@/components/ui/button";
import { Loader2, PlusCircle } from "lucide-react";
import { classesData } from "@/lib/data";
import { useClassColumns } from "./column";
import { useRouter } from "next/navigation";
import axios from "axios";
import { useQuery } from "@tanstack/react-query";

const StudentList = () => {
  const router = useRouter();
  const columns = useClassColumns();

  const fetchTeachers = async () => {
    const response = await axios.get("/api/classes/getallclasses");
    return response.data.data;
  };

  const {
    data: classes,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["classes"],
    queryFn: fetchTeachers,
  });

  console.log(classes);

  return (
    <div className="container mx-auto px-4 py-10">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold mb-4">Classes</h1>
        <Button
          onClick={() => router.push("/list/classes/manage?action=create")}
          className="mb-4 flex items-center"
        >
          <PlusCircle /> Register Class
        </Button>
      </div>
      {isLoading ? (
        <Loader2 className="h-10 w-10 animate-spin" />
      ) : (
        <DataTable
          columns={columns}
          data={classes}
          filterableColumns={["name", "capacity", "grade", "supervisor"]}
        />
      )}
    </div>
  );
};

export default StudentList;
