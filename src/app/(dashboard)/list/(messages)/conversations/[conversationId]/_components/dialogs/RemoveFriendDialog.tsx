import React, { Dispatch, SetStateAction } from 'react'
import { Id } from '../../../../../../../../../convex/_generated/dataModel'
import { useMutationState } from '@/hooks/useMutationState';
import { api } from '../../../../../../../../../convex/_generated/api';
import { useAuth } from '@clerk/nextjs';
import { toast } from 'sonner';
import { ConvexError } from 'convex/values';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { cn } from '@/lib/utils';

type Props = {
    conversationId: Id<"conversations">;
    open: boolean;
    setOpen: Dispatch<SetStateAction<boolean>>
}

const RemoveFriendDialog = (props: Props) => {
    const { userId } = useAuth();

    const { mutate: removeFriend, pending } = useMutationState(api.friend.remove);

    const handleRemoveFriend = async () => {
        if (!userId) return;

        removeFriend({ clerkId: userId, conversationId: props.conversationId })
            .then(() => {
                toast.success("Removed friend");
                props.setOpen(false);
            })
            .catch((error) => {
                toast.error(error instanceof ConvexError ? error.data : "Unexpected error occurred");
            });
    };

    return (
        <AlertDialog open={props.open} onOpenChange={props.setOpen}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you sure?</AlertDialogTitle>
          <p className="text-sm text-muted-foreground">
            This action cannot be undone. All messages will be deleted and you will not be able to message this user. Group chats will still function as usual.
          </p>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={pending}>Cancel</AlertDialogCancel>
          <AlertDialogAction className={"bg-destructive"} onClick={handleRemoveFriend} disabled={pending}>
            {pending ? "Removing..." : "Remove"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
    )
}

export default RemoveFriendDialog