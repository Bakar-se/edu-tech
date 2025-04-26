import React from "react";
import { Id } from "../../../../../../../convex/_generated/dataModel";
import { useQuery } from "convex/react";
import { api } from "../../../../../../../convex/_generated/api";
import { useAuth } from "@clerk/nextjs";
import Link from "next/link";
import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { User } from "lucide-react";
import { Badge } from "@/components/ui/badge";

type Props = {
  id: string;
  imageUrl?: string;
  username: string;
  email?: string;
  lastMessageSender?: string;
  lastMessageContent?: string;
  unseenCount: number;
};

const DMConversationItem = (props: Props) => {
  return (
    <Link href={`/list/conversations/${props.id}`} className="w-full">
      <Card className="p-2 flex flex-row items-center justify-between">
        <div className="flex flex-row items-center gap-4 truncate">
          <Avatar>
            <AvatarImage src={props.imageUrl} />
            <AvatarFallback>
              <User />
            </AvatarFallback>
          </Avatar>
          <div className="flex flex-col truncate">
            <h4 className="truncate">{props?.username}</h4>
            {props.lastMessageSender && props.lastMessageContent ? (
              <span className="text-sm text-muted-foreground flex truncate overflow-ellipsis">
                <p className="font-semibold">
                  {props.lastMessageSender}
                  {":"}&nbsp;
                </p>
                <p className="truncate overflow-ellipsis"></p>
              </span>
            ) : (
              <p className="text-sm text-muted-foreground truncate">
                Start conversation!
              </p>
            )}
          </div>
        </div>
        {props.unseenCount ? <Badge>{props.unseenCount}</Badge> : null}
      </Card>
    </Link>
  );
};

export default DMConversationItem;
