"use client"
import React, { use } from 'react'
import { DataTable } from '@/components/ui/data-table';
import { Button } from '@/components/ui/button';
import { PlusCircle } from 'lucide-react';
import { useSubjectColumns } from './column';
import { subjectsData } from '@/lib/data';

const SubjectList = () => {
  const columns = useSubjectColumns();

  return (
    <div className="container mx-auto px-4 py-10">
      <div className='flex justify-between items-center'>
        <h1 className="text-2xl font-semibold mb-4">Subjects</h1>
        <Button className='mb-4 flex items-center'><PlusCircle /> Register Subject</Button>
      </div>
      <DataTable columns={columns} data={subjectsData} filterableColumns={["name", "teachers"]} />
    </div>
  )
}

export default SubjectList