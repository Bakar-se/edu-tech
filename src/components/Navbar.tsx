import { Megaphone, MessageCircle } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar"
import { SidebarTrigger } from "./ui/sidebar"
import { Input } from "./ui/input"

const Navbar = () => {
  return (
    <div className='flex items-center justify-between p-4 border-b'>
        <SidebarTrigger />

      {/* SEARCH BAR */}
        <Input type="text" placeholder="Search..." className="w-1/3 p-2 bg-transparent rounded-full ml-4"/>
      {/* ICONS AND USER */}
      <div className='flex items-center gap-6 justify-end w-full'>
        <div className='bg-white rounded-full w-7 h-7 flex items-center justify-center cursor-pointer'>
        <MessageCircle />
        </div>
        <div className='bg-white rounded-full w-7 h-7 flex items-center justify-center cursor-pointer relative'>
        <Megaphone />
          <div className='absolute -top-1 -right-1 w-5 h-5 flex items-center justify-center bg-primary text-white rounded-full text-xs'>1</div>
        </div>
        <div className="flex items-center gap-4 hover:bg-neutral-100 p-2 rounded transition-all">
        <div className='flex flex-col'>
          <span className="text-xs leading-3 font-medium">John Doe</span>
          <span className="text-sm text-gray-500 text-right">Admin</span>
        </div>
        <Avatar className="w-10 h-10">
      <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
      <AvatarFallback>AD</AvatarFallback>
    </Avatar>
        </div>
      </div>
    </div>
  )
}

export default Navbar
