"use client"
import React from 'react'
import { DataTable } from '@/components/ui/data-table';
import { Button } from '@/components/ui/button';
import { PlusCircle } from 'lucide-react';
import { useExamColumns } from './column';
import { examsData } from '@/lib/data';

const ExamList = () => {
  const columns = useExamColumns()
  return (
    <div className="container mx-auto px-4 py-10">
      <div className='flex justify-between items-center'>
        <h1 className="text-2xl font-semibold mb-4">Exams</h1>
        <Button className='mb-4 flex items-center'><PlusCircle /> Register Exam</Button>
      </div>
      <DataTable columns={columns} data={examsData} filterableColumns={["subject", "class", "teacher", "date"]} />
    </div>
  )
}

export default ExamList