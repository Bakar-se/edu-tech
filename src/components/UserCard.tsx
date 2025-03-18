import React from 'react'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from './ui/card'
import { Activity } from 'lucide-react'

const UserCard = ({type}: {type: string}) => {
  return (
    <Card className='roundeded-2xl flex-1 min-w-[130px]'>
  <CardContent className='flex justify-between items-center'>
    <p className='text-[10px] px-2 py-1 rounded-full border'>2024/25</p>
    <Activity width={20} height={20} />
  </CardContent>
  <CardHeader>
    <CardTitle className='text-2xl font-semibold my-4'>1,234</CardTitle>
    <CardDescription className='capitalize text-sm font-medium'>
        {type}
    </CardDescription>
  </CardHeader>
</Card>

  )
}

export default UserCard
