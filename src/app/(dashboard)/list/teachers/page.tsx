"use client";
import React, { useEffect, useState } from "react";
import { DataTable } from "@/components/ui/data-table";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import { useTeacherColumns } from "./columns";
import axios from "axios";
import { toast } from "sonner"; // or any toast library you use

const TeacherList = () => {
  const router = useRouter();
  const columns = useTeacherColumns();

  const [teachers, setTeachers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTeachers = async () => {
      try {
        const response = await axios.get("/api/teachers/getallteachers");
        setTeachers(response.data.data); // Assuming response.data = { success, data }
      } catch (error: any) {
        console.error("Failed to fetch teachers:", error);
        toast.error("Failed to fetch teachers");
      } finally {
        setLoading(false);
      }
    };

    fetchTeachers();
  }, []);

  return (
    <div className="container mx-auto px-4 py-10">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold mb-4">Teachers</h1>
        <Button
          className="mb-4 flex items-center"
          onClick={() => router.push("/list/teachers/manage?action=create")}
        >
          <PlusCircle className="mr-2" /> Register Teacher
        </Button>
      </div>

      {loading ? (
        <p>Loading...</p>
      ) : (
        <DataTable
          columns={columns}
          data={teachers}
          filterableColumns={[
            "id",
            "email",
            "name",
            "subject",
            "classes",
            "phone",
          ]}
        />
      )}
    </div>
  );
};

export default TeacherList;
