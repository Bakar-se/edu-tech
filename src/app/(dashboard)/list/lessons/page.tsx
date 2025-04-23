"use client";
import React from "react";
import { DataTable } from "@/components/ui/data-table";
import { Button } from "@/components/ui/button";
import { Loader2, PlusCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { useQuery } from "@tanstack/react-query";
import { useLessonColumns } from "./column";

const LessonList = () => {
  const router = useRouter();
  const columns = useLessonColumns();

  // Fetch lessons
  const fetchLessons = async () => {
    const response = await axios.get("/api/lessons/getalllessons");
    return response.data.data;
  };

  // Fetch teachers
  const fetchTeachers = async () => {
    const response = await axios.get("/api/teachers/getallteachers");
    return response.data.data;
  };

  // Fetch subjects
  const fetchSubjects = async () => {
    const response = await axios.get("/api/subjects/getallsubjects");
    return response.data.data;
  };

  const {
    data: lessons,
    isLoading: loadingLessons,
    isError: errorLessons,
  } = useQuery({ queryKey: ["lessons"], queryFn: fetchLessons });

  const {
    data: teachers,
    isLoading: loadingTeachers,
    isError: errorTeachers,
  } = useQuery({ queryKey: ["teachers"], queryFn: fetchTeachers });

  const {
    data: subjects,
    isLoading: loadingSubjects,
    isError: errorSubjects,
  } = useQuery({ queryKey: ["subjects"], queryFn: fetchSubjects });

  const isLoading = loadingLessons || loadingTeachers || loadingSubjects;
  const isError = errorLessons || errorTeachers || errorSubjects;

  return (
    <div className="container mx-auto px-4 py-10">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold mb-4">Lessons</h1>
        <Button
          onClick={() => router.push("/list/lessons/manage?action=create")}
          className="mb-4 flex items-center gap-2"
        >
          <PlusCircle className="w-4 h-4" />
          Register Lesson
        </Button>
      </div>

      {isLoading ? (
        <Loader2 className="h-10 w-10 animate-spin" />
      ) : isError ? (
        <p className="text-red-500">Failed to load data. Please try again.</p>
      ) : (
        <DataTable
          columns={columns}
          data={lessons}
          filterableColumns={["subject", "class", "teacher"]}
        />
      )}
    </div>
  );
};

export default LessonList;
