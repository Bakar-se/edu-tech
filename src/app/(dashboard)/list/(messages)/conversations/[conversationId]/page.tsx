"use client";
import ConversationContainer from "@/components/shared/conversation/ConversationContainer";
import { useQuery } from "convex/react";
import React from "react";
import { Id } from "../../../../../../../convex/_generated/dataModel";
import { api } from "../../../../../../../convex/_generated/api";
import { useAuth } from "@clerk/nextjs";
import { Loader2 } from "lucide-react";
import Header from "./Header";
import ChatInput from "./_components/input/ChatInput";
import Body from "./_components/body/Body";

type Props = {
  params: Promise<{ conversationId: Id<"conversations"> }>;
};

const SingleConversationPage = (props: Props) => {
  const params = React.use(props.params);
  const { userId } = useAuth();

  const conversation = useQuery(
    api.conversation.get,
    userId ? { clerkId: userId, id: params.conversationId } : "skip"
  );

  return conversation === undefined ? (
    <div className="w-full h-full flex items-center">
      <Loader2 className="h-8 w-8 animate-spin" />
    </div>
  ) : conversation === null ? (
    <p className="w-full h-full flex items-center">conversation not found</p>
  ) : (
    <ConversationContainer>
      <Header
        name={
          (conversation.isGroup
            ? conversation.name
            : conversation.otherMember.username) || ""
        }
      />
      <Body />
      <ChatInput />
    </ConversationContainer>
  );
};

export default SingleConversationPage;
