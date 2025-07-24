import { NextRequest, NextResponse } from "next/server"
import { getAllPortfolioEntries } from "@/lib/storage/portfolio-storage"

export async function GET(request: NextRequest) {
  try {
    // Get portfolio entries from file storage (no authentication required for public access)
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
