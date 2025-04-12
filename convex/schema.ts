import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  admin: defineTable({
    username: v.string(),
    clerkId: v.string(),
    role: v.optional(v.literal("admin")),
  })
    .index("by_username", ["username"])
    .index("by_clerkId", ["clerkId"]),

  teacher: defineTable({
    teacherId: v.string(),
    clerkId: v.string(),
    name: v.string(),
    email: v.string(),
    username: v.string(),
    img: v.string(),
    role: v.optional(v.literal("teacher")),
  })
    .index("by_username", ["username"])
    .index("by_clerkId", ["clerkId"]),

  student: defineTable({
    studentId: v.string(),
    clerkId: v.string(),
    name: v.string(),
    email: v.string(),
    username: v.string(),
    img: v.string(),
    role: v.optional(v.literal("student")),
  })
    .index("by_username", ["username"])
    .index("by_clerkId", ["clerkId"]),

  parent: defineTable({
    parentId: v.string(),
    clerkId: v.string(),
    name: v.string(),
    username: v.string(),
    email: v.string(),
    img: v.string(),
    role: v.optional(v.literal("parent")),
  })
    .index("by_username", ["username"])
    .index("by_clerkId", ["clerkId"]),

  requests: defineTable({
    senderId: v.union(
      v.id("admin"),
      v.id("teacher"),
      v.id("student"),
      v.id("parent")
    ),
    senderRole: v.union(
      v.literal("admin"),
      v.literal("teacher"),
      v.literal("student"),
      v.literal("parent")
    ),
    receiverId: v.union(
      v.id("admin"),
      v.id("teacher"),
      v.id("student"),
      v.id("parent")
    ),
    receiverRole: v.union(
      v.literal("admin"),
      v.literal("teacher"),
      v.literal("student"),
      v.literal("parent")
    ),
    status: v.union(
      v.literal("pending"),
      v.literal("accepted"),
      v.literal("rejected")
    ),
  })
    .index("by_receiver", ["receiverId", "receiverRole"])
    .index("by_sender", ["senderId", "senderRole"])
    .index("by_receiver_sender", [
      "receiverId",
      "receiverRole",
      "senderId",
      "senderRole",
    ]),

  friends: defineTable({
    user1: v.union(
      v.id("admin"),
      v.id("teacher"),
      v.id("student"),
      v.id("parent")
    ),
    user2: v.union(
      v.id("admin"),
      v.id("teacher"),
      v.id("student"),
      v.id("parent")
    ),
    role1: v.union(
      v.literal("admin"),
      v.literal("teacher"),
      v.literal("student"),
      v.literal("parent")
    ),
    role2: v.union(
      v.literal("admin"),
      v.literal("teacher"),
      v.literal("student"),
      v.literal("parent")
    ),
    status: v.union(
      v.literal("accepted"),
      v.literal("pending"),
      v.literal("rejected")
    ),
    conversationId: v.optional(v.id("conversations")),
  })
    .index("by_user1", ["user1", "role1"])
    .index("by_user2", ["user2", "role2"])
    .index("by_conversation", ["conversationId"]),

  conversations: defineTable({
    name: v.optional(v.string()),
    isGroup: v.boolean(),
    lastMessageId: v.optional(v.id("messages")),
  }),

  conversationMembers: defineTable({
    memberId: v.union(
      v.id("admin"),
      v.id("teacher"),
      v.id("student"),
      v.id("parent")
    ),
    conversationId: v.id("conversations"),
    lastSeenMessage: v.optional(v.id("messages")),
  })
    .index("by_memberId", ["memberId"])
    .index("by_conversationId", ["conversationId"])
    .index("by_memberId_conversationId", ["memberId", "conversationId"]),

  messages: defineTable({
    // Fixed "messsages" typo
    senderId: v.union(
      v.id("admin"),
      v.id("teacher"),
      v.id("student"),
      v.id("parent")
    ),
    conversationId: v.id("conversations"),
    type: v.string(),
    content: v.array(v.string()),
    timestamp: v.number(), // Optional: Add timestamp for sorting messages
  })
    .index("by_conversationId", ["conversationId"])
    .index("by_senderId", ["senderId"]),
});
