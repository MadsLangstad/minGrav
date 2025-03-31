import { mutation, query } from '../_generated/server';
import { v } from 'convex/values';
import { Id } from '../_generated/dataModel';
import { ConvexError } from 'convex/values';
import { getUser as getUserFromUtils } from './utils';

export const createUserIfNotExists = mutation({
    args: {
        email: v.string(),
        name: v.string(),
        role: v.union(v.literal('client'), v.literal('caretaker')),
    },
    handler: async (ctx, args) => {
        // Get the authenticated user
        const identity = await ctx.auth.getUserIdentity();
        if (!identity) {
            throw new ConvexError('Not authenticated');
        }

        // Check if user exists
        const existingUser = await ctx.db
            .query('users')
            .filter((q) => q.eq(q.field('email'), args.email))
            .first();

        if (existingUser) {
            return existingUser;
        }

        // Create new user
        const userId = await ctx.db.insert('users', {
            email: args.email,
            name: args.name,
            role: args.role,
            createdAt: Date.now(),
            clerkId: identity.subject, // Store the Clerk user ID
        });

        return await ctx.db.get(userId);
    },
});

export const getUserQuery = query({
    args: {
        email: v.string(),
    },
    handler: async (ctx, args) => {
        // Get the authenticated user
        const identity = await ctx.auth.getUserIdentity();
        if (!identity) {
            throw new ConvexError('Not authenticated');
        }

        return await ctx.db
            .query('users')
            .filter((q) => q.eq(q.field('email'), args.email))
            .first();
    },
});

export const getUserById = query({
    args: {
        userId: v.id('users'),
    },
    handler: async (ctx, args) => {
        // Get the authenticated user
        const identity = await ctx.auth.getUserIdentity();
        if (!identity) {
            throw new ConvexError('Not authenticated');
        }

        return await ctx.db.get(args.userId);
    },
});

export const updateUserProfile = mutation({
    args: {
        userId: v.id('users'),
        name: v.optional(v.string()),
        bio: v.optional(v.string()),
        location: v.optional(v.string()),
        profileImage: v.optional(v.string()),
    },
    handler: async (ctx, args) => {
        // Get the authenticated user
        const identity = await ctx.auth.getUserIdentity();
        if (!identity) {
            throw new ConvexError('Not authenticated');
        }

        const { userId, ...updates } = args;
        await ctx.db.patch(userId, updates);
        return await ctx.db.get(userId);
    },
});
