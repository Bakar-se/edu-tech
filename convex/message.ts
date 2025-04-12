import { ConvexError, v } from "convex/values";
import { mutation } from "./_generated/server";
import { getUserByClerkId } from "./getUser";

export const create = mutation({
  args: {
    conversationId: v.id("conversations"),
    type: v.string(),
    content: v.array(v.string()),
    clerkId: v.string(),
  },
  handler: async (ctx, args) => {
    // Use clerkId for user lookup/authentication
    const identity = await getUserByClerkId({ ctx, clerkId: args.clerkId });
    if (!identity) {
      throw new ConvexError("Not authenticated");
    }

    const currentUser = await getUserByClerkId({ ctx, clerkId: args.clerkId });

    if (!currentUser) {
      throw new ConvexError("User not found");
    }

    // Check if the current user is a member of the conversation
    const membership = await ctx.db
      .query("conversationMembers")
      .withIndex("by_memberId_conversationId", (q) =>
        q
          .eq("memberId", currentUser._id)
          .eq("conversationId", args.conversationId)
      )
      .unique();

    if (!membership) {
      throw new ConvexError("User is not a member of the conversation");
    }

    // Remove clerkId from the args to avoid inserting extra field
    const { clerkId, ...messageArgs } = args;

    // Create the message using the sanitized messageArgs and add timestamp and senderId
    const message = await ctx.db.insert("messages", {
      senderId: currentUser._id,
      ...messageArgs,
      timestamp: Date.now(),
    });

    // Update conversation with the last message id
    await ctx.db.patch(args.conversationId, { lastMessageId: message });

    return message;
  },
});
