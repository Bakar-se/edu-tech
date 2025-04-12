import { ConvexError, v } from "convex/values";
import { query } from "./_generated/server";
import { getUserByClerkId } from "./getUser";

export const get = query({
    args: { clerkId: v.string() },
    handler: async (ctx, args) => {
        const identity = await getUserByClerkId({ ctx, clerkId: args.clerkId });
        if (!identity) {
            throw new ConvexError("Not authenticated");
        }

        const currentUser = await getUserByClerkId({ ctx, clerkId: args.clerkId });

        if (!currentUser) {
            throw new ConvexError("User not found");
        }

        const requests = await ctx.db.query("requests")
        .withIndex("by_receiver", (q) => q.eq("receiverId", currentUser._id))
        .collect()
        const requestsWithSender = await Promise.all(requests.map(async (request: any) => {
            const sender = await ctx.db.get(request.senderId);

            if (!sender) {
                throw new ConvexError("Sender not found");
            }

            return { sender, request }
        }));

        return requestsWithSender
    }
}
)

export const count = query({
    args: { clerkId: v.string() },
    handler: async (ctx, args) => {
        const identity = await getUserByClerkId({ ctx, clerkId: args.clerkId });
        if (!identity) {
            throw new ConvexError("Not authenticated");
        }

        const currentUser = await getUserByClerkId({ ctx, clerkId: args.clerkId });

        if (!currentUser) {
            throw new ConvexError("User not found");
        }

        const requests = await ctx.db.query("requests")
        .withIndex("by_receiver", (q) => q.eq("receiverId", currentUser._id))
        .collect()

    return requests.length
    },

})