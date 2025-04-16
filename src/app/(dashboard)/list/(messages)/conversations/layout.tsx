"use client";
import ItemList from "@/components/shared/item-list/ItemList";
import React from "react";
import { api } from "../../../../../../convex/_generated/api";
import { useAuth } from "@clerk/nextjs";
import { useQuery } from "convex/react";
import { Loader2 } from "lucide-react";
import DMConversationItem from "../people/_components/DMConversationItem";
import CreateGroupDialog from "./[conversationId]/_components/dialogs/CreateGroupDialog";
import GroupConversationItem from "../people/_components/GroupConversationItem";

type Props = React.PropsWithChildren<{}>;

const ConversationsLayout = ({ children }: Props) => {
  const { userId } = useAuth();

  const conversations = useQuery(
    api.conversations.get,
    userId ? { clerkId: userId } : "skip"
  );

  return (
    <>
      <ItemList title="Conversations" action={<CreateGroupDialog />}>
        {conversations ? (
          conversations.length === 0 ? (
            <p className="w-full h-full flex items-center justify-center">
              {" "}
              No conversations found{" "}
            </p>
          ) : (
            conversations.map((conversations: any) => {
              return conversations.conversation.isGroup ? <GroupConversationItem
              key={conversations.conversation._id}
              id={conversations.conversation._id}
              name={conversations.conversation.name || ""}
              lastMessageSender={conversations.lastMessage?.sender}
              lastMessageContent={conversations.lastMessage?.content}
              unseenCount={conversations.unseenCount}
            /> : (
                <DMConversationItem
                  key={conversations.conversation._id}
                  id={conversations.conversation._id}
                  username={conversations.otherMember.username || ""}
                  imageUrl={conversations.otherMember.imageUrl}
                  lastMessageSender={conversations.lastMessage?.sender}
                  lastMessageContent={conversations.lastMessage?.content}
              unseenCount={conversations.unseenCount}

                />
              );
            })
          )
        ) : (
          <Loader2 className="h-8 w-8 animate-spin" />
        )}
      </ItemList>
      {children}
    </>
  );
};

export default ConversationsLayout;
