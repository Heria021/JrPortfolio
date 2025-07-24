import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { portfolioSchema } from "@/lib/validations/auth"

// Mock portfolio data for demo purposes
// In production, this would come from a database
const mockPortfolioEntries = [
  {
    id: "1",
    slug: "modern-residential-complex",
    title: "Modern Residential Complex",
    description: "A sustainable residential project featuring contemporary design elements, green building materials, and energy-efficient systems. This project showcases innovative architectural solutions for urban living.",
    category: "Residential",
    tags: "sustainable, modern, residential, urban",
    completionDate: "2024-01-15",
    images: [
      {
        url: "/pexels-heyho-6969873.jpg",
        public_id: "portfolio/residential_1",
        width: 1920,
        height: 1080,
      },
      {
        url: "/pexels-heyho-6758788.jpg",
        public_id: "portfolio/residential_2",
        width: 1920,
        height: 1080,
      },
    ],
    createdAt: "2024-01-20T10:00:00.000Z",
    updatedAt: "2024-01-20T10:00:00.000Z",
  },
  {
    id: "2",
    slug: "commercial-office-tower",
    title: "Commercial Office Tower",
    description: "A 25-story commercial office building designed with cutting-edge sustainability features and modern workspace concepts. The building incorporates natural lighting and flexible floor plans.",
    category: "Commercial",
    tags: "commercial, office, sustainable, modern",
    completionDate: "2023-11-30",
    images: [
      {
        url: "/pexels-ansar-muhammad-380085065-23916863.jpg",
        public_id: "portfolio/commercial_1",
        width: 1920,
        height: 1080,
      },
    ],
    createdAt: "2023-12-01T10:00:00.000Z",
    updatedAt: "2023-12-01T10:00:00.000Z",
  },
  {
    id: "3",
    slug: "luxury-villa-design",
    title: "Luxury Villa Design",
    description: "An exclusive luxury villa featuring panoramic views, infinity pools, and seamless indoor-outdoor living spaces. The design emphasizes privacy, comfort, and architectural elegance.",
    category: "Residential",
    tags: "luxury, villa, residential, modern",
    completionDate: "2023-09-20",
    images: [
      {
        url: "/pexels-ansar-muhammad-380085065-27562200.jpg",
        public_id: "portfolio/villa_1",
        width: 1920,
        height: 1080,
      },
    ],
    createdAt: "2023-09-25T10:00:00.000Z",
    updatedAt: "2023-09-25T10:00:00.000Z",
  },
]

export async function GET(request: NextRequest) {
  try {
    // Check authentication
    const session = await getServerSession(authOptions)
    if (!session || session.user.role !== "admin") {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      )
    }

    // Return mock portfolio entries
    // In production, this would fetch from a database
    return NextResponse.json(
      {
        message: "Portfolio entries retrieved successfully",
        data: mockPortfolioEntries
      },
      { status: 200 }
    )
  } catch (error) {
    console.error("Portfolio fetch error:", error)

    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    // Check authentication
    const session = await getServerSession(authOptions)
    if (!session || session.user.role !== "admin") {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      )
    }

    // Parse and validate request body
    const body = await request.json()
    const validatedData = portfolioSchema.parse(body)

    // Generate slug from title
    const slug = validatedData.title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "")

    // Create new portfolio entry
    const portfolioEntry = {
      id: Date.now().toString(), // In production, use proper ID generation
      slug,
      ...validatedData,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }

    // Add to mock data (in production, save to database)
    mockPortfolioEntries.unshift(portfolioEntry)

    console.log("Portfolio entry created:", portfolioEntry)

    return NextResponse.json(
      { 
        message: "Portfolio entry created successfully",
        data: portfolioEntry
      },
      { status: 201 }
    )
  } catch (error) {
    console.error("Portfolio creation error:", error)
    
    if (error instanceof Error && error.name === "ZodError") {
      return NextResponse.json(
        { error: "Validation failed", details: error.message },
        { status: 400 }
      )
    }

    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}
