import React from 'react'
import Announcements from '@/components/Announcements';
import BigCalendar from '@/components/BigCalendar'


const Parent = () => {
    return (
        <div className='p-4 flex gap-4 flex-col xl:flex-row'>
            <div className='w-full xl:w-2/3'>
            <h1 className='text-2xl font-bold'>Schedule (Child 1)</h1>
            <BigCalendar />
            </div>
            <div className='w-full lg:w-1/3 flex flex-col gap-8'>
            <Announcements />
            </div>

        </div>
    )
}

export default Parent
