import Navbar from '@/components/Navbar'
import { AppSidebar } from '@/components/ui/app-sidebar'
import { SidebarProvider } from '@/components/ui/sidebar'
import React from 'react'

const DashboardLayout = ({ children }: Readonly<{ children: React.ReactNode }>) => {
    return (
        <SidebarProvider>
            <AppSidebar />
            <main className='w-full'>
                <Navbar />
                {children}
            </main>
        </SidebarProvider>
    )
}

export default DashboardLayout
