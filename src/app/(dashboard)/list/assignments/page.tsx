import React from 'react'
import { DataTable } from '@/components/ui/data-table';
import { Button } from '@/components/ui/button';
import { PlusCircle } from 'lucide-react';
import { columns } from './column';
import { assignmentsData } from '@/lib/data';

const AssignmentList = () => {

  return (
    <div className="container mx-auto px-4 py-10">
      <div className='flex justify-between items-center'>
      <h1 className="text-2xl font-semibold mb-4">Assignments</h1>
      <Button className='mb-4 flex items-center'><PlusCircle/> Register Assignment</Button>
      </div>
      <DataTable columns={columns} data={assignmentsData} filterableColumns={["subject", "class", "teacher", "dueDate"]} />
    </div>
  )
}

export default AssignmentList
