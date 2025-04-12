import React from "react";
import { Id } from "../../../../../../../convex/_generated/dataModel";
import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Check, User, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useMutationState } from "@/hooks/useMutationState";
import { api } from "../../../../../../../convex/_generated/api";
import { useAuth } from "@clerk/nextjs";
import { toast } from "sonner";
import { ConvexError } from "convex/values";

type Props = {
  id: Id<"requests">;
  imageUrl?: string;
  username: string;
  email: string;
};

const Request = (props: Props) => {
  const { userId } = useAuth();
  const { mutate: rejectRequest, pending: denyPending } = useMutationState(
    api.request.reject
  );

  const { mutate: acceptRequest, pending: acceptPrending } = useMutationState(
    api.request.accept
  );
  const handleReject = () => {
    console.log(props.id, userId);
    rejectRequest({ id: props.id, clerkId: userId })
      .then(() => {
        toast.success("Request rejected");
      })
      .catch((err) => {
        toast.error(
          err instanceof ConvexError ? err.data : "Unexpected error occurred"
        );
      });
  };

  const handleAccept = () => {
    console.log(props.id, userId);
    acceptRequest({ id: props.id, clerkId: userId })
      .then(() => {
        toast.success("Request accepted!");
      })
      .catch((err) => {
        toast.error(
          err instanceof ConvexError ? err.data : "Unexpected error occurred"
        );
      });
  };

  return (
    <Card className="w-full p-2 flex flex-row items-center justify-between gap-2">
      <div className="flex items-center gap-4 truncate">
        <Avatar>
          <AvatarImage src={props.imageUrl} />
          <AvatarFallback>
            <User />
          </AvatarFallback>
        </Avatar>
        <div className="flex flex-col truncate">
          <h4 className="truncate">{props.username}</h4>
          <p className="text-xs text-muted-foreground truncate">
            {props.email}
          </p>
        </div>
      </div>
      <div className="flex items-center gap-2">
        <Button
          size="icon"
          disabled={denyPending || acceptPrending}
          onClick={handleAccept}
        >
          <Check />
        </Button>
        <Button
          variant="outline"
          disabled={denyPending || acceptPrending}
          size="icon"
          onClick={handleReject}
        >
          <X className="h-4 w-4 text-destructive" />
        </Button>
      </div>
    </Card>
  );
};

export default Request;
