import { v } from "convex/values";
import { mutation } from "./_generated/server";
import { Id } from "./_generated/dataModel";

export const createGrave = mutation({
  args: {
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
  },
  handler: async (ctx, args) => {
    const graveId = await ctx.db.insert("graves", {
      ...args,
      createdAt: Date.now(),
    });

    return await ctx.db.get(graveId);
  },
});
