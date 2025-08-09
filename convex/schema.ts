import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  portfolio: defineTable({
    title: v.string(),
    description: v.string(),
    category: v.optional(v.string()),
    tags: v.optional(v.string()),
    completionDate: v.optional(v.string()),
    images: v.array(
      v.object({
        url: v.string(),
        public_id: v.string(),
        width: v.number(),
        height: v.number(),
      }),
    ),
    slug: v.string(),
    createdAt: v.string(),
    updatedAt: v.string(),
  })
    // helpful indexes for reads
    .index("by_createdAt", ["createdAt"]) // ISO string, fine for sort/filter
    .index("by_slug", ["slug"]),
});


