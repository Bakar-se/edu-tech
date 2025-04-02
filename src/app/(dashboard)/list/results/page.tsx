"use client"
import React from 'react'
import { DataTable } from '@/components/ui/data-table';
import { Button } from '@/components/ui/button';
import { PlusCircle } from 'lucide-react';
import { useResultColumns } from './column';
import { resultsData } from '@/lib/data';

const ResultList = () => {
  const columns = useResultColumns();

  return (
    <div className="container mx-auto px-4 py-10">
      <div className='flex justify-between items-center'>
        <h1 className="text-2xl font-semibold mb-4">Results</h1>
        <Button className='mb-4 flex items-center'><PlusCircle /> Register Result</Button>
      </div>
      <DataTable columns={columns} data={resultsData} filterableColumns={["subject", "class", "teacher", "student", "date", "type", "score"]} />
    </div>
  )
}

export default ResultList