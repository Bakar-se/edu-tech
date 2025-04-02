"use client"
import React from 'react'
import { DataTable } from '@/components/ui/data-table';
import { Button } from '@/components/ui/button';
import { PlusCircle } from 'lucide-react';
import { studentsData } from '@/lib/data';
import { useStudentColumns } from './columns';

const StudentList = () => {
  const columns = useStudentColumns();

  return (
    <div className="container mx-auto px-4 py-10">

      <div className='flex justify-between items-center'>
        <h1 className="text-2xl font-semibold mb-4">Students</h1>
        <Button className='mb-4 flex items-center'><PlusCircle /> Register Student</Button>
      </div>
      <DataTable columns={columns} data={studentsData} filterableColumns={["studentId", "email", "name", "grade", "class", "phone"]} />
    </div>
  )
}

export default StudentList
