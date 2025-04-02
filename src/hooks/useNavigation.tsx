import { MessageSquare, Users } from "lucide-react";
import { usePathname } from "next/navigation"
import { useMemo } from "react";

export const useNavigation = () => {
    const pathname = usePathname();

    const paths = useMemo(() => [
        {
            name: "Messages",
            href: "/list/conversations",
            icon: <MessageSquare />,
            active: pathname.startsWith("/list/messages"),
        },
        {
            name: "People",
            href: "/list/people",
            icon: <Users />,
            active: pathname.startsWith("/list/messages/friends"),
        }
    ], [pathname])

    return paths;
}