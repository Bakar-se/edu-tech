"use client";
import React from "react";
import { DataTable } from "@/components/ui/data-table";
import { Button } from "@/components/ui/button";
import { Loader2, PlusCircle } from "lucide-react";
import { classesData, examsData } from "@/lib/data";

import { useRouter } from "next/navigation";
import axios from "axios";
import { useQuery } from "@tanstack/react-query";
import { useExamColumns } from "./column";

const ExamList = () => {
  const router = useRouter();
  const columns = useExamColumns()

  const fetchLessons = async () => {
    const response = await axios.get("/api/exmas/getallexams");
    return response.data.data;
  };

  const {
    data: exams,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["exams"],
    queryFn: fetchLessons,
  });


  return (
    <div className="container mx-auto px-4 py-10">
      <div className='flex justify-between items-center'>
        <h1 className="text-2xl font-semibold mb-4">Exams</h1>
        <Button
          onClick={() => router.push("/list/exams/manage?action=create")}
          className="mb-4 flex items-center"
        ><PlusCircle /> Register Exam</Button>
      </div>
      {isLoading ? (
        <Loader2 className="h-10 w-10 animate-spin" />
      ) : (
        <DataTable columns={columns} data={examsData} filterableColumns={["subject", "class", "teacher", "date"]} />)}
    </div>
  )
}

export default ExamList