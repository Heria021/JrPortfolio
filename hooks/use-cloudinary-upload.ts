"use client"

import { useState } from "react"
import { toast } from "sonner"

export interface CloudinaryImage {
  url: string
  public_id: string
  width: number
  height: number
}

export interface UploadProgress {
  loaded: number
  total: number
  percentage: number
}

export function useCloudinaryUpload() {
  const [isUploading, setIsUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState<UploadProgress | null>(null)

  const uploadImage = async (file: File): Promise<CloudinaryImage> => {
    // For demo purposes, we'll simulate an upload and return a mock response
    // In production, you would configure Cloudinary with proper credentials
    return new Promise((resolve, reject) => {
      setIsUploading(true)
      setUploadProgress({ loaded: 0, total: file.size, percentage: 0 })

      // Simulate upload progress
      const simulateProgress = () => {
        let progress = 0
        const interval = setInterval(() => {
          progress += Math.random() * 30
          if (progress >= 100) {
            progress = 100
            clearInterval(interval)

            // Simulate successful upload response
            setTimeout(() => {
              setIsUploading(false)
              setUploadProgress(null)

              // Create a mock Cloudinary response
              const mockResponse: CloudinaryImage = {
                url: URL.createObjectURL(file), // Use blob URL for demo
                public_id: `portfolio/${Date.now()}_${file.name}`,
                width: 800, // Mock dimensions
                height: 600,
              }

              resolve(mockResponse)
            }, 500)
          } else {
            setUploadProgress({
              loaded: Math.round((progress / 100) * file.size),
              total: file.size,
              percentage: Math.round(progress),
            })
          }
        }, 100)
      }

      // Validate file type and size
      if (!file.type.startsWith('image/')) {
        setIsUploading(false)
        setUploadProgress(null)
        reject(new Error('Please select a valid image file'))
        return
      }

      if (file.size > 10 * 1024 * 1024) { // 10MB limit
        setIsUploading(false)
        setUploadProgress(null)
        reject(new Error('File size must be less than 10MB'))
        return
      }

      simulateProgress()
    })
  }

  const uploadMultipleImages = async (files: File[]): Promise<CloudinaryImage[]> => {
    const uploadPromises = files.map(uploadImage)
    
    try {
      const results = await Promise.all(uploadPromises)
      toast.success(`Successfully uploaded ${results.length} image(s)`)
      return results
    } catch (error) {
      toast.error("Failed to upload one or more images")
      throw error
    }
  }

  return {
    uploadImage,
    uploadMultipleImages,
    isUploading,
    uploadProgress,
  }
}
