import React from 'react'
import { menuItems } from './Menu'
import { SidebarMenuItem, SidebarMenuButton } from './ui/sidebar'

const MenuItems = () => {
    return (
        <div>{menuItems.map((item) => (
            <SidebarGroupLabel key={}>Edu-Tech</SidebarGroupLabel>
                    <SidebarGroupContent>
                        <SidebarMenu>
                            {items.map((item) => (
                                <SidebarMenuItem key={item.title}>
                                    <SidebarMenuButton asChild>
                                        <a href={item.url}>
                                            <item.icon />
                                            <span>{item.title}</span>
                                        </a>
                                    </SidebarMenuButton>
                                </SidebarMenuItem>
                            ))}
                        </SidebarMenu>
                    </SidebarGroupContent>
        ))}</div>
    )
}

export default MenuItems