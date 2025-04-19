import { v } from "convex/values";
import { internalMutation, internalQuery } from "./_generated/server";

export const getAdmins = internalQuery({
  args: { clerkId: v.string() },
  async handler(ctx, args) {
    return await ctx.db
      .query("admin")
      .withIndex("by_clerkId", (q) => q.eq("clerkId", args.clerkId))
      .unique();
  },
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
    return await ctx.db
      .query("student")
      .withIndex("by_clerkId", (q) => q.eq("clerkId", args.clerkId))
      .unique();
  },
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
    return await ctx.db
      .query("teacher")
      .withIndex("by_clerkId", (q) => q.eq("clerkId", args.clerkId))
      .unique();
  },
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
    return await ctx.db
      .query("parent")
      .withIndex("by_clerkId", (q) => q.eq("clerkId", args.clerkId))
      .unique();
  },
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

// Delete Admin
export const deleteAdminIfExists = internalMutation({
  args: { clerkId: v.string() },
  handler: async (ctx, args) => {
    const admin = await ctx.db
      .query("admin")
      .withIndex("by_clerkId", (q) => q.eq("clerkId", args.clerkId))
      .unique();

    if (admin) {
      await ctx.db.delete(admin._id);
      console.log(`🗑️ Deleted admin with Clerk ID: ${args.clerkId}`);
    }
  },
});

// Delete Student
export const deleteStudentIfExists = internalMutation({
  args: { clerkId: v.string() },
  handler: async (ctx, args) => {
    const student = await ctx.db
      .query("student")
      .withIndex("by_clerkId", (q) => q.eq("clerkId", args.clerkId))
      .unique();

    if (student) {
      await ctx.db.delete(student._id);
      console.log(`🗑️ Deleted student with Clerk ID: ${args.clerkId}`);
    }
  },
});

// Delete Teacher
export const deleteTeacherIfExists = internalMutation({
  args: { clerkId: v.string() },
  handler: async (ctx, args) => {
    const teacher = await ctx.db
      .query("teacher")
      .withIndex("by_clerkId", (q) => q.eq("clerkId", args.clerkId))
      .unique();

    if (teacher) {
      await ctx.db.delete(teacher._id);
      console.log(`🗑️ Deleted teacher with Clerk ID: ${args.clerkId}`);
    }
  },
});

// Delete Parent
export const deleteParentIfExists = internalMutation({
  args: { clerkId: v.string() },
  handler: async (ctx, args) => {
    const parent = await ctx.db
      .query("parent")
      .withIndex("by_clerkId", (q) => q.eq("clerkId", args.clerkId))
      .unique();

    if (parent) {
      await ctx.db.delete(parent._id);
      console.log(`🗑️ Deleted parent with Clerk ID: ${args.clerkId}`);
    }
  },
});
