"use client"

import React from "react"
import { useEffect, useState, useMemo } from "react"
import { useRouter } from "next/navigation"
import { useSession, signOut } from "next-auth/react"
import Link from "next/link"
import Image from "next/image"
import { Upload, LogOut, Plus, FolderOpen, Calendar, Edit, ExternalLink } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { cn } from "@/lib/utils"
import { useQuery } from "convex/react"
import { api } from "@/convex/_generated/api"

interface PortfolioProject {
  _id: string
  slug: string
  title: string
  description: string
  category?: string
  tags?: string
  completionDate?: string
  images: Array<{
    url: string
    public_id: string
    width: number
    height: number
  }>
  createdAt: string
  updatedAt: string
}

interface AdminDashboardProps {
  className?: string
}

export default function AdminDashboard({ className = "" }: AdminDashboardProps) {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [projects, setProjects] = useState<PortfolioProject[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const convexProjects = useQuery(api.portfolio.list, {})

  useEffect(() => {
    if (status === "loading") return

    if (!session) {
      router.push("/admin/login")
      return
    }

    fetchProjects()
  }, [session, status, router])

  const fetchProjects = async () => {
    try {
      setIsLoading(true)
      setError(null)
      const result = convexProjects
      setProjects((result as unknown as PortfolioProject[]) || [])
    } catch (error) {
      console.error("Error fetching projects:", error)
      setError("Failed to load projects")
    } finally {
      setIsLoading(false)
    }
  }

  const handleSignOut = async () => {
    try {
      await signOut({ callbackUrl: "/admin/login" })
    } catch (error) {
      console.error("Failed to sign out:", error)
    }
  }

  // Session loading state
  if (status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-muted border-t-primary mx-auto" />
          <p className="text-sm text-muted-foreground">Loading...</p>
        </div>
      </div>
    )
  }

  if (!session) {
    return null
  }

  return (
    <div className={cn("min-h-screen bg-background", className)}>
      {/* Header */}
      <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            {/* Left - Logo and Title */}
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg flex items-center justify-center bg-primary">
                <FolderOpen className="h-4 w-4 text-primary-foreground" />
              </div>
              <div>
                <h1 className="text-xl font-semibold text-foreground">Portfolio Admin</h1>
                <p className="text-xs text-muted-foreground">Manage your architecture projects</p>
              </div>
            </div>

            {/* Right - Buttons */}
            <div className="flex items-center gap-2">
              <Link href="/admin/uploads">
                <Button className="rounded-lg px-2 lg:px-4">
                  <Upload className="h-4 w-4" />
                  <span className="hidden lg:inline ml-2">Upload Project</span>
                </Button>
              </Link>
              <Button
                variant="outline"
                onClick={handleSignOut}
                className="rounded-lg px-2 lg:px-4"
              >
                <LogOut className="h-4 w-4" />
                <span className="hidden lg:inline ml-2">Sign Out</span>
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <ProjectsList
          projects={projects}
          isLoading={isLoading}
          error={error}
          onRetry={fetchProjects}
        />
      </main>
    </div>
  )
}

interface ProjectsListProps {
  projects: PortfolioProject[]
  isLoading: boolean
  error: string | null
  onRetry: () => void
  className?: string
}

