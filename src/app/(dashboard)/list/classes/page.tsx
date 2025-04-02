"use client"
import React from 'react'
import { DataTable } from '@/components/ui/data-table';
import { Button } from '@/components/ui/button';
import { PlusCircle } from 'lucide-react';
import { classesData } from '@/lib/data';
import { useClassColumns } from './column';

const StudentList = () => {
  const columns = useClassColumns();

  return (
    <div className="container mx-auto px-4 py-10">
      <div className='flex justify-between items-center'>
        <h1 className="text-2xl font-semibold mb-4">Classes</h1>
        <Button className='mb-4 flex items-center'><PlusCircle /> Register Class</Button>
      </div>
      <DataTable columns={columns} data={classesData} filterableColumns={["name", "capacity", "grade", "supervisor"]} />
    </div>
  )
}

export default StudentList