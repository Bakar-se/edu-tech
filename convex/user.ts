import { v } from "convex/values";
import { internalMutation, internalQuery } from "./_generated/server";

export const getAdmins = internalQuery({
    args: { clerkId: v.string() },
    async handler(ctx, args) {
        return await ctx.db.query("admin")
            .withIndex("by_clerkId", (q) => q.eq("clerkId", args.clerkId)).unique();
    }
});

export const createAdmin = internalMutation({
    args: {
        username: v.string(),
        clerkId: v.string(),
    },
    handler: async (ctx, args) => {
        await ctx.db.insert("admin", { ...args, role: "admin" }); // ✅ Added role
    },
});

export const getStudent = internalQuery({
    args: { clerkId: v.string() },
    async handler(ctx, args) {
        return await ctx.db.query("student")
            .withIndex("by_clerkId", (q) => q.eq("clerkId", args.clerkId)).unique();
    }
});

export const createStudent = internalMutation({
    args: {
        username: v.string(),
        clerkId: v.string(),
        name: v.string(),
        email: v.string(),
        img: v.string(),
        studentId: v.string(),
    },
    handler: async (ctx, args) => {
        await ctx.db.insert("student", { ...args, role: "student" }); // ✅ Added role
    },
});

export const getTeacher = internalQuery({
    args: { clerkId: v.string() },
    async handler(ctx, args) {
        return await ctx.db.query("teacher")
            .withIndex("by_clerkId", (q) => q.eq("clerkId", args.clerkId)).unique();
    }
});

export const createTeacher = internalMutation({
    args: {
        username: v.string(),
        clerkId: v.string(),
        name: v.string(),
        email: v.string(),
        img: v.string(),
        teacherId: v.string(),
    },
    handler: async (ctx, args) => {
        await ctx.db.insert("teacher", { ...args, role: "teacher" }); // ✅ Added role
    },
});

export const getParent = internalQuery({
    args: { clerkId: v.string() },
    async handler(ctx, args) {
        return await ctx.db.query("parent")
            .withIndex("by_clerkId", (q) => q.eq("clerkId", args.clerkId)).unique();
    }
});

export const createParent = internalMutation({
    args: {
        username: v.string(),
        clerkId: v.string(),
        name: v.string(),
        email: v.string(),
        img: v.string(),
        parentId: v.string(),
    },
    handler: async (ctx, args) => {
        await ctx.db.insert("parent", { ...args, role: "parent" }); // ✅ Added role
    },
});
