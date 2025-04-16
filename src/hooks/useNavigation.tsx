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
    const conversations = useQuery(api.conversations.get, userId ? { clerkId: userId } : "skip")
    const unseenMessagesCount = useMemo(() => {
        return conversations?.reduce((acc, curr) => {
            return acc + curr.unseenCount;
        }, 0)
    }, [conversations])

    const paths = useMemo(() => [
        {
            name: "Messages",
            href: "/list/conversations",
            icon: <MessageSquare />,
            active: pathname.startsWith("/list/conversations"),
            count: unseenMessagesCount
        },
        {
            name: "People",
            href: "/list/people",
            icon: <Users />,
            active: pathname.startsWith("/list/people"),
            count: requestCount
        }
    ], [pathname, requestCount, unseenMessagesCount]);

    return paths;
}