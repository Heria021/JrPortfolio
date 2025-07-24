"use client"

import React, { useCallback, useState } from "react"
import { useDropzone } from "react-dropzone"
import { X, Upload, Image as ImageIcon, GripVertical } from "lucide-react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { cn } from "@/lib/utils"
import { useCloudinaryUpload, type CloudinaryImage } from "@/hooks/use-cloudinary-upload"

interface ImageUploadProps {
  images: CloudinaryImage[]
  onImagesChange: (images: CloudinaryImage[]) => void
  maxImages?: number
  className?: string
}

export function ImageUpload({
  images,
  onImagesChange,
  maxImages = 10,
  className,
}: ImageUploadProps) {
  const { uploadMultipleImages, isUploading, uploadProgress } = useCloudinaryUpload()
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null)

  const onDrop = useCallback(
    async (acceptedFiles: File[]) => {
      if (images.length + acceptedFiles.length > maxImages) {
        alert(`Maximum ${maxImages} images allowed`)
        return
      }

      try {
        const uploadedImages = await uploadMultipleImages(acceptedFiles)
        onImagesChange([...images, ...uploadedImages])
      } catch (error) {
        console.error("Upload failed:", error)
      }
    },
    [images, maxImages, onImagesChange, uploadMultipleImages]
  )

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "image/*": [".jpeg", ".jpg", ".png", ".webp"],
    },
    multiple: true,
    disabled: isUploading,
  })

  const removeImage = (index: number) => {
    const newImages = images.filter((_, i) => i !== index)
    onImagesChange(newImages)
  }

  const handleDragStart = (index: number) => {
    setDraggedIndex(index)
  }

  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault()
    if (draggedIndex === null || draggedIndex === index) return

    const newImages = [...images]
    const draggedImage = newImages[draggedIndex]
    newImages.splice(draggedIndex, 1)
    newImages.splice(index, 0, draggedImage)
    
    onImagesChange(newImages)
    setDraggedIndex(index)
  }

  const handleDragEnd = () => {
    setDraggedIndex(null)
  }

  return (
    <div className={cn("space-y-4", className)}>
      {/* Upload Area */}
      <Card>
        <CardContent className="p-6">
          <div
            {...getRootProps()}
            className={cn(
              "border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors",
              isDragActive
                ? "border-primary bg-primary/5"
                : "border-muted-foreground/25 hover:border-primary/50",
              isUploading && "pointer-events-none opacity-50"
            )}
          >
            <input {...getInputProps()} />
            <div className="flex flex-col items-center gap-2">
              <Upload className="h-8 w-8 text-muted-foreground" />
              <div className="text-sm">
                {isDragActive ? (
                  <p>Drop the images here...</p>
                ) : (
                  <div>
                    <p className="font-medium">
                      Drag & drop images here, or click to select
                    </p>
                    <p className="text-muted-foreground">
                      PNG, JPG, JPEG, WEBP up to 10MB each
                    </p>
                  </div>
                )}
              </div>
              {!isDragActive && (
                <Button type="button" variant="outline" size="sm" disabled={isUploading}>
                  <ImageIcon className="h-4 w-4 mr-2" />
                  Choose Images
                </Button>
              )}
            </div>
          </div>

          {/* Upload Progress */}
          {isUploading && uploadProgress && (
            <div className="mt-4">
              <div className="flex justify-between text-sm mb-2">
                <span>Uploading...</span>
                <span>{uploadProgress.percentage}%</span>
              </div>
              <Progress value={uploadProgress.percentage} />
            </div>
          )}
        </CardContent>
      </Card>

      {/* Image Preview Grid */}
      {images.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {images.map((image, index) => (
            <Card
              key={image.public_id}
              className="relative group cursor-move"
              draggable
              onDragStart={() => handleDragStart(index)}
              onDragOver={(e) => handleDragOver(e, index)}
              onDragEnd={handleDragEnd}
            >
              <CardContent className="p-2">
                <div className="relative aspect-square">
                  <Image
                    src={image.url}
                    alt={`Upload ${index + 1}`}
                    fill
                    className="object-cover rounded-md"
                    sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
                  />
                  
                  {/* Remove Button */}
                  <Button
                    type="button"
                    variant="destructive"
                    size="icon"
                    className="absolute top-1 right-1 h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
                    onClick={() => removeImage(index)}
                  >
                    <X className="h-3 w-3" />
                  </Button>

                  {/* Drag Handle */}
                  <div className="absolute top-1 left-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <GripVertical className="h-4 w-4 text-white drop-shadow-md" />
                  </div>

                  {/* Image Info */}
                  <div className="absolute bottom-1 left-1 right-1 bg-black/50 text-white text-xs p-1 rounded opacity-0 group-hover:opacity-100 transition-opacity">
                    {image.width} × {image.height}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Image Count */}
      {images.length > 0 && (
        <p className="text-sm text-muted-foreground text-center">
          {images.length} of {maxImages} images uploaded
        </p>
      )}
    </div>
  )
}
