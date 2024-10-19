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

interface FormField {
  id: string
  name: string
  type: "string" | "number" | "email" | "textarea" | "stars"
  required: boolean
  value: string | number
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
            className="w-full bg-white/90 backdrop-blur-sm"
          />
        )
      case "textarea":
        return (
          <Textarea
            placeholder={`Enter ${field.name.toLowerCase()}`}
            className="min-h-[100px] w-full bg-white/90 backdrop-blur-sm"
          />
        )
      case "stars":
        return <StarRating value={Number(field.value)} onChange={() => {}} />
      default:
        return null
    }
  }

  const StarRating = ({
    value,
    onChange,
  }: {
    value: number
    onChange: (value: number) => void
  }) => (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <Star
          key={star}
          className={`h-6 w-6 cursor-pointer ${
            star <= value ? "fill-yellow-400 text-yellow-400" : "text-gray-300"
          }`}
          onClick={() => onChange(star)}
        />
      ))}
    </div>
  )

  return (
    <Card
      className="overflow-hidden"
      style={
        projectData.style.type === "gradient"
          ? { background: projectData.style.value }
          : {
              backgroundImage: `url(${projectData.style.value})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
            }
      }
    >
      <div className="bg-black/50 backdrop-blur-[1px]">
        <CardHeader className="text-white">
          <CardTitle className="text-2xl">{projectData.name}</CardTitle>
          <CardDescription className="text-white/90">
            {projectData.description}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form className="space-y-6 text-black">
            {projectData.fields.map((field) => (
              <div key={field.id} className="space-y-2">
                <Label className="text-white">
                  {field.name}
                  {field.required && (
                    <span className="ml-1 text-red-300">*</span>
                  )}
                </Label>
                {renderPreviewField(field)}
              </div>
            ))}
            <Button
              type="submit"
              className="w-full bg-white/90 text-gray-800 hover:bg-white"
            >
              Submit Feedback
            </Button>
          </form>
        </CardContent>
      </div>
    </Card>
  )
}
