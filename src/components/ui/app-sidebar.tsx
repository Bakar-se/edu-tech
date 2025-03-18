
import MenuItems from "../MenuItems";
import { Sidebar, SidebarContent, SidebarGroup } from "./sidebar";


export function AppSidebar() {
    return (
        <Sidebar collapsible="icon">
            <SidebarContent>
                <div className="pt-4 px-4 text-lg font-bold">
                    Edu-Tech
                </div>
                <SidebarGroup>
                    <MenuItems />
                </SidebarGroup>
            </SidebarContent>
        </Sidebar>
    )
}
