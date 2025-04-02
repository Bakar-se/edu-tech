import { QueryCtx } from "./_generated/server";

export const getUserByClerkId = async ({ ctx, clerkId }: { ctx: QueryCtx; clerkId: string }) => {
    // Define the collections (roles) you want to search through
    const collections = ["admin", "teacher", "student", "parent"] as const;

    // Iterate over each collection to find the user
    for (const collection of collections) {
        const user = await ctx.db.query(collection)
            .withIndex("by_clerkId", (q) => q.eq("clerkId", clerkId)) // Query by clerkId
            .unique(); // Fetch unique record (if exists)

        // If a user is found, return it with the role included
        if (user) {
            return { ...user, role: collection } as typeof user & { role: (typeof collections)[number] };
        }
    }

    // If no user is found in any collection, return null
    return null;
};
