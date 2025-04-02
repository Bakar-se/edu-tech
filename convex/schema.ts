import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
    admin: defineTable({
        username: v.string(),
        clerkId: v.string(),
        role: v.optional(v.literal("admin")),
    }).index("by_username", ["username"])
      .index("by_clerkId", ["clerkId"]),

    teacher: defineTable({
        teacherId: v.string(),
        clerkId: v.string(),
        name: v.string(),
        email: v.string(),
        username: v.string(),
        img: v.string(),
        role: v.optional(v.literal("teacher")),
    }).index("by_username", ["username"])
      .index("by_clerkId", ["clerkId"]),

    student: defineTable({
        studentId: v.string(),
        clerkId: v.string(),
        name: v.string(),
        email: v.string(),
        username: v.string(),
        img: v.string(),
        role: v.optional(v.literal("student")),
    }).index("by_username", ["username"])
      .index("by_clerkId", ["clerkId"]),

    parent: defineTable({
        parentId: v.string(),
        clerkId: v.string(),
        name: v.string(),
        username: v.string(),
        email: v.string(),
        img: v.string(),
        role: v.optional(v.literal("parent")),
    }).index("by_username", ["username"])
      .index("by_clerkId", ["clerkId"]),

    requests: defineTable({
        senderId: v.string(),   
        senderRole: v.union(v.literal("admin"), v.literal("teacher"), v.literal("student"), v.literal("parent")), 
        receiverId: v.string(), 
        receiverRole: v.union(v.literal("admin"), v.literal("teacher"), v.literal("student"), v.literal("parent")), 
        status: v.union(v.literal("pending"), v.literal("accepted"), v.literal("rejected"))
    })
    .index("by_receiver", ["receiverId", "receiverRole"])
    .index("by_sender", ["senderId", "senderRole"])
    .index("by_receiver_sender", ["receiverId", "receiverRole", "senderId", "senderRole"]),
});
