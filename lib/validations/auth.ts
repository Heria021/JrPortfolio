import { z } from "zod"

export const loginSchema = z.object({
  email: z
    .string()
    .min(1, "Email is required")
    .email("Please enter a valid email address"),
  password: z
    .string()
    .min(6, "Password must be at least 6 characters long")
    .max(100, "Password must be less than 100 characters"),
})

export type LoginFormData = z.infer<typeof loginSchema>

// Portfolio validation schema
export const portfolioSchema = z.object({
  title: z
    .string()
    .min(3, "Title must be at least 3 characters long")
    .max(100, "Title must be less than 100 characters"),
  description: z
    .string()
    .min(10, "Description must be at least 10 characters long")
    .max(1000, "Description must be less than 1000 characters"),
  category: z
    .string()
    .optional(),
  tags: z
    .string()
    .optional(),
  completionDate: z
    .string()
    .optional(),
  images: z
    .array(
      z.object({
        url: z.string().url("Invalid image URL"),
        public_id: z.string().min(1, "Public ID is required"),
        width: z.number().positive("Width must be positive"),
        height: z.number().positive("Height must be positive"),
      })
    )
    .min(1, "At least one image is required")
    .max(10, "Maximum 10 images allowed"),
})

export type PortfolioFormData = z.infer<typeof portfolioSchema>
