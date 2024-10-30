"use client"

import React from "react"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Star } from "lucide-react"
import { toast } from "sonner"

interface FormField {
  id: string
  name: string
  type: "string" | "number" | "email" | "textarea" | "stars"
  required: boolean
}

interface ProjectData {
  name: string
  description: string
  fields: FormField[]
  style: {
    type: "gradient" | "image"
    value: string
  }
}

interface PreviewCardProps {
  projectData: ProjectData
}

export default function PreviewCard({ projectData }: PreviewCardProps) {
  const renderPreviewField = (field: FormField) => {
    switch (field.type) {
      case "string":
      case "email":
      case "number":
        return (
          <Input
            type={field.type}
            placeholder={`Enter ${field.name.toLowerCase()}`}
            className="w-full border-zinc-700 bg-zinc-900/50 text-white placeholder:text-zinc-400 focus:border-[#FE8888] focus:ring-[#FE8888]/10"
          />
        )
      case "textarea":
        return (
          <Textarea
            placeholder={`Enter ${field.name.toLowerCase()}`}
            className="min-h-[100px] w-full border-zinc-700 bg-zinc-900/50 text-white placeholder:text-zinc-400 focus:border-[#FE8888] focus:ring-[#FE8888]/10"
          />
        )
      case "stars":
        return <StarRating value={3} />
      default:
        return null
    }
  }

  const StarRating = ({ value }: { value: number }) => (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <Star
          key={star}
          className={`h-6 w-6 cursor-pointer transition-colors ${
            star <= value ? "fill-[#FE8888] text-[#FE8888]" : "text-zinc-600"
          }`}
        />
      ))}
    </div>
  )

  const getBackgroundStyles = () => {
    if (projectData.style.type === "gradient") {
      return {
        background: projectData.style.value,
      }
    }

    return {
      backgroundImage: `linear-gradient(to bottom, rgba(24, 24, 27, 0.8), rgba(24, 24, 27, 0.95)), url(${projectData.style.value})`,
      backgroundSize: "cover",
      backgroundPosition: "center",
    }
  }

  return (
    <Card
      className="overflow-hidden border-zinc-800 bg-zinc-900/30 shadow-2xl"
      style={getBackgroundStyles()}
    >
      <div className="relative">
        <div className="absolute -left-32 -top-32 h-64 w-64 rounded-full bg-[#FE8888]/10 blur-3xl" />
        <div className="absolute -bottom-32 -right-32 h-64 w-64 rounded-full bg-[#FF555F]/10 blur-3xl" />
        <CardHeader className="relative">
          <CardTitle className="font-poppins text-2xl font-bold text-white">
            {projectData.name}
          </CardTitle>
          <CardDescription className="text-zinc-400">
            {projectData.description}
          </CardDescription>
        </CardHeader>
        <CardContent className="relative">
          <div className="space-y-6">
            {projectData.fields.map((field) => (
              <div key={field.id} className="space-y-2">
                <Label className="text-zinc-300">
                  {field.name}
                  {field.required && (
                    <span className="ml-1 text-[#FE8888]">*</span>
                  )}
                </Label>
                {renderPreviewField(field)}
              </div>
            ))}
            <Button
              className="w-full bg-[#FE8888] text-white transition-colors hover:bg-[#FF555F]"
              onClick={() => {
                toast.success("Just a preview")
              }}
            >
              Submit Feedback
            </Button>
          </div>
        </CardContent>
      </div>
    </Card>
  )
}
