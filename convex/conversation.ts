import { ConvexError, v } from "convex/values";
import { mutation, query } from "./_generated/server";
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

    const conversationMemberships = await ctx.db
      .query("conversationMembers")
      .withIndex("by_memberId", (q) => q.eq("memberId", currentUser._id))
      .collect();

    const conversation = await ctx.db.get(args.id);

    if (!conversation) {
      throw new ConvexError("Conversation not found");
    }

    const membership = await ctx.db
      .query("conversationMembers")
      .withIndex("by_memberId_conversationId", (q) =>
        q.eq("memberId", currentUser._id).eq("conversationId", conversation._id)
      )
      .unique();

    if (!membership) {
      throw new ConvexError("You are not a member of this conversation");
    }

    const allConversationMemberships = await ctx.db
      .query("conversationMembers")
      .withIndex("by_conversationId", (q) =>
        q.eq("conversationId", conversation._id)
      )
      .collect();

    if (!conversation.isGroup) {
      const otherMembership = allConversationMemberships.filter(
        (m) => m.memberId !== currentUser._id
      )[0];

      const otherMemberDetails = await ctx.db.get(otherMembership.memberId);

      if (!otherMemberDetails) {
        throw new ConvexError("Other member not found");
      }

      return {
        ...conversation,
        otherMember: {
          ...otherMemberDetails,
          username:
            (otherMemberDetails as any).username ??
            (otherMemberDetails as any).name ??
            "Unknown",
          lastSeenMessage: otherMembership.lastSeenMessage,
        },
        otherMebers: null,
      };
    } else {
      const otherMembers = (await Promise.all(allConversationMemberships.filter(membership => membership.memberId !== currentUser._id).map(async membership => {
        const member = await ctx.db.get(membership.memberId)

        if(!member) {
          throw new ConvexError("Member could not be found")
        }

        return {
          _id: member._id,
          username: member.username
        }
      })))
      return {...conversation, otherMembers, otherMember: null}
    }
  },
});

export const deleteGroup = mutation({
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

    if (!memberships || memberships.length <= 1) {
        throw new ConvexError("This conversation does not have any members")
    }

      const messages = await ctx.db.query("messages").withIndex("by_conversationId", q => q.eq("conversationId", args.conversationId)).collect()

      await ctx.db.delete(args.conversationId)

      await Promise.all(memberships.map(async memberships => {
        await ctx.db.delete(memberships._id)
      }))

      await Promise.all(messages.map(async message => {
        await ctx.db.delete(message._id)
      }))
  },
});

export const leaveGroup = mutation({
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

    const membership = await ctx.db.query("conversationMembers").withIndex("by_memberId_conversationId",q => q.eq("memberId", currentUser._id).eq("conversationId", args.conversationId)).unique()

    if (!membership) {
        throw new ConvexError("You are not a member of this group")
    }

      await ctx.db.delete(membership._id)
  },
});

export const markRead = mutation({
  args: {
    conversationId: v.id("conversations"),
    clerkId: v.string(),
    messageId: v.id("messages")
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

    const membership = await ctx.db.query("conversationMembers").withIndex("by_memberId_conversationId",q => q.eq("memberId", currentUser._id).eq("conversationId", args.conversationId)).unique()

    if (!membership) {
        throw new ConvexError("You are not a member of this group")
    }

    const lastMessage = await ctx.db.get(args.messageId);

    await ctx.db.patch(membership._id, {
      lastSeenMessage: lastMessage ? lastMessage._id : undefined
    })

  },
});