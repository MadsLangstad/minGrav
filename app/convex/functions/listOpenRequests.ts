// convex/functions/listOpenRequests.ts
import { v } from 'convex/values';
import { query } from '../_generated/server';
import { Id } from '../_generated/dataModel';

export const listOpenRequests = query({
    args: {},
    handler: async (ctx) => {
        return await ctx.db
            .query('requests')
            .filter((q) => q.eq(q.field('status'), 'open'))
            .collect();
    },
});

export const getUserGraves = query({
    args: {
        userId: v.id('users'),
    },
    handler: async (ctx, args) => {
        return await ctx.db
            .query('graves')
            .filter((q) => q.eq(q.field('ownerId'), args.userId))
            .collect();
    },
});

export const getGraveRequests = query({
    args: {
        graveId: v.id('graves'),
    },
    handler: async (ctx, args) => {
        return await ctx.db
            .query('requests')
            .filter((q) => q.eq(q.field('graveId'), args.graveId))
            .collect();
    },
});

export const getCaretakerAssignments = query({
    args: {
        caretakerId: v.id('users'),
    },
    handler: async (ctx, args) => {
        return await ctx.db
            .query('assignments')
            .filter((q) => q.eq(q.field('caretakerId'), args.caretakerId))
            .collect();
    },
});
