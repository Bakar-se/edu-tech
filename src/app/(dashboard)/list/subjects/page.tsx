"use client";
import React, { useEffect, useState } from "react";
import { DataTable } from "@/components/ui/data-table";
import { Button } from "@/components/ui/button";
import { Loader2, PlusCircle } from "lucide-react";
import { useSubjectColumns } from "./column";
import { subjectsData } from "@/lib/data";
import { useRouter } from "next/navigation";
import axios from "axios";
import { useQuery } from "@tanstack/react-query";
import { useUser } from "@clerk/nextjs";

const SubjectList = () => {
  const router = useRouter();
  const columns = useSubjectColumns();
  const { user } = useUser();
  const role = user?.publicMetadata.role as string | undefined;

  const fetchSubjects = async () => {
    const response = await axios.get("/api/subjects/getallsubjects");
    return response.data;
  };

  const {
    data: subjects,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["subjects"],
    queryFn: fetchSubjects,
  });

  return (
    <div className="container mx-auto px-4 py-10">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold mb-4">Subjects</h1>
        {role === "admin" && (
          <Button
            className="mb-4 flex items-center"
            onClick={() => router.push("/list/subjects/manage?action=create")}
          >
            <PlusCircle /> Register Subject
          </Button>
        )}
      </div>
      {isLoading ? (
        <Loader2 className="h-10 w-10 animate-spin" />
      ) : (
        <DataTable
          columns={columns}
          data={subjects}
          filterableColumns={["name", "teachers"]}
        />
      )}
    </div>
  );
};
export default SubjectList;
