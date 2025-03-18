import React from 'react'
import { DataTable } from '@/components/ui/data-table';
import { Button } from '@/components/ui/button';
import { PlusCircle } from 'lucide-react';
import { columns } from './column';
import { announcementsData } from '@/lib/data';

const StudentList = () => {

  return (
    <div className="container mx-auto px-4 py-10">
      <div className='flex justify-between items-center'>
      <h1 className="text-2xl font-semibold mb-4">Announcements</h1>
      <Button className='mb-4 flex items-center'><PlusCircle/> Register Announcement</Button>
      </div>
      <DataTable columns={columns} data={announcementsData} filterableColumns={["title", "class", "date"]} />
    </div>
  )
}

export default StudentList
