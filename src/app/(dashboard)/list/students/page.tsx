"use client"
import React, { useEffect, useState } from "react";
import { DataTable } from '@/components/ui/data-table';
import { Button } from '@/components/ui/button';
import { Loader2, PlusCircle } from 'lucide-react';
import { studentsData } from '@/lib/data';
import { useStudentColumns } from './columns';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import { useQuery } from '@tanstack/react-query';

const StudentList = () => {
  const columns = useStudentColumns();
  const router = useRouter()

  const fetchStudents = async () => {
    const response = await axios.get("/api/students/getallstudents");
    return response.data.data;
  };

  const {
    data: students,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["students"],
    queryFn: fetchStudents,
  });

  return (
    <div className="container mx-auto px-4 py-10">

      <div className='flex justify-between items-center'>
        <h1 className="text-2xl font-semibold mb-4">Students</h1>
        <Button onClick={() => router.push("/list/students/manage?action=create")} className='mb-4 flex items-center'><PlusCircle /> Register Student</Button>
      </div>
      {isLoading ? (
        <Loader2 className="h-10 w-10 animate-spin" />
      ) : (
        <DataTable columns={columns} data={students} filterableColumns={["studentId",
          "email",
          "name",
          "grade",
          "class",
          "phone"]} />)}
    </div>
  )
}

export default StudentList
