import { ConvexError, v } from "convex/values";
import { mutation } from "./_generated/server";
import { getUserByClerkId } from "./getUser";

export const create = mutation({
    args: {
        username: v.string(),
        clerkId: v.string(),
    },
    handler: async (ctx, args) => {

        console.log(args)
        const identity = await getUserByClerkId({ ctx, clerkId: args.clerkId });

        console.log("identity", identity);

        if (!identity) {
            throw new ConvexError("Not authenticated");
        }

        if (args.username === identity.username) {
            throw new ConvexError("Can't send request to yourself");
        }

        const currentUser = await getUserByClerkId({ ctx, clerkId: args.clerkId  });

        if (!currentUser) {
            throw new ConvexError("User not found");
        }

        // Find receiver across all roles
        const collections = ["admin", "teacher", "student", "parent"] as const;
        let receiver = null;

        for (const collection of collections) {
            const user = await ctx.db.query(collection)
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
        const requestAlreadySent = await ctx.db.query("requests")
            .withIndex("by_receiver_sender", (q) =>
                q.eq("receiverId", receiver._id)
                    .eq("receiverRole", receiver.role)
                    .eq("senderId", currentUser._id)
                    .eq("senderRole", currentUser.role)
            )
            .unique();

        if (requestAlreadySent) {
            throw new ConvexError("Request already sent");
        }

        const requestAlreadyReceived = await ctx.db.query("requests")
            .withIndex("by_receiver_sender", (q) =>
                q.eq("receiverId", currentUser._id)
                    .eq("receiverRole", currentUser.role)
                    .eq("senderId", receiver._id)
                    .eq("senderRole", receiver.role)
            )
            .unique();

        if (requestAlreadyReceived) {
            throw new ConvexError("Request already received");
        }

        // ✅ Insert the request if no duplicate found
        await ctx.db.insert("requests", {
            senderId: currentUser._id,
            senderRole: currentUser.role,
            receiverId: receiver._id,
            receiverRole: receiver.role,
            status: "pending"
        });
    },
});
