import React from 'react'
import { menuItems } from './Menu'
import { SidebarMenuItem, SidebarMenuButton, SidebarGroupLabel, SidebarGroupContent, SidebarMenu } from './ui/sidebar'
import Link from 'next/link'
import { currentUser } from '@clerk/nextjs/server'

const MenuItems = async () => {

    const user = await currentUser();
    const role = user?.publicMetadata.role as string;

    return (
        <div>{menuItems.map((item) => (
            <div key={item.title}>
                <SidebarGroupLabel>{item.title}</SidebarGroupLabel>
                <SidebarGroupContent>
                    <SidebarMenu>
                        {item.items.map((subItem) => {
                            if (subItem.visible.includes(role)) {
                                return (
                                    <SidebarMenuItem key={subItem.href}>
                                        <SidebarMenuButton asChild>
                                            <Link href={subItem.href}>
                                                {React.cloneElement(subItem.icon)}
                                                <span>{subItem.label}</span>
                                            </Link>
                                        </SidebarMenuButton>
                                    </SidebarMenuItem>
                                )
                            }
                        })}
                    </SidebarMenu>
                </SidebarGroupContent>
            </div>
        ))}</div>
    )
}

export default MenuItems