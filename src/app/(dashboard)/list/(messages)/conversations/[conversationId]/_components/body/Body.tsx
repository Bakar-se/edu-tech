"use client";
import { useConversation } from "@/hooks/useConversation";
import { useQuery } from "convex/react";
import React, { useEffect } from "react";
import { api } from "../../../../../../../../../convex/_generated/api";
import { Id } from "../../../../../../../../../convex/_generated/dataModel";
import { useAuth } from "@clerk/nextjs";
import Message from "./Message";
import { useMutationState } from "@/hooks/useMutationState";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

type Props = {
  members: {
    lastSeenMessageId?: Id<"messages">;
    username?: string;
    [key: string]: any;
  }[];
};

const Body = ({ members }: Props) => {
  const { userId } = useAuth();
  const { conversationId } = useConversation();

  const messages = useQuery(
    api.messages.get,
    conversationId && userId
      ? {
          id: conversationId as Id<"conversations">,
          clerkId: userId,
        }
      : "skip"
  );

  const { mutate: markRead } = useMutationState(api.conversation.markRead);

  useEffect(() => {
    if (messages && messages.length > 0) {
      markRead({
        conversationId,
        messageId: messages[0].message._id,
        clerkId: userId,
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [messages?.length, conversationId, markRead]);

  return (
    <div className="flex-1 w-full flex overflow-y-scroll flex-col-reverse gap-2 p-3no-scrollbar">
      {messages?.map((message: any, index) => {
        const lastByUser =
          messages[index - 1]?.message.senderId === message.senderId;

        const getSeenMessage = (messageId: Id<"messages">) => {
          const seenUsers = members
            .filter((member) => member.lastSeenMessageId === messageId)
            .map((user) => user.username!.split(" ")[0]);

          if (seenUsers.length === 0) return undefined;

          const formatSeenBy = (names: string[]) => {
            switch (names.length) {
              case 1:
                return (
                  <p className="text-muted-foreground text-sm text-right">{`Seen`}</p>
                );
              case 2:
                return (
                  <p className="text-muted-foreground text-sm text-right">{`Seen by ${names[0]} and ${names[1]}`}</p>
                );
              default:
                return (
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger>
                        <p className="text-muted-foreground text-sm text-right">
                          {`Seen by ${names[0]}, ${names[1]}, and ${names.length - 2} more`}
                        </p>
                      </TooltipTrigger>
                      <TooltipContent>
                        <ul>
                          {names.map((name, index) => {
                            return <li key={index}>{name}</li>;
                          })}
                        </ul>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                );
            }
          };

          return formatSeenBy(seenUsers);
        };

        const seenMessage = message.isCurrentUser
          ? getSeenMessage(message._id)
          : undefined;

        return (
          <Message
            key={message.message._id}
            fromCurrentUser={message.isCurrentUser}
            senderImage={message.senderImage}
            senderName={message.senderName}
            lastByUser={message.lastByUser}
            content={message.message.content}
            createdAt={message.message._creationTime}
            seen={seenMessage}
            type={message.message.type}
          />
        );
      })}
    </div>
  );
};

export default Body;
