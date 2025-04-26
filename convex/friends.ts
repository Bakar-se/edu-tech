import { ConvexError, v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { getUserByClerkId } from "./getUser";

export const get = query({
  args: { clerkId: v.string() },
  handler: async (ctx, args) => {
    const currentUser = await getUserByClerkId({ ctx, clerkId: args.clerkId });

    if (!currentUser) {
      throw new ConvexError("Not authenticated");
    }

    const friendships1 = await ctx.db
      .query("friends")
      .withIndex("by_user1", (q) => q.eq("user1", currentUser._id))
      .collect();

    const friendships2 = await ctx.db
      .query("friends")
      .withIndex("by_user2", (q) => q.eq("user2", currentUser._id))
      .collect();

    const friendships = [...friendships1, ...friendships2];

    const friends = await Promise.all(
      friendships.map(async (friendship) => {
        const friendId =
          friendship.user1 === currentUser._id
            ? friendship.user2
            : friendship.user1;

        const friend = await ctx.db.get(friendId);

        if (!friend) {
          console.warn("Skipping missing friend record:", friendId);
          return null;
        }
        // inside map:
        // if (!friend) {
        //   console.warn("Removing stale friendship with:", friendId);
        //   await ctx.db.delet(friendship._id); // cleanup
        //   return null;
        // }

        return friend;
      })
    );

    return friends.filter(Boolean); // remove nulls
  },
});

export const createGroup = mutation({
  args: {
    members: v.array(
      v.union(v.id("admin"), v.id("teacher"), v.id("student"), v.id("parent"))
    ),
    name: v.string(),
    clerkId: v.string(),
  },
  handler: async (ctx, args) => {
    const identity = await getUserByClerkId({ ctx, clerkId: args.clerkId });
    if (!identity) {
      throw new ConvexError("Not authenticated");
    }

    const currentUser = await getUserByClerkId({ ctx, clerkId: args.clerkId });

    if (!currentUser) {
      throw new ConvexError("User not found");
    }

    const conversationId = await ctx.db.insert("conversations", {
      isGroup: true,
      name: args.name,
    });
    await Promise.all(
      [...args.members, currentUser._id].map(async (memberId) => {
        await ctx.db.insert("conversationMembers", {
          memberId,
          conversationId,
        });
      })
    );
  },
});
