"use client"
import React from 'react'
import { DataTable } from '@/components/ui/data-table';
import { Button } from '@/components/ui/button';
import { PlusCircle } from 'lucide-react';
import { teachersData } from '@/lib/data';
import { useRouter } from 'next/navigation';
import { columns } from './columns';

const TeacherList = () => {
  const router = useRouter()

  return (
    <div className="container mx-auto px-4 py-10">

      <div className='flex justify-between items-center'>
      <h1 className="text-2xl font-semibold mb-4">Teachers</h1>
      <Button className='mb-4 flex items-center' onClick={() => router.push("/list/teachers/manage?action=create")}><PlusCircle/> Register Teacher</Button>
      </div>
      <DataTable columns={columns} data={teachersData} filterableColumns={["teacherId","email", "name", "subject", "classes", "phone"]} />
    </div>
  )
}

export default TeacherList
