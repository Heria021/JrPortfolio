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
    // Validate file type and size first
    if (!file.type.startsWith('image/')) {
      throw new Error('Please select a valid image file')
    }

    if (file.size > 10 * 1024 * 1024) { // 10MB limit
      throw new Error('File size must be less than 10MB')
    }

    const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME
    const uploadPreset = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET

    console.log('Cloudinary config check:', {
      cloudName: cloudName ? 'Set' : 'Missing',
      uploadPreset: uploadPreset ? 'Set' : 'Missing',
      actualCloudName: cloudName,
      actualUploadPreset: uploadPreset
    })

    if (!cloudName || !uploadPreset) {
      throw new Error(`Cloudinary configuration missing. Cloud name: ${cloudName ? 'Set' : 'Missing'}, Upload preset: ${uploadPreset ? 'Set' : 'Missing'}`)
    }

    setIsUploading(true)
    setUploadProgress({ loaded: 0, total: file.size, percentage: 0 })

    try {
      const formData = new FormData()
      formData.append('file', file)
      formData.append('upload_preset', uploadPreset)
      formData.append('folder', 'portfolio')

      console.log('Uploading to Cloudinary:', {
        cloudName,
        uploadPreset,
        fileName: file.name,
        fileSize: file.size
      })

      const response = await fetch(
        `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
        {
          method: 'POST',
          body: formData,
          // Add headers to help with CORS and SSL issues
          headers: {
            'Accept': 'application/json',
          },
        }
      )

      console.log('Cloudinary response status:', response.status, response.statusText)

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        console.error('Cloudinary upload error:', {
          status: response.status,
          statusText: response.statusText,
          errorData
        })

        if (response.status === 400 && errorData.error?.message?.includes('Invalid upload preset')) {
          throw new Error('Upload preset "portfolio_uploads" not found. Please create it in your Cloudinary dashboard.')
        }
        if (response.status === 401) {
          throw new Error('Cloudinary authentication failed. Please check your upload preset configuration.')
        }
        throw new Error(`Upload failed: ${response.statusText} (${response.status})`)
      }

      const data = await response.json()
      console.log('Cloudinary upload successful:', {
        public_id: data.public_id,
        secure_url: data.secure_url
      })

      // Return Cloudinary response in our expected format
      const cloudinaryImage: CloudinaryImage = {
        url: data.secure_url,
        public_id: data.public_id,
        width: data.width,
        height: data.height,
      }

      setIsUploading(false)
      setUploadProgress(null)

      return cloudinaryImage
    } catch (error) {
      setIsUploading(false)
      setUploadProgress(null)

      console.error('Upload error details:', error)

      // Handle specific error types
      if (error instanceof TypeError && error.message.includes('Failed to fetch')) {
        throw new Error('Network error: Unable to connect to Cloudinary. Please check your internet connection and try again.')
      }

      if (error instanceof Error) {
        throw error
      }

      throw new Error('An unexpected error occurred during upload. Please try again.')
    }
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
