"use client"

import { useCallback, useRef, useState } from "react"
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
  // Per-file progress keyed by a caller-provided uploadId
  const [perFileProgress, setPerFileProgress] = useState<Record<string, UploadProgress & { status: 'uploading' | 'success' | 'error'; errorMessage?: string }>>({})
  const activeRequestsRef = useRef<Record<string, XMLHttpRequest>>({})

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

      const response = await fetch(
        `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
        {
          method: 'POST',
          body: formData,
          headers: { 'Accept': 'application/json' },
        }
      )

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        if (response.status === 400 && (errorData as any).error?.message?.includes('Invalid upload preset')) {
          throw new Error('Upload preset "portfolio_uploads" not found. Please create it in your Cloudinary dashboard.')
        }
        if (response.status === 401) {
          throw new Error('Cloudinary authentication failed. Please check your upload preset configuration.')
        }
        throw new Error(`Upload failed: ${response.statusText} (${response.status})`)
      }

      const data = await response.json()
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
      if (error instanceof TypeError && error.message.includes('Failed to fetch')) {
        throw new Error('Network error: Unable to connect to Cloudinary. Please check your internet connection and try again.')
      }
      if (error instanceof Error) {
        throw error
      }
      throw new Error('An unexpected error occurred during upload. Please try again.')
    }
  }

  // Parallel upload with individual progress tracking using XHR
  const uploadImageWithId = useCallback(async (file: File, uploadId: string): Promise<CloudinaryImage> => {
    // Validate file
    if (!file.type.startsWith('image/')) throw new Error('Please select a valid image file')
    if (file.size > 10 * 1024 * 1024) throw new Error('File size must be less than 10MB')

    const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME
    const uploadPreset = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET
    if (!cloudName || !uploadPreset) {
      throw new Error('Cloudinary configuration missing. Please set NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME and NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET')
    }

    setPerFileProgress(prev => ({
      ...prev,
      [uploadId]: { loaded: 0, total: file.size, percentage: 0, status: 'uploading' },
    }))

    return new Promise<CloudinaryImage>((resolve, reject) => {
      const xhr = new XMLHttpRequest()
      activeRequestsRef.current[uploadId] = xhr

      xhr.upload.onprogress = (e) => {
        if (!e.lengthComputable) return
        const percentage = Math.round((e.loaded / e.total) * 100)
        setPerFileProgress(prev => ({
          ...prev,
          [uploadId]: { loaded: e.loaded, total: e.total, percentage, status: 'uploading' },
        }))
      }

      xhr.onreadystatechange = () => {
        if (xhr.readyState !== 4) return
        delete activeRequestsRef.current[uploadId]
        if (xhr.status >= 200 && xhr.status < 300) {
          try {
            const data = JSON.parse(xhr.responseText)
            const image: CloudinaryImage = {
              url: data.secure_url,
              public_id: data.public_id,
              width: data.width,
              height: data.height,
            }
            setPerFileProgress(prev => ({
              ...prev,
              [uploadId]: { ...(prev[uploadId] || { loaded: 0, total: 1, percentage: 100 }), status: 'success' },
            }))
            resolve(image)
          } catch (err) {
            setPerFileProgress(prev => ({
              ...prev,
              [uploadId]: { ...(prev[uploadId] || { loaded: 0, total: 1, percentage: 0 }), status: 'error', errorMessage: 'Invalid response from server' },
            }))
            reject(new Error('Invalid response from server'))
          }
        } else {
          const message = xhr.status === 0 ? 'Network error' : `Upload failed (${xhr.status})`
          setPerFileProgress(prev => ({
            ...prev,
            [uploadId]: { ...(prev[uploadId] || { loaded: 0, total: 1, percentage: 0 }), status: 'error', errorMessage: message },
          }))
          reject(new Error(message))
        }
      }

      const formData = new FormData()
      formData.append('file', file)
      formData.append('upload_preset', uploadPreset)
      formData.append('folder', 'portfolio')

      xhr.open('POST', `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`)
      xhr.setRequestHeader('Accept', 'application/json')
      xhr.send(formData)
    })
  }, [])

  const cancelUpload = useCallback((uploadId: string) => {
    const req = activeRequestsRef.current[uploadId]
    if (req) {
      req.abort()
      delete activeRequestsRef.current[uploadId]
      setPerFileProgress(prev => ({
        ...prev,
        [uploadId]: { ...(prev[uploadId] || { loaded: 0, total: 1, percentage: 0 }), status: 'error', errorMessage: 'Cancelled' },
      }))
    }
  }, [])

  const clearProgress = useCallback((uploadId: string) => {
    setPerFileProgress(prev => {
      const { [uploadId]: _, ...rest } = prev
      return rest
    })
  }, [])

  const uploadMultipleImages = async (files: File[]): Promise<CloudinaryImage[]> => {
    // Still expose a convenience function, run fully in parallel
    try {
      const results = await Promise.all(files.map((file, index) => uploadImage(file)))
      toast.success(`Successfully uploaded ${results.length} image(s)`)
      return results
    } catch (error) {
      toast.error("Failed to upload one or more images")
      throw error
    }
  }

  return {
    uploadImage,
    uploadImageWithId,
    uploadMultipleImages,
    cancelUpload,
    clearProgress,
    isUploading,
    uploadProgress,
    perFileProgress,
  }
}
