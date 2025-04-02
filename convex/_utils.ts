import { MutationCtx, QueryCtx } from "./_generated/server";

export const getUserByClerkId = async ({ ctx, clerkId }: {
    ctx?: QueryCtx | MutationCtx;
    clerkId: string;
}) => {
    const collections = ["admin", "teacher", "student", "parent"] as const;
console.log(clerkId)
    for (const collection of collections) {
        const user = await ctx?.db.query(collection)
            .withIndex("by_clerkId", (q) => q.eq("clerkId", clerkId))
            .unique();

        if (user) {
            return { ...user, role: collection } as typeof user & { role: (typeof collections)[number] };
        }
    }

    return null; // User not found in any role
};
