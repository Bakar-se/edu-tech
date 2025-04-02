import Navbar from '@/components/Navbar'
import { AppSidebar } from '@/components/ui/app-sidebar'
import { SidebarProvider } from '@/components/ui/sidebar'
import { Toaster } from '@/components/ui/sonner'
import React from 'react'

const DashboardLayout = ({ children }: Readonly<{ children: React.ReactNode }>) => {
    return (
        <SidebarProvider>
            <AppSidebar />
            <main className='w-full'>
                <Navbar />
                {children}
            </main>
            <Toaster richColors />
        </SidebarProvider>
    )
}

export default DashboardLayout