const ProjectsList = React.memo<ProjectsListProps>(({
  projects,
  isLoading,
  error,
  onRetry,
  className = "",
}) => {
  // Loading State
  if (isLoading) {
    return (
      <div className={cn("h-full border rounded-xl flex flex-col", className)}>
        <div className="p-6">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="border rounded-xl overflow-hidden">
                {/* Card Header Skeleton */}
                <div className="p-4 border-b border-border/50">
                  <div className="h-5 w-3/4 bg-muted rounded animate-pulse mb-2" />
                  <div className="h-3 w-1/2 bg-muted rounded animate-pulse" />
                </div>

                {/* Card Content Skeleton */}
                <div className="p-4 space-y-4">
                  {/* Image Skeleton */}
                  <div className="aspect-video w-full bg-muted rounded-lg animate-pulse" />

                  {/* Description Skeleton */}
                  <div className="space-y-2">
                    <div className="h-3 w-full bg-muted rounded animate-pulse" />
                    <div className="h-3 w-2/3 bg-muted rounded animate-pulse" />
                  </div>

                  {/* Metadata Skeleton */}
                  <div className="flex justify-between pt-2 border-t border-border/50">
                    <div className="h-3 w-16 bg-muted rounded animate-pulse" />
                    <div className="h-3 w-20 bg-muted rounded animate-pulse" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  // Error State
  if (error) {
    return (
      <div className={cn("h-full border rounded-xl flex items-center justify-center p-6", className)}>
        <div className="text-center space-y-4">
          <div className="h-12 w-12 rounded-full bg-destructive/10 flex items-center justify-center mx-auto">
            <FolderOpen className="h-6 w-6 text-destructive" />
          </div>
          <h3 className="font-medium">Failed to load projects</h3>
          <p className="text-sm text-muted-foreground">{error}</p>
          <Button variant="outline" size="sm" onClick={onRetry} className="rounded-lg">
            Try Again
          </Button>
        </div>
      </div>
    )
  }

  // Empty State
  if (projects.length === 0) {
    return (
      <div className={cn("h-full border rounded-xl flex items-center justify-center p-6", className)}>
        <div className="text-center space-y-4">
          <FolderOpen className="h-12 w-12 text-muted-foreground mx-auto" />
          <h3 className="font-medium">No projects yet</h3>
          <p className="text-sm text-muted-foreground">
            Start building your portfolio by uploading your first architecture project.
          </p>
          <Link href="/admin/uploads">
            <Button variant="outline" size="sm" className="rounded-lg">
              <Plus className="h-4 w-4 mr-1" />
              Upload Your First Project
            </Button>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className={cn("h-full border rounded-xl flex flex-col overflow-hidden", className)}>
      {/* Header */}
      <div className="flex-shrink-0 p-4 border-b border-border/50">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg flex items-center justify-center bg-primary">
            <FolderOpen className="h-4 w-4 text-primary-foreground" />
          </div>
          <div>
            <h3 className="text-base font-semibold text-foreground">Your Projects</h3>
            <p className="text-xs text-muted-foreground">
              {projects.length} project{projects.length !== 1 ? 's' : ''} in portfolio
            </p>
          </div>
        </div>
      </div>

      {/* Projects Grid */}
      <ScrollArea className="flex-1 overflow-hidden">
        <div className="p-6">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {projects.map((project) => (
              <ProjectCard key={project._id} project={project} />
            ))}
          </div>
        </div>
      </ScrollArea>
    </div>
  )
})

ProjectsList.displayName = "ProjectsList"

interface ProjectCardProps {
  project: PortfolioProject
  className?: string
}

const ProjectCard = React.memo<ProjectCardProps>(({ project, className = "" }) => {
  return (
    <Card className={cn("overflow-hidden hover:shadow-lg transition-all duration-200 hover:border-primary/20 rounded-xl", className)}>
      <CardHeader className="pb-3">
        <CardTitle className="line-clamp-1 text-base">{project.title}</CardTitle>
        {project.category && (
          <CardDescription className="text-xs">{project.category}</CardDescription>
        )}
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Image Preview */}
        {project.images.length > 0 && (
          <div className="relative aspect-video overflow-hidden rounded-lg border">
            <Image
              src={project.images[0].url}
              alt={project.title}
              fill
              className="object-cover transition-transform duration-200 hover:scale-105"
              sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
            />
          </div>
        )}

        {/* Description */}
        <p className="text-sm text-muted-foreground line-clamp-3">
          {project.description}
        </p>

        {/* Metadata */}
        <div className="flex items-center justify-between text-xs text-muted-foreground pt-2 border-t border-border/50">
          <div className="flex items-center gap-1">
            <span>{project.images.length} image{project.images.length !== 1 ? 's' : ''}</span>
          </div>
          {project.completionDate && (
            <div className="flex items-center gap-1">
              <Calendar className="h-3 w-3" />
              <span>{new Date(project.completionDate).toLocaleDateString()}</span>
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2 pt-3">
          <Link href={`/admin/${project._id}`} className="flex-1">
            <Button variant="outline" size="sm" className="w-full rounded-lg">
              <Edit className="h-3 w-3 mr-1" />
              Edit
            </Button>
          </Link>
          <Link href={`/portfolio/${project._id}`} className="flex-1">
            <Button variant="secondary" size="sm" className="w-full rounded-lg">
              <ExternalLink className="h-3 w-3 mr-1" />
              View
            </Button>
          </Link>
        </div>
      </CardContent>
    </Card>
  )
})

ProjectCard.displayName = "ProjectCard"