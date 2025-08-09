import { v } from "convex/values";
import { query, mutation } from "./_generated/server";

function generateSlugFromTitle(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export const list = query({
  args: {},
  handler: async (ctx) => {
    const items = await ctx.db.query("portfolio").collect();
    // Sort newest first by createdAt ISO string
    return items.sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1));
  },
});

export const getById = query({
  args: { id: v.id("portfolio") },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.id);
  },
});

export const getBySlug = query({
  args: { slug: v.string() },
  handler: async (ctx, args) => {
    const match = await ctx.db
      .query("portfolio")
      .withIndex("by_slug", (q) => q.eq("slug", args.slug))
      .first();
    return match ?? null;
  },
});

export const create = mutation({
  args: {
    title: v.string(),
    description: v.string(),
    category: v.optional(v.string()),
    tags: v.optional(v.string()),
    completionDate: v.optional(v.string()),
    images: v.array(
      v.object({ url: v.string(), public_id: v.string(), width: v.number(), height: v.number() })
    ),
  },
  handler: async (ctx, args) => {
    const now = new Date().toISOString();
    const slug = generateSlugFromTitle(args.title);
    const docId = await ctx.db.insert("portfolio", {
      ...args,
      slug,
      createdAt: now,
      updatedAt: now,
    });
    return await ctx.db.get(docId);
  },
});

export const update = mutation({
  args: {
    id: v.id("portfolio"),
    title: v.optional(v.string()),
    description: v.optional(v.string()),
    category: v.optional(v.string()),
    tags: v.optional(v.string()),
    completionDate: v.optional(v.string()),
    images: v.optional(
      v.array(
        v.object({ url: v.string(), public_id: v.string(), width: v.number(), height: v.number() })
      )
    ),
  },
  handler: async (ctx, args) => {
    const { id, ...updates } = args;
    const existing = await ctx.db.get(id);
    if (!existing) return null;
    const nextTitle = updates.title ?? existing.title;
    const slug = generateSlugFromTitle(nextTitle);
    await ctx.db.patch(id, { ...updates, slug, updatedAt: new Date().toISOString() });
    return await ctx.db.get(id);
  },
});

export const remove = mutation({
  args: { id: v.id("portfolio") },
  handler: async (ctx, args) => {
    await ctx.db.delete(args.id);
    return true;
  },
});


