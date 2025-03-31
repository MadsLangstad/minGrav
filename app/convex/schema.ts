import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  users: defineTable({
    email: v.string(),
    name: v.string(),
    role: v.union(v.literal("client"), v.literal("caretaker")),
    clerkId: v.string(),
    createdAt: v.number(),
    bio: v.optional(v.string()),
    location: v.optional(v.string()),
    profileImage: v.optional(v.string()),
  }),

  graves: defineTable({
    ownerId: v.id("users"),
    cemeteryName: v.string(),
    description: v.optional(v.string()),
    imageUrl: v.optional(v.string()),
    gpsLocation: v.optional(
      v.object({
        lat: v.number(),
        lng: v.number(),
      })
    ),
    createdAt: v.number(),
  }),

  requests: defineTable({
    userId: v.id("users"),
    graveId: v.id("graves"),
    description: v.string(),
    preferredDate: v.string(), // ISO date string, e.g, "2025-04-01"
    status: v.union(
      v.literal("open"),
      v.literal("assigned"),
      v.literal("completed")
    ),
    createdAt: v.number(),
  }),

  assignments: defineTable({
    requestId: v.id("requests"),
    caretakerId: v.id("users"),
    acceptedAt: v.number(),
    completedAt: v.optional(v.number()),
    beforeImage: v.optional(v.string()),
    afterImage: v.optional(v.string()),
    feedback: v.optional(v.string()),
    rating: v.optional(v.number()), // 1 to 5
  }),

  messages: defineTable({
    senderId: v.id("users"),
    receiverId: v.id("users"),
    message: v.string(),
    sentAt: v.number(),
  }),

  subscriptions: defineTable({
    userId: v.id("users"),
    graveId: v.id("graves"),
    interval: v.union(
      v.literal("weekly"),
      v.literal("monthly"),
      v.literal("yearly")
    ),
    nextDue: v.string(), // ISO date string, e.g., "2025-05-01"
    active: v.boolean(),
  }),
});
