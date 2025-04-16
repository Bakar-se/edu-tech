"use client";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import React from "react";

type Props = {
  fromCurrentUser: boolean;
  senderImage: string;
  senderName: string;
  lastByUser: boolean;
  content: string[];
  createdAt: string;
  seen?: React.ReactNode;
  type: string;
};

const Message = (props: Props) => {
  const formatTime = (timestamp: string) => {
    return format(timestamp, "h:mm a");
  };
  console.log(props.content);
  return (
    <div
      className={cn("flex items-end", { "justify-end": props.fromCurrentUser })}
    >
      <div
        className={cn("flex flex-col w-full mx-2", {
          "order-1 items-end": props.fromCurrentUser,
          "order-2 items-start": !props.fromCurrentUser,
        })}
      >
        <div
          className={cn("px-4 py-2 rounded-lg max-w-[70%]", {
            "bg-primary text-primary-foreground": props.fromCurrentUser,
            "bg-secondary text-secondary-foreground": !props.fromCurrentUser,
            "rounded-br-none": !props.lastByUser && props.fromCurrentUser,
            "rounded-bl-none": !props.lastByUser && !props.fromCurrentUser,
          })}
        >
          {props.type === "text" ? (
            <p className="text-wrapbreak-words whitespace-pre-wrap break-all">
              {props.content}
            </p>
          ) : null}
          <p
            className={cn("text-xs flex w-full my-1", {
              "text-primary-foreground": props.fromCurrentUser,
              "text-secondary-foreground justify-start": !props.fromCurrentUser,
            })}
          >
            {formatTime(props.createdAt)}
          </p>
        </div>
        {/* {props.seen} */}
      </div>
      <Avatar
        className={cn("relative w-8 h-8", {
          "order-2": props.fromCurrentUser,
          "order-1": !props.fromCurrentUser,
          invisible: props.lastByUser,
        })}
      >
        <AvatarImage src={props.senderImage} />
        <AvatarFallback>{props.senderName.substring(0, 1)}</AvatarFallback>
      </Avatar>
    </div>
  );
};

export default Message;
