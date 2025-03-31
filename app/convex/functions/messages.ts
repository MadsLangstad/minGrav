import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { Id } from "./_generated/dataModel";

export const sendMessage = mutation({
  args: {
    senderId: v.id("users"),
    receiverId: v.id("users"),
    message: v.string(),
  },
  handler: async (ctx, args) => {
    const messageId = await ctx.db.insert("messages", {
      ...args,
      sentAt: Date.now(),
    });

    return await ctx.db.get(messageId);
  },
});

export const getConversation = query({
  args: {
    userId1: v.id("users"),
    userId2: v.id("users"),
  },
  handler: async (ctx, args) => {
    const { userId1, userId2 } = args;

    // Get messages where either user is sender or receiver
    return await ctx.db
      .query("messages")
      .filter((q) =>
        q.or(
          q.and(
            q.eq(q.field("senderId"), userId1),
            q.eq(q.field("receiverId"), userId2)
          ),
          q.and(
            q.eq(q.field("senderId"), userId2),
            q.eq(q.field("receiverId"), userId1)
          )
        )
      )
      .order("asc")
      .collect();
  },
});

export const getRecentConversations = query({
  args: {
    userId: v.id("users"),
  },
  handler: async (ctx, args) => {
    const { userId } = args;

    // Get all messages where the user is either sender or receiver
    const messages = await ctx.db
      .query("messages")
      .filter((q) =>
        q.or(
          q.eq(q.field("senderId"), userId),
          q.eq(q.field("receiverId"), userId)
        )
      )
      .order("desc")
      .collect();

    // Group messages by conversation partner
    const conversations = new Map<Id<"users">, any>();

    for (const message of messages) {
      const otherUserId =
        message.senderId === userId ? message.receiverId : message.senderId;

      if (!conversations.has(otherUserId)) {
        const otherUser = await ctx.db.get(otherUserId);
        conversations.set(otherUserId, {
          user: otherUser,
          lastMessage: message,
          unreadCount: 0, // TODO: Implement unread count
        });
      }
    }

    return Array.from(conversations.values());
  },
});
