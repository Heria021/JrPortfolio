import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { portfolioSchema } from "@/lib/validations/auth"
import { 
  getPortfolioEntryById, 
  updatePortfolioEntry, 
  deletePortfolioEntry 
} from "@/lib/storage/portfolio-storage"

export async function GET(
  request: NextRequest,
  { params }: { params: { projectId: string } }
) {
  try {
    // Check authentication
    const session = await getServerSession(authOptions)
    if (!session || session.user.role !== "admin") {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      )
    }

    const { projectId } = await params

    // Get portfolio entry by ID
    const portfolioEntry = await getPortfolioEntryById(projectId)
    
    if (!portfolioEntry) {
      return NextResponse.json(
        { error: "Project not found" },
        { status: 404 }
      )
    }
    
    return NextResponse.json(
      {
        message: "Project retrieved successfully",
        data: portfolioEntry
      },
      { status: 200 }
    )
  } catch (error) {
    console.error("Project fetch error:", error)

    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { projectId: string } }
) {
  try {
    // Check authentication
    const session = await getServerSession(authOptions)
    if (!session || session.user.role !== "admin") {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      )
    }

    const { projectId } = await params

    // Parse and validate request body
    const body = await request.json()
    const validatedData = portfolioSchema.parse(body)

    // Update portfolio entry
    const updatedEntry = await updatePortfolioEntry(projectId, validatedData)
    
    if (!updatedEntry) {
      return NextResponse.json(
        { error: "Project not found" },
        { status: 404 }
      )
    }

    console.log("Portfolio entry updated:", updatedEntry)

    return NextResponse.json(
      { 
        message: "Project updated successfully",
        data: updatedEntry
      },
      { status: 200 }
    )
  } catch (error) {
    console.error("Project update error:", error)
    
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

export async function DELETE(
  request: NextRequest,
  { params }: { params: { projectId: string } }
) {
  try {
    // Check authentication
    const session = await getServerSession(authOptions)
    if (!session || session.user.role !== "admin") {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      )
    }

    const { projectId } = await params

    // Delete portfolio entry
    const deleted = await deletePortfolioEntry(projectId)
    
    if (!deleted) {
      return NextResponse.json(
        { error: "Project not found" },
        { status: 404 }
      )
    }

    console.log("Portfolio entry deleted:", projectId)

    return NextResponse.json(
      { 
        message: "Project deleted successfully"
      },
      { status: 200 }
    )
  } catch (error) {
    console.error("Project delete error:", error)

    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}
