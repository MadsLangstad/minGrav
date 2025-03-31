import { ConvexError } from 'convex/values';
import { DatabaseReader } from '../_generated/server';

export async function getUser(ctx: {
    auth: { getUserIdentity: () => Promise<any> };
}) {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
        throw new ConvexError('Not authenticated');
    }
    return identity;
}

export async function getUserFromClerkId(
    ctx: { db: DatabaseReader },
    clerkId: string,
) {
    return await ctx.db
        .query('users')
        .filter((q) => q.eq(q.field('clerkId'), clerkId))
        .first();
}
