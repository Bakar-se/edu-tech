import { ConvexError, v } from "convex/values";
import { mutation } from "./_generated/server";
import { getUserByClerkId } from "./getUser";

export const remove = mutation({
  args: {
    conversationId: v.id("conversations"),
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

    const conversation = await ctx.db.get(args.conversationId)

    if(!conversation) {
        throw new ConvexError("Conversation not found!")
    }

    const memberships = await ctx.db.query("conversationMembers").withIndex("by_conversationId",q => q.eq("conversationId", args.conversationId)).collect()

    if (!memberships || memberships.length !== 2) {
        throw new ConvexError("This conversation does not have any members")
    }

    const friendships = await ctx.db.query("friends").withIndex("by_conversation", (q) => {
        return q.eq("conversationId", args.conversationId);
      }).unique();
      
      if (!friendships) {
        throw new ConvexError("Friend could not be found")
      }

      const messages = await ctx.db.query("messages").withIndex("by_conversationId", q => q.eq("conversationId", args.conversationId)).collect()

      await ctx.db.delete(args.conversationId)

      await ctx.db.delete(friendships._id)

      await Promise.all(memberships.map(async memberships => {
        await ctx.db.delete(memberships._id)
      }))

      await Promise.all(messages.map(async message => {
        await ctx.db.delete(message._id)
      }))
  },
});
