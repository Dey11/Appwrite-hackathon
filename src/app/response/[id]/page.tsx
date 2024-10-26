"use client"

import React, { useEffect, useState } from "react"
import dbService from "@/appwrite/db"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Star, Calendar, Mail, Hash, AlignLeft, Check, X } from "lucide-react"
import { motion } from "framer-motion"
import { ProjectDocument } from "@/appwrite/types"
import { FormField } from "@/app/projects/[id]/page"
import { useParams } from "next/navigation"

const FeedbackListing = () => {
  const { id }: { id: string } = useParams()
  const [projectData, setProjectData] = useState<ProjectDocument | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    async function getFeedback() {
      try {
        setIsLoading(true)
        const feedback = await dbService.findProjectById(id)
        if (feedback.success) {
          setProjectData({
            ...feedback.payload,
            style: JSON.parse(feedback.payload.image),
          })
        }
      } catch (error) {
        console.error("Error fetching feedback:", error)
      } finally {
        setIsLoading(false)
      }
    }
    getFeedback()
  }, [])

  const parseFields = (fieldsString: string): FormField[] => {
    try {
      return JSON.parse(fieldsString)
    } catch (error) {
      console.error("Error parsing fields:", error)
      return []
    }
  }

  const parseFeedbackData = (dataString: string) => {
    try {
      return JSON.parse(dataString)
    } catch (error) {
      console.error("Error parsing feedback data:", error)
      return {}
    }
  }

  const renderFieldIcon = (type: FormField["type"]) => {
    switch (type) {
      case "string":
        return <span className="text-blue-400">Aa</span>
      case "number":
        return <Hash className="text-green-400" />
      case "email":
        return <Mail className="text-purple-400" />
      case "textarea":
        return <AlignLeft className="text-yellow-400" />
      case "stars":
        return <Star className="text-orange-400" />
      default:
        return null
    }
  }

  const renderFieldValue = (field: FormField, value: any) => {
    switch (field.type) {
      case "stars":
        return (
          <div className="flex">
            {[1, 2, 3, 4, 5].map((star) => (
              <Star
                key={star}
                className={`h-5 w-5 ${
                  star <= value
                    ? "fill-yellow-400 text-yellow-400"
                    : "text-gray-300"
                }`}
              />
            ))}
          </div>
        )
      case "textarea":
        return <div className="max-h-20 overflow-y-auto">{value}</div>
      default:
        return value
    }
  }

  if (isLoading) {
    return (
      <div className="mt-36 px-4 sm:px-6 md:px-20">
        <h1 className="bg-gradient-to-bl from-[#FF555F] to-[#FE8888] bg-clip-text py-2 text-center text-3xl font-semibold text-transparent sm:text-4xl md:text-5xl">
          Feedback Insights
        </h1>
        <p className="text-center text-xs text-zinc-400 sm:text-sm">
          Analyzing your valuable feedback
        </p>
        <main className="flex flex-col gap-6">
          <div className="flex h-96 items-center justify-center">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-[#FE8888] border-t-transparent" />
          </div>
        </main>
      </div>
    )
  }

  if (!projectData) {
    return (
      <div className="mt-36 px-4 sm:px-6 md:px-20">
        <h1 className="bg-gradient-to-bl from-[#FF555F] to-[#FE8888] bg-clip-text py-2 text-center text-3xl font-semibold text-transparent sm:text-4xl md:text-5xl">
          Feedback Void
        </h1>
        <p className="text-center text-xs text-zinc-400 sm:text-sm">
          No feedback available yet. Stay tuned!
        </p>
      </div>
    )
  }

  const fields = parseFields(projectData.fields)

  return (
    <div className="mt-36 px-4 sm:px-6 md:px-20">
      <h1 className="bg-gradient-to-bl from-[#FF555F] to-[#FE8888] bg-clip-text py-2 text-center text-3xl font-semibold text-transparent sm:text-4xl md:text-5xl">
        {projectData.name} Feedback
      </h1>
      <p className="mb-8 text-center text-xs text-zinc-400 sm:text-sm">
        {projectData.description}
      </p>
      <main className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {projectData.feedback.map((item: any, index: number) => {
          const feedbackData = parseFeedbackData(item.data)
          return (
            <motion.div
              key={item.$id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <Card className="overflow-hidden border border-zinc-700 bg-zinc-900 transition-all hover:scale-[1.02] hover:shadow-lg">
                <CardHeader className="relative h-24 overflow-hidden rounded-t-md">
                  <div
                    className="absolute inset-0 bg-cover bg-center"
                    style={
                      projectData.style.type === "gradient"
                        ? { background: projectData.style.value }
                        : { backgroundImage: `url(${projectData.style.value})` }
                    }
                  />
                  <div className="absolute -inset-2 bg-black/40 backdrop-blur-[1px]" />
                  <CardTitle className="relative z-10 flex items-center justify-between text-white">
                    <span className="truncate text-lg font-bold">
                      Feedback #{index + 1}
                    </span>
                    <Badge
                      variant="outline"
                      className="bg-white/10 text-xs text-white"
                    >
                      <Calendar className="mr-1 h-3 w-3" />
                      {new Date(item.$createdAt).toLocaleDateString()}
                    </Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-4">
                  <div className="space-y-2">
                    {fields.map((field) => (
                      <div
                        key={field.name}
                        className="flex items-center space-x-2"
                      >
                        <div className="flex h-6 w-6 items-center justify-center">
                          {renderFieldIcon(field.type)}
                        </div>
                        <span className="font-medium text-zinc-300">
                          {field.name}:
                        </span>
                        <span className="text-zinc-400">
                          {renderFieldValue(field, feedbackData[field.name])}
                        </span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )
        })}
      </main>
    </div>
  )
}

export default FeedbackListing
