import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { portfolioSchema } from "@/lib/validations/auth"
import { getAllPortfolioEntries, createPortfolioEntry } from "@/lib/storage/portfolio-storage"

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

    // Get portfolio entries from file storage
    const portfolioEntries = await getAllPortfolioEntries()

    return NextResponse.json(
      {
        message: "Portfolio entries retrieved successfully",
        data: portfolioEntries
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

    // Create new portfolio entry using file storage
    const portfolioEntry = await createPortfolioEntry(validatedData)

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
