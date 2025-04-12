import { useQuery } from "convex/react";
import { MessageSquare, Users } from "lucide-react";
import { usePathname } from "next/navigation"
import { useMemo } from "react";
import { api } from "../../convex/_generated/api";
import { useAuth } from "@clerk/nextjs";

export const useNavigation = () => {
    const pathname = usePathname();
    const { userId } = useAuth()

    const requestCount = useQuery(api.requests.count, { clerkId: userId as string });

    const paths = useMemo(() => [
        {
            name: "Messages",
            href: "/list/conversations",
            icon: <MessageSquare />,
            active: pathname.startsWith("/list/conversations"),
        },
        {
            name: "People",
            href: "/list/people",
            icon: <Users />,
            active: pathname.startsWith("/list/people"),
            count: requestCount
        }
    ], [pathname, requestCount]);

    return paths;
}