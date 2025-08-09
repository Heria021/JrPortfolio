"use client"

import React, { useState } from "react"
import { signIn, getSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { Eye, EyeOff, Home, AlertCircle, Shield } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { ScrollArea } from "@/components/ui/scroll-area"
import { cn } from "@/lib/utils"

interface AdminLoginProps {
  className?: string
}

/**
 * Loading skeleton following AppointmentsList patterns
 */
const LoginLoadingSkeleton = () => (
  <div className="space-y-4">
    {/* Email field skeleton */}
    <div className="space-y-2">
      <div className="h-4 w-12 bg-muted rounded animate-pulse" />
      <div className="h-10 w-full bg-muted rounded-lg animate-pulse" />
    </div>
    
    {/* Password field skeleton */}
    <div className="space-y-2">
      <div className="h-4 w-16 bg-muted rounded animate-pulse" />
      <div className="h-10 w-full bg-muted rounded-lg animate-pulse" />
    </div>
    
    {/* Button skeleton */}
    <div className="h-10 w-full bg-muted rounded-lg animate-pulse" />
  </div>
)

/**
 * AdminLogin Component
 * 
 * Converted to follow AppointmentsList UI standards and patterns
 * Authentication form with consistent styling and proper loading states
 */
export default function AdminLogin({ className = "" }: AdminLoginProps) {
  const router = useRouter()
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  })
  const [isLoading, setIsLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
    // Clear error when user starts typing
    if (error) setError(null)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)

    try {
      const result = await signIn("credentials", {
        email: formData.email,
        password: formData.password,
        redirect: false,
      })

      if (result?.error) {
        setError("Invalid email or password. Please try again.")
        return
      }

      // Check if sign in was successful
      const session = await getSession()
      if (session) {
        router.push("/admin")
        router.refresh()
      } else {
        setError("Authentication failed. Please try again.")
      }
    } catch (error) {
      console.error("Login error:", error)
      setError("An unexpected error occurred. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  const isFormValid = formData.email.trim() !== "" && formData.password.trim() !== ""

  return (
    <div className={cn("h-[100svh] min-h-[100svh] bg-background flex items-center justify-center p-4", className)}>
      <div className="w-full max-w-md">
        {/* Main Container - Following AppointmentsList container pattern */}
        <div className={cn("border rounded-xl flex flex-col overflow-hidden max-h-[calc(100svh-2rem)]")}> 
          {/* Header - Exact AppointmentsList header pattern */}
          <div className="flex-shrink-0 p-4 border-b border-border/50">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg flex items-center justify-center bg-primary">
                <Shield className="h-4 w-4 text-primary-foreground" />
              </div>
              <div>
                <h1 className="text-base font-semibold text-foreground">Admin Login</h1>
                <p className="text-xs text-muted-foreground">
                  Access your administrative dashboard
                </p>
              </div>
            </div>
          </div>

          {/* Content - Using ScrollArea pattern like AppointmentsList */}
          <ScrollArea className="flex-1 overflow-hidden">
            <div className="p-4 space-y-6">
              {/* Company Info Section */}
              <div className="text-center space-y-4">
                {/* Logo - Following AppointmentsList icon pattern */}
                <div className="flex justify-center">
                  <div className="w-12 h-12 rounded-lg bg-primary flex items-center justify-center">
                    <Home className="h-6 w-6 text-primary-foreground" />
                  </div>
                </div>

                {/* Company Name */}
                <div>
                  <h2 className="text-xl font-semibold text-foreground">
                    Jr Suthar & Designs
                  </h2>
                  <p className="text-sm text-muted-foreground mt-1">
                    Administrative Access Portal
                  </p>
                </div>
              </div>

              {/* Separator - Following AppointmentsList border pattern */}
              <div className="relative py-2">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t border-border/50" />
                </div>
              </div>

              {/* Error Alert - Following AppointmentsList empty state pattern for alerts */}
              {error && (
                <Alert variant="destructive" className="rounded-lg">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              {/* Login Form */}
              {isLoading ? (
                <LoginLoadingSkeleton />
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  {/* Email Field */}
                  <div className="space-y-2">
                    <Label htmlFor="email" className="text-sm font-medium">
                      Email
                    </Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      placeholder="Enter your email"
                      value={formData.email}
                      onChange={handleInputChange}
                      disabled={isLoading}
                      className="rounded-lg"
                      required
                    />
                  </div>

                  {/* Password Field */}
                  <div className="space-y-2">
                    <Label htmlFor="password" className="text-sm font-medium">
                      Password
                    </Label>
                    <div className="relative">
                      <Input
                        id="password"
                        name="password"
                        type={showPassword ? "text" : "password"}
                        placeholder="Enter your password"
                        value={formData.password}
                        onChange={handleInputChange}
                        disabled={isLoading}
                        className="rounded-lg pr-10"
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                        disabled={isLoading}
                      >
                        {showPassword ? (
                          <EyeOff className="h-4 w-4" />
                        ) : (
                          <Eye className="h-4 w-4" />
                        )}
                      </button>
                    </div>
                  </div>

                  {/* Submit Button - Following AppointmentsList button pattern */}
                  <Button
                    type="submit"
                    className="w-full rounded-lg font-medium"
                    disabled={!isFormValid || isLoading}
                  >
                    {isLoading ? (
                      <div className="flex items-center gap-2">
                        <div className="h-4 w-4 animate-spin rounded-full border-2 border-primary-foreground border-t-transparent" />
                        Signing In...
                      </div>
                    ) : (
                      "Sign In"
                    )}
                  </Button>
                </form>
              )}

              {/* Separator */}
              <div className="relative py-2">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t border-border/50" />
                </div>
              </div>

              {/* Footer */}
              <div className="text-center">
                <p className="text-xs text-muted-foreground">
                  © 2025 Jr Suthar & Designs. All rights reserved.
                </p>
              </div>
            </div>
          </ScrollArea>
        </div>

        {/* Additional Security Notice - Following AppointmentsList info pattern */}
        <div className="mt-4 text-center">
          <p className="text-xs text-muted-foreground">
            Secure administrative access • Protected by authentication
          </p>
        </div>
      </div>
    </div>
  )
}