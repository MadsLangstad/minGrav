// convex/functions/createRequest.ts
import { mutation } from '../_generated/server';
import { v } from 'convex/values';
import { Id } from '../_generated/dataModel';

export const createRequest = mutation({
    args: {
        userId: v.id('users'),
        graveId: v.id('graves'),
        description: v.string(),
        preferredDate: v.string(), // ISO date string
    },
    handler: async (ctx, args) => {
        const requestId = await ctx.db.insert('requests', {
            ...args,
            status: 'open',
            createdAt: Date.now(),
        });

        return await ctx.db.get(requestId);
    },
});

export const updateRequestStatus = mutation({
    args: {
        requestId: v.id('requests'),
        status: v.union(
            v.literal('open'),
            v.literal('assigned'),
            v.literal('completed'),
        ),
    },
    handler: async (ctx, args) => {
        const { requestId, status } = args;
        await ctx.db.patch(requestId, { status });
        return await ctx.db.get(requestId);
    },
});

export const assignRequest = mutation({
    args: {
        requestId: v.id('requests'),
        caretakerId: v.id('users'),
    },
    handler: async (ctx, args) => {
        const { requestId, caretakerId } = args;

        // Update request status
        await ctx.db.patch(requestId, { status: 'assigned' });

        // Create assignment
        const assignmentId = await ctx.db.insert('assignments', {
            requestId,
            caretakerId,
            acceptedAt: Date.now(),
        });

        return await ctx.db.get(assignmentId);
    },
});
