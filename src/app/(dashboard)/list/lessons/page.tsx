"use client";
import React from "react";
import { DataTable } from "@/components/ui/data-table";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { useQuery } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";
import { useLessonColumns } from "./column";

const LessonList = () => {
  const router = useRouter();
  const columns = useLessonColumns();

  // Fetch lessons
  const fetchLessons = async () => {
    const response = await axios.get("/api/lessons/getalllessons");
    return response.data;
  };

  const { data: lessons, isLoading } = useQuery({
    queryKey: ["lessons"],
    queryFn: fetchLessons,
  });

  return (
    <div className="container mx-auto px-4 py-10">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold mb-4">Lessons</h1>
        <Button
          className="mb-4 flex items-center"
          onClick={() => router.push("/list/lessons/manage?action=create")}
        >
          <PlusCircle className="mr-2" /> Create Lesson
        </Button>
      </div>

      {isLoading ? (
        <Loader2 className="h-10 w-10 animate-spin" />
      ) : (
        <DataTable
          columns={columns}
          data={lessons}
          filterableColumns={["name", "subject", "teacher", "class", "startTime", "endTime"]}
        />
      )}
    </div>
  );
};

export default LessonList;
