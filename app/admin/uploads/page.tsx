"use client"

import React, { useEffect, useRef, useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { toast } from "sonner"
import { format } from "date-fns"
import Link from "next/link"
import {
  CalendarIcon,
  TagIcon,
  FolderIcon,
  ImageIcon,
  Upload,
  ArrowLeft,
  FileText,
  X,
  RotateCcw,
  Eye,
  Star,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import { DatePicker } from "@/components/ui/date-picker"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"

import { portfolioSchema, type PortfolioFormData } from "@/lib/validations/auth"
import { useCloudinaryUpload, type CloudinaryImage } from "@/hooks/use-cloudinary-upload"
import { cn } from "@/lib/utils"
import { useMutation } from "convex/react"
import { api } from "@/convex/_generated/api"

// Category options for the dropdown
const CATEGORY_OPTIONS = [
  "Residential",
  "Commercial",
  "Interior Design",
  "Landscape",
  "Urban Planning",
  "Renovation",
  "Sustainable Design",
  "Mixed-Use",
  "Hospitality",
  "Educational",
  "Healthcare",
  "Industrial"
]

// Example tags that users can quickly select
const EXAMPLE_TAGS = [
  "modern",
  "minimalist",
  "sustainable",
  "luxury",
  "contemporary",
  "traditional",
  "eco-friendly",
  "smart-home",
  "open-concept",
  "natural-light",
  "energy-efficient",
  "innovative"
]

interface PortfolioUploadPageProps {
  className?: string
}

export default function PortfolioUploadPage({ className = "" }: PortfolioUploadPageProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const createMutation = useMutation(api.portfolio.create)

  const form = useForm<PortfolioFormData>({
    resolver: zodResolver(portfolioSchema),
    defaultValues: {
      title: "",
      description: "",
      category: "",
      tags: "",
      completionDate: "",
      images: [],
    },
  })

  const onSubmit = async (data: PortfolioFormData) => {
    setIsSubmitting(true)

    try {
      const result = await createMutation(data)
      toast.success("Portfolio entry created successfully!")

      // Reset form after successful submission
      form.reset()

      console.log("Portfolio entry created:", result)

      // Redirect to admin dashboard
      window.location.href = "/admin"
    } catch (error) {
      console.error("Submission error:", error)
      toast.error(error instanceof Error ? error.message : "Failed to create portfolio entry")
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleImagesChange = (images: CloudinaryImage[]) => {
    form.setValue("images", images, { shouldValidate: true })
  }

  return (
    <div className={cn("min-h-screen bg-background", className)}>
      {/* Header */}
      <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            {/* Left side: Icon + Title */}
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg flex items-center justify-center bg-primary">
                <Upload className="h-4 w-4 text-primary-foreground" />
              </div>
              <div className="">
                <h1 className="text-xl font-semibold text-foreground">Upload Project</h1>
                <p className="text-xs text-muted-foreground">Add new architecture project to portfolio</p>
              </div>
            </div>

            {/* Right side: Button */}
            <Link href="/admin">
              <Button variant="outline" className="rounded-lg flex items-center gap-2 text-sm">
                <ArrowLeft className="h-4 w-4" />
                <span className="hidden sm:inline">Back to Dashboard</span>
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <ProjectUploadForm
          onSubmit={onSubmit}
          onImagesChange={handleImagesChange}
          form={form}
          isSubmitting={isSubmitting}
        />
      </main>
    </div>
  )
}

interface ProjectUploadFormProps {
  onSubmit: (data: PortfolioFormData) => Promise<void>
  onImagesChange: (images: CloudinaryImage[]) => void
  form: ReturnType<typeof useForm<PortfolioFormData>>
  isSubmitting: boolean
  className?: string
}

const ProjectUploadForm = React.memo<ProjectUploadFormProps>(({
  onSubmit,
  onImagesChange,
  form,
  isSubmitting,
  className = "",
}) => {
  return (
    <div className={cn("h-full border rounded-xl flex flex-col overflow-hidden", className)}>
      {/* Header */}
      <div className="flex-shrink-0 p-4 border-b border-border/50">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg flex items-center justify-center bg-primary">
            <FileText className="h-4 w-4 text-primary-foreground" />
          </div>
          <div>
            <h3 className="text-base font-semibold text-foreground">Project Details</h3>
            <p className="text-xs text-muted-foreground">
              Fill in the project information and upload images
            </p>
          </div>
        </div>
      </div>

      {/* Form Content */}
      <div className="flex-1 overflow-hidden">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="h-full flex flex-col">
            <ScrollArea className="flex-1 overflow-hidden">
              <div className="p-6 space-y-8">
                {/* Basic Information Section */}
                <FormSection
                  title="Basic Information"
                  icon={FileText}
                  description="Essential project details"
                >
                  <div className="space-y-6">
                    <FormField
                      control={form.control}
                      name="title"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Project Title *</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="Enter project title..."
                              className="rounded-lg"
                              {...field}
                            />
                          </FormControl>
                          <FormDescription>
                            A descriptive title for your architecture project
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="description"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Description *</FormLabel>
                          <FormControl>
                            <Textarea
                              placeholder="Describe your project, design approach, challenges, and solutions..."
                              className="min-h-[120px] rounded-lg"
                              {...field}
                            />
                          </FormControl>
                          <FormDescription>
                            Detailed description of the project (minimum 10 characters)
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </FormSection>

                {/* Additional Details Section */}
                <FormSection
                  title="Additional Details"
                  icon={TagIcon}
                  description="Category, tags, and completion date"
                >
                  <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <FormField
                        control={form.control}
                        name="category"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="flex items-center gap-2">
                              <FolderIcon className="h-4 w-4" />
                              Category
                            </FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <FormControl>
                                <SelectTrigger className="rounded-lg">
                                  <SelectValue placeholder="Select a category..." />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                {CATEGORY_OPTIONS.map((category) => (
                                  <SelectItem key={category} value={category}>
                                    {category}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                            <FormDescription>
                              Project category or type
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="completionDate"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="flex items-center gap-2">
                              <CalendarIcon className="h-4 w-4" />
                              Completion Date
                            </FormLabel>
                            <FormControl>
                              <DatePicker
                                value={field.value ? new Date(field.value) : undefined}
                                onChange={(date) => {
                                  field.onChange(date ? format(date, "yyyy-MM-dd") : "")
                                }}
                                placeholder="Select completion date..."
                                className="rounded-lg"
                              />
                            </FormControl>
                            <FormDescription>
                              When was this project completed?
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <FormField
                      control={form.control}
                      name="tags"
                      render={({ field }) => {
                        const addTag = (tag: string) => {
                          const currentTags = field.value ? field.value.split(',').map(t => t.trim()).filter(Boolean) : []
                          if (!currentTags.includes(tag)) {
                            const newTags = [...currentTags, tag].join(', ')
                            field.onChange(newTags)
                          }
                        }

                        return (
                          <FormItem>
                            <FormLabel className="flex items-center gap-2">
                              <TagIcon className="h-4 w-4" />
                              Tags
                            </FormLabel>
                            <FormControl>
                              <Input
                                placeholder="Enter tags separated by commas..."
                                className="rounded-lg"
                                {...field}
                              />
                            </FormControl>
                            <div className="space-y-2">
                              <FormDescription>
                                Click on example tags below to add them, or type your own (comma-separated)
                              </FormDescription>
                              <div className="flex flex-wrap gap-2">
                                {EXAMPLE_TAGS.map((tag) => (
                                  <Badge
                                    key={tag}
                                    variant="secondary"
                                    className="cursor-pointer hover:bg-primary hover:text-primary-foreground transition-colors"
                                    onClick={() => addTag(tag)}
                                  >
                                    {tag}
                                  </Badge>
                                ))}
                              </div>
                            </div>
                            <FormMessage />
                          </FormItem>
                        )
                      }}
                    />
                  </div>
                </FormSection>

                {/* Image Upload Section */}
                <FormSection
                  title="Project Images"
                  icon={ImageIcon}
                  description="Upload and organize your project photos"
                >
                  <FormField
                    control={form.control}
                    name="images"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Upload Images *</FormLabel>
                        <FormControl>
                          <ModernImageUpload
                            images={field.value}
                            onImagesChange={onImagesChange}
                            maxImages={10}
                          />
                        </FormControl>
                        <FormDescription>
                          Upload high-quality images and click to set their display order. First image will be used as the cover.
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </FormSection>
              </div>
            </ScrollArea>

            {/* Submit Button */}
            <div className="flex-shrink-0 p-6 border-t border-border/50 bg-background/50">
              <div className="flex justify-end">
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="min-w-[120px] rounded-lg"
                >
                  {isSubmitting ? (
                    <>
                      <div className="w-4 h-4 animate-spin rounded-full border-2 border-transparent border-t-current mr-2" />
                      Creating...
                    </>
                  ) : (
                    <>
                      <Upload className="h-4 w-4 mr-2" />
                      Create Project
                    </>
                  )}
                </Button>
              </div>
            </div>
          </form>
        </Form>
      </div>
    </div>
  )
})

ProjectUploadForm.displayName = "ProjectUploadForm"

interface FormSectionProps {
  title: string
  icon: React.ElementType
  description?: string
  children: React.ReactNode
  className?: string
}

const FormSection = React.memo<FormSectionProps>(({
  title,
  icon: Icon,
  description,
  children,
  className = ""
}) => {
  return (
    <div className={cn("space-y-4", className)}>
      <div className="flex items-start gap-3 pb-2">
        <div className="w-6 h-6 rounded-md flex items-center justify-center bg-primary/10">
          <Icon className="h-3.5 w-3.5 text-primary" />
        </div>
        <div className="flex-1">
          <h4 className="text-sm font-semibold text-foreground">{title}</h4>
          {description && (
            <p className="text-xs text-muted-foreground mt-1">{description}</p>
          )}
        </div>
      </div>
      <div className="pl-9">
        {children}
      </div>
      <Separator className="ml-9" />
    </div>
  )
})

FormSection.displayName = "FormSection"

interface ModernImageUploadProps {
  images: CloudinaryImage[]
  onImagesChange: (images: CloudinaryImage[]) => void
  maxImages: number
  className?: string
}

const ModernImageUpload = React.memo<ModernImageUploadProps>(({
  images,
  onImagesChange,
  maxImages,
  className = "",
}) => {
  const { uploadImageWithId, cancelUpload, perFileProgress, isUploading } = useCloudinaryUpload()
  const [selectedOrder, setSelectedOrder] = useState<Record<string, number>>({})
  const [hoveredImage, setHoveredImage] = useState<string | null>(null)
  const [isDragOver, setIsDragOver] = useState(false)
  const [pendingUploads, setPendingUploads] = useState<Record<string, { file: File; previewUrl: string; status: 'uploading' | 'success' | 'error'; }>>({})
  const imagesRef = useRef(images)

  useEffect(() => {
    imagesRef.current = images
  }, [images])

  const startUploads = async (files: File[]) => {
    const remaining = maxImages - images.length - Object.keys(pendingUploads).length
    if (files.length > remaining) {
      alert(`You can upload ${remaining} more image${remaining !== 1 ? 's' : ''}`)
      return
    }

    const localEntries = files.map((file, idx) => ({
      id: `${file.name}-${Date.now()}-${idx}`,
      file,
      previewUrl: URL.createObjectURL(file),
    }))

    setPendingUploads(prev => {
      const next = { ...prev }
      for (const { id, file, previewUrl } of localEntries) {
        next[id] = { file, previewUrl, status: 'uploading' }
      }
      return next
    })

    await Promise.all(
      localEntries.map(async ({ id, file }) => {
        try {
          const uploaded = await uploadImageWithId(file, id)
          const next = [...imagesRef.current, uploaded]
          imagesRef.current = next
          onImagesChange(next)
          setPendingUploads(prev => ({ ...prev, [id]: { ...prev[id], status: 'success' } }))
          setTimeout(() => {
            setPendingUploads(prev => {
              const { [id]: _, ...rest } = prev
              return rest
            })
          }, 800)
        } catch (err) {
          setPendingUploads(prev => ({ ...prev, [id]: { ...prev[id], status: 'error' } }))
        }
      })
    )
  }

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || [])
    if (files.length === 0) return
    await startUploads(files)
  }

  // Handle image ordering
  const handleImageClick = (imageId: string) => {
    const currentOrder = selectedOrder[imageId]
    const newOrder = { ...selectedOrder }

    if (currentOrder) {
      // Remove from order and shift others down
      delete newOrder[imageId]
      Object.keys(newOrder).forEach(id => {
        if (newOrder[id] > currentOrder) {
          newOrder[id]--
        }
      })
    } else {
      // Add to order
      const nextOrderNumber = Math.max(0, ...Object.values(newOrder)) + 1
      if (nextOrderNumber <= images.length) {
        newOrder[imageId] = nextOrderNumber
      }
    }

    setSelectedOrder(newOrder)

    // Reorder images based on selection
    const orderedImages = [...images].sort((a, b) => {
      const orderA = newOrder[a.public_id] || 999
      const orderB = newOrder[b.public_id] || 999
      return orderA - orderB
    })

    onImagesChange(orderedImages)
  }

  // Remove image
  const handleRemoveImage = (imageId: string, event: React.MouseEvent) => {
    event.stopPropagation()
    const newOrder = { ...selectedOrder }
    const removedOrder = newOrder[imageId]
    delete newOrder[imageId]

    // Shift remaining orders down
    if (removedOrder) {
      Object.keys(newOrder).forEach(id => {
        if (newOrder[id] > removedOrder) {
          newOrder[id]--
        }
      })
    }

    setSelectedOrder(newOrder)
    const updatedImages = images.filter(img => img.public_id !== imageId)
    onImagesChange(updatedImages)
  }

  // Reset order
  const resetOrder = () => {
    setSelectedOrder({})
    onImagesChange([...images])
  }

  // Drag and drop handlers
  const handleDragOver = (event: React.DragEvent) => {
    event.preventDefault()
    setIsDragOver(true)
  }

  const handleDragLeave = () => {
    setIsDragOver(false)
  }

  const handleDrop = async (event: React.DragEvent) => {
    event.preventDefault()
    setIsDragOver(false)

    const files = Array.from(event.dataTransfer.files).filter(file => file.type.startsWith('image/'))
    if (files.length === 0) return

    await startUploads(files)
  }

  // Retry a failed pending upload
  const retryUpload = async (uploadId: string) => {
    const entry = pendingUploads[uploadId]
    if (!entry) return
    setPendingUploads(prev => ({ ...prev, [uploadId]: { ...entry, status: 'uploading' } }))
    try {
      const uploaded = await uploadImageWithId(entry.file, uploadId)
      const next = [...imagesRef.current, uploaded]
      imagesRef.current = next
      onImagesChange(next)
      setPendingUploads(prev => ({ ...prev, [uploadId]: { ...entry, status: 'success' } }))
      setTimeout(() => {
        setPendingUploads(prev => {
          const { [uploadId]: _, ...rest } = prev
          return rest
        })
      }, 800)
    } catch (e) {
      setPendingUploads(prev => ({ ...prev, [uploadId]: { ...entry, status: 'error' } }))
    }
  }

  const orderedCount = Object.keys(selectedOrder).length
  const coverImage = images.find(img => selectedOrder[img.public_id] === 1)

  return (
    <div className={cn("space-y-6", className)}>
      {/* Upload Stats & Controls */}
      <div className="flex items-center justify-between p-4 bg-muted/30 rounded-lg border">
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-blue-500" />
            <span className="text-sm font-medium">{images.length}/{maxImages} images</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-green-500" />
            <span className="text-sm font-medium">{orderedCount} ordered</span>
          </div>
          {coverImage && (
            <div className="flex items-center gap-2">
              <Star className="w-3 h-3 text-yellow-500 fill-yellow-500" />
              <span className="text-sm font-medium">Cover set</span>
            </div>
          )}
        </div>
        {orderedCount > 0 && (
          <Button
            variant="outline"
            size="sm"
            onClick={resetOrder}
            className="rounded-lg text-xs"
          >
            <RotateCcw className="w-3 h-3 mr-1" />
            Reset Order
          </Button>
        )}
      </div>

      {/* Upload Area */}
      <div
        className={cn(
          "relative border-2 border-dashed rounded-xl p-8 transition-all duration-200",
          isDragOver
            ? "border-primary bg-primary/5 scale-[1.02]"
            : "border-muted-foreground/25 hover:border-primary/50",
          (images.length + Object.keys(pendingUploads).length >= maxImages) && "opacity-50 pointer-events-none"
        )}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <input
          type="file"
          multiple
          accept="image/*"
          onChange={handleFileSelect}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          disabled={images.length + Object.keys(pendingUploads).length >= maxImages}
        />
        <div className="text-center space-y-4">
          <div className={cn(
            "w-16 h-16 mx-auto rounded-full flex items-center justify-center transition-colors",
            isDragOver ? "bg-primary text-primary-foreground" : "bg-muted"
          )}>
            <Upload className="w-8 h-8" />
          </div>
          <div>
            <h4 className="font-medium text-foreground">{isDragOver ? "Drop images here" : "Upload project images"}</h4>
            <p className="text-sm text-muted-foreground mt-1">Drag & drop or click to select • JPG, PNG up to 10MB each</p>
          </div>
          {images.length + Object.keys(pendingUploads).length < maxImages && (
            <Button variant="outline" size="sm" className="rounded-lg">
              <Upload className="w-4 h-4 mr-2" />
              Choose Files
            </Button>
          )}
        </div>
      </div>

      {/* Pending Uploads Grid */}
      {Object.keys(pendingUploads).length > 0 && (
        <div className="space-y-2">
          <h4 className="font-medium text-sm">Uploading</h4>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {Object.entries(pendingUploads).map(([id, item]) => {
              const prog = perFileProgress[id]?.percentage ?? (item.status === 'success' ? 100 : 0)
              const isError = item.status === 'error'
              return (
                <div key={id} className={cn(
                  "relative group aspect-square rounded-xl overflow-hidden border shadow-sm bg-background",
                  isError ? "border-destructive/50" : "border-border"
                )}>
                  <img
                    src={item.previewUrl}
                    alt={item.file.name}
                    className={cn(
                      "w-full h-full object-cover transition duration-300",
                      item.status === 'uploading' ? "blur-sm opacity-90" : ""
                    )}
                  />
                  <div className="absolute inset-0 flex items-end">
                    <div className="w-full h-[3px] bg-muted/40">
                      <div
                        className={cn("h-full bg-green-500 transition-[width] duration-200")}
                        style={{ width: `${prog}%` }}
                      />
                    </div>
                  </div>
                  <div className="absolute inset-0 p-2 flex items-start justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    {item.status === 'uploading' && (
                      <Button size="icon" variant="secondary" className="rounded-full" onClick={() => cancelUpload(id)}>
                        <X className="w-4 h-4" />
                      </Button>
                    )}
                    {isError && (
                      <Button size="sm" variant="destructive" className="rounded-lg" onClick={() => retryUpload(id)}>
                        Retry
                      </Button>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      )}

      {/* Images Grid */}
      {images.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="font-medium text-sm">Uploaded Images</h4>
            <p className="text-xs text-muted-foreground">
              Click images to set display order • First ordered image becomes cover
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {images.map((image, index) => {
              const orderNumber = selectedOrder[image.public_id]
              const isCover = orderNumber === 1
              const isHovered = hoveredImage === image.public_id

              return (
                <div
                  key={image.public_id}
                  className={cn(
                    "relative group aspect-square rounded-xl overflow-hidden border shadow-sm hover:shadow-md transition",
                    orderNumber ? "border-primary border-2" : "border-border hover:border-primary/50"
                  )}
                  onClick={() => handleImageClick(image.public_id)}
                  onMouseEnter={() => setHoveredImage(image.public_id)}
                  onMouseLeave={() => setHoveredImage(null)}
                >
                  <img
                    src={image.url}
                    alt={`Upload ${index + 1}`}
                    className="w-full h-full object-cover transform transition duration-300 group-hover:scale-[1.02]"
                  />

                  {/* Order Number */}
                  {orderNumber && (
                    <div className="absolute top-2 left-2 w-7 h-7 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-bold">
                      {orderNumber}
                    </div>
                  )}

                  {/* Cover Badge */}
                  {isCover && (
                    <div className="absolute top-2 right-2 bg-yellow-500 text-yellow-900 px-2 py-1 rounded text-xs font-medium">
                      Cover
                    </div>
                  )}

                  {/* Hover Actions */}
                  <div className={cn(
                    "absolute inset-0 p-2 flex items-start justify-end gap-2",
                    isHovered ? "opacity-100" : "opacity-0",
                    "transition-opacity"
                  )}
                  >
                    <Button size="icon" variant="secondary" className="rounded-full" onClick={(e) => { e.stopPropagation(); window.open(image.url, '_blank') }}>
                      <Eye className="w-4 h-4" />
                    </Button>
                    <Button
                      onClick={(e) => handleRemoveImage(image.public_id, e)}
                      size="icon"
                      variant="destructive"
                      className="rounded-full"
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </div>

                  {/* Click Hint */}
                  {!orderNumber && isHovered && (
                    <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                      <div className="bg-white text-black px-3 py-1 rounded text-xs font-medium">
                        Click to order
                      </div>
                    </div>
                  )}
                </div>
              )
            })}
          </div>

          {/* Order Summary */}
          {orderedCount > 0 && (
            <div className="p-4 bg-primary/5 rounded-lg border border-primary/20">
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <Eye className="w-3 h-3 text-primary" />
                </div>
                <div className="flex-1">
                  <h5 className="text-sm font-medium text-foreground mb-1">Display Order Preview</h5>
                  <p className="text-xs text-muted-foreground mb-2">
                    Images will appear in this sequence in your portfolio
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {Array.from({ length: orderedCount }, (_, i) => i + 1).map(orderNum => {
                      const orderedImage = images.find(img => selectedOrder[img.public_id] === orderNum)
                      return orderedImage ? (
                        <div key={orderNum} className="flex items-center gap-2 bg-white rounded-lg p-2 border">
                          <span className="text-xs font-medium text-primary">{orderNum}.</span>
                          <img
                            src={orderedImage.url}
                            alt={`Position ${orderNum}`}
                            className="w-8 h-8 rounded object-cover"
                          />
                        </div>
                      ) : null
                    })}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
})

ModernImageUpload.displayName = "ModernImageUpload"