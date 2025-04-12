import { ConvexError, v } from "convex/values";
import { query } from "./_generated/server";
import { getUserByClerkId } from "./getUser";

export const get = query({
  args: { clerkId: v.string(), id: v.id("conversations") },
  handler: async (ctx, args) => {
    const identity = await getUserByClerkId({ ctx, clerkId: args.clerkId });
    if (!identity) {
      throw new ConvexError("Not authenticated");
    }

    const currentUser = await getUserByClerkId({ ctx, clerkId: args.clerkId });

    if (!currentUser) {
      throw new ConvexError("User not found");
    }

    const membership = await ctx.db
      .query("conversationMembers")
      .withIndex("by_memberId_conversationId", (q) =>
        q.eq("memberId", currentUser._id).eq("conversationId", args.id)
      )
      .unique();

    if (!membership) {
      throw new ConvexError("User is not a member of the conversation");
    }

    const messages = await ctx.db
      .query("messages")
      .withIndex("by_conversationId", (q) => q.eq("conversationId", args.id))
      .order("desc")
      .collect();

    const messageWithUsers = await Promise.all(
      messages.map(async (message: any) => {
        const messageSender = await ctx.db.get(message.senderId);

        if (!messageSender) {
          throw new ConvexError("Sender not found");
        }

        const senderImage =
          "img" in messageSender ? messageSender.img : undefined;
        const senderName =
          "username" in messageSender ? messageSender.username : "Unknown";

        return {
          message,
          senderImage,
          senderName,
          isCurrentUser: message.senderId === currentUser._id,
        };
      })
    );

    return messageWithUsers;
  },
});
