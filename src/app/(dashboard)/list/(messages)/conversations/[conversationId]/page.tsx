"use client";

import ConversationContainer from "@/components/shared/conversation/ConversationContainer";
import { useQuery } from "convex/react";
import React, { useEffect, useState } from "react";
import { Id } from "../../../../../../../convex/_generated/dataModel";
import { api } from "../../../../../../../convex/_generated/api";
import { useAuth } from "@clerk/nextjs";
import { Loader2 } from "lucide-react";
import Header from "./_components/Header";
import ChatInput from "./_components/input/ChatInput";
import Body from "./_components/body/Body";
import RemoveFriendDialog from "./_components/dialogs/RemoveFriendDialog";
import DeleteGroupDialog from "./_components/dialogs/DeleteGroupDialog";
import LeaveGroupDialog from "./_components/dialogs/LeaveGroupDialog";

type Props = {
  params: Promise<{ conversationId: Id<"conversations"> }>; // 🤖 correct type
};

const SingleConversationPage = ({ params }: Props) => {
  const unwrappedParams = React.use(params); // ✅ unwrap the params Promise

  const { userId } = useAuth();

  const conversation = useQuery(
    api.conversation.get,
    userId ? { clerkId: userId, id: unwrappedParams.conversationId } : "skip"
  );

  const [removeFriendDialogOpen, setRemoveFriendDialogOpen] = useState(false);
  const [deleteGroupDialogOpen, setDeleteGroupDialogOpen] = useState(false);
  const [leaveGroupDialogOpen, setLeaveGroupDialogOpen] = useState(false);

  if (conversation === undefined) {
    return (
      <div className="w-full h-full flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (conversation === null) {
    return (
      <div className="w-full h-full flex items-center justify-center">
        <p>Conversation not found</p>
      </div>
    );
  }

  const members =
    conversation.isGroup && Array.isArray(conversation.otherMember)
      ? conversation.otherMember
      : conversation.otherMember
      ? [conversation.otherMember]
      : [];

  return (
    <ConversationContainer>
      <RemoveFriendDialog
        conversationId={conversation._id}
        open={removeFriendDialogOpen}
        setOpen={setRemoveFriendDialogOpen}
      />
      <DeleteGroupDialog
        conversationId={conversation._id}
        open={deleteGroupDialogOpen}
        setOpen={setDeleteGroupDialogOpen}
      />
      <LeaveGroupDialog
        conversationId={conversation._id}
        open={leaveGroupDialogOpen}
        setOpen={setLeaveGroupDialogOpen}
      />
      <Header
        name={
          conversation.isGroup
            ? conversation.name || ""
            : conversation.otherMember?.username || ""
        }
        options={
          conversation.isGroup
            ? [
                {
                  label: "Leave group",
                  destructive: false,
                  onClick: () => setLeaveGroupDialogOpen(true),
                },
                {
                  label: "Delete group",
                  destructive: true,
                  onClick: () => setDeleteGroupDialogOpen(true),
                },
              ]
            : [
                {
                  label: "Remove friend",
                  destructive: true,
                  onClick: () => setRemoveFriendDialogOpen(true),
                },
              ]
        }
      />
      <Body members={members} />
      <ChatInput />
    </ConversationContainer>
  );
};

export default SingleConversationPage;
