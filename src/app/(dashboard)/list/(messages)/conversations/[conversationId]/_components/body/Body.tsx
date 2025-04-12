"use client";
import { useConversation } from "@/hooks/useConversation";
import { useQuery } from "convex/react";
import React from "react";
import { api } from "../../../../../../../../../convex/_generated/api";
import { Id } from "../../../../../../../../../convex/_generated/dataModel";
import { useAuth } from "@clerk/nextjs";
import Message from "./Message";

type Props = {};

const Body = (props: Props) => {
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

  return (
    <div className="flex-1 w-full flex overflow-y-scroll flex-col-reverse gap-2 p-3no-scrollbar">
      {messages?.map((message: any, index) => {
        const lastByUser =
          messages[index - 1]?.message.senderId === message.senderId;
        console.log(messages);
        return (
          <Message
            key={message.message._id}
            fromCurrentUser={message.isCurrentUser}
            senderImage={message.senderImage}
            senderName={message.senderName}
            lastByUser={message.lastByUser}
            content={message.message.content}
            createdAt={message.message._creationTime}
            type={message.message.type}
          />
        );
      })}
    </div>
  );
};

export default Body;
