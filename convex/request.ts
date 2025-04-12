import { ConvexError, v } from "convex/values";
import { mutation } from "./_generated/server";
import { getUserByClerkId } from "./getUser";

export const create = mutation({
  args: {
    username: v.string(),
    clerkId: v.string(),
  },
  handler: async (ctx, args) => {
    const identity = await getUserByClerkId({ ctx, clerkId: args.clerkId });

    if (!identity) {
      throw new ConvexError("Not authenticated");
    }

    if (args.username === identity.username) {
      throw new ConvexError("Can't send request to yourself");
    }

    const currentUser = await getUserByClerkId({ ctx, clerkId: args.clerkId });

    if (!currentUser) {
      throw new ConvexError("User not found");
    }

    // Find receiver across all roles
    const collections = ["admin", "teacher", "student", "parent"] as const;
    let receiver = null;

    for (const collection of collections) {
      const user = await ctx.db
        .query(collection)
        .withIndex("by_username", (q) => q.eq("username", args.username))
        .unique();
      if (user) {
        receiver = { ...user, role: collection };
        break;
      }
    }

    if (!receiver) {
      throw new ConvexError("Receiver not found");
    }

    // Check if request already exists
    const requestAlreadySent = await ctx.db
      .query("requests")
      .withIndex("by_receiver_sender", (q) =>
        q
          .eq("receiverId", receiver._id)
          .eq("receiverRole", receiver.role)
          .eq("senderId", currentUser._id)
          .eq("senderRole", currentUser.role)
      )
      .unique();

    if (requestAlreadySent) {
      throw new ConvexError("Request already sent");
    }

    const requestAlreadyReceived = await ctx.db
      .query("requests")
      .withIndex("by_receiver_sender", (q) =>
        q
          .eq("receiverId", currentUser._id)
          .eq("receiverRole", currentUser.role)
          .eq("senderId", receiver._id)
          .eq("senderRole", receiver.role)
      )
      .unique();

    if (requestAlreadyReceived) {
      throw new ConvexError("Request already received");
    }

    const friends1 = await ctx.db
      .query("friends")
      .withIndex("by_user1", (q) => q.eq("user1", currentUser._id))
      .collect();
    const friends2 = await ctx.db
      .query("friends")
      .withIndex("by_user2", (q) => q.eq("user2", receiver._id))
      .collect();

    if (
      friends1.some((friend) => friend.user2 === receiver._id) &&
      friends2.some((friend) => friend.user1 === currentUser._id)
    ) {
      throw new ConvexError("Already friends");
    }

    // ✅ Insert the request if no duplicate found
    await ctx.db.insert("requests", {
      senderId: currentUser._id,
      senderRole: currentUser.role,
      receiverId: receiver._id,
      receiverRole: receiver.role,
      status: "pending",
    });
  },
});

export const reject = mutation({
  args: {
    clerkId: v.string(),
    id: v.id("requests"),
  },
  handler: async (ctx, args) => {
    console.log(args.clerkId, args.id);

    const identity = await getUserByClerkId({ ctx, clerkId: args.clerkId });

    if (!identity) {
      throw new ConvexError("Not authenticated");
    }

    const currentUser = await getUserByClerkId({ ctx, clerkId: args.clerkId });

    if (!currentUser) {
      throw new ConvexError("User not found");
    }

    const request = await ctx.db.get(args.id);

    if (!request) {
      throw new ConvexError("Request not found");
    }

    await ctx.db.delete(request._id);
  },
});

export const accept = mutation({
  args: {
    clerkId: v.string(),
    id: v.id("requests"),
  },
  handler: async (ctx, args) => {
    console.log(args.clerkId, args.id);

    const identity = await getUserByClerkId({ ctx, clerkId: args.clerkId });

    if (!identity) {
      throw new ConvexError("Not authenticated");
    }

    const currentUser = await getUserByClerkId({ ctx, clerkId: args.clerkId });

    if (!currentUser) {
      throw new ConvexError("User not found");
    }

    const request = await ctx.db.get(args.id);

    if (!request || request.receiverId !== currentUser._id) {
      throw new ConvexError("Request not found");
    }

    const conervsationId = await ctx.db.insert("conversations", {
      isGroup: false,
    });

    await ctx.db.insert("friends", {
      user1: currentUser._id,
      user2: request.senderId,
      conversationId: conervsationId,
      role1: currentUser.role,
      role2: request.senderRole,
      status: "accepted",
    });

    await ctx.db.insert("conversationMembers", {
      memberId: currentUser._id,
      conversationId: conervsationId,
    });
    await ctx.db.insert("conversationMembers", {
      memberId: request.senderId,
      conversationId: conervsationId,
    });

    await ctx.db.delete(request._id);
  },
});
