import React from 'react'
import { DataTable } from '@/components/ui/data-table';
import { Button } from '@/components/ui/button';
import { PlusCircle } from 'lucide-react';
import { columns } from './column';
import { lessonsData } from '@/lib/data';

const LessonList = () => {

  return (
    <div className="container mx-auto px-4 py-10">
      <div className='flex justify-between items-center'>
      <h1 className="text-2xl font-semibold mb-4">Lessons</h1>
      <Button className='mb-4 flex items-center'><PlusCircle/> Register Lesson</Button>
      </div>
      <DataTable columns={columns} data={lessonsData} filterableColumns={["subject", "class", "teacher"]} />
    </div>
  )
}

export default LessonList
