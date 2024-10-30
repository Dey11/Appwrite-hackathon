"use client"

import React, { useEffect, useState } from "react"
import dbService from "@/appwrite/db"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Star, Calendar, Mail, Hash, AlignLeft, ArrowLeft } from "lucide-react"
import { motion } from "framer-motion"
import { ProjectDocument } from "@/appwrite/types"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
} from "@/components/ui/breadcrumb"
import { useParams, useRouter } from "next/navigation"
import { useCheckSession } from "@/components/hooks/check-session"
import { useStore } from "@/lib/store"
import { FormField } from "@/schema/project"

const FeedbackListing = () => {
  const { id }: { id: string } = useParams()
  const [projectData, setProjectData] = useState<ProjectDocument | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  const { user, loading } = useCheckSession()
  const { authState } = useStore()
  const router = useRouter()

  useEffect(() => {
    if (!loading && authState == null) {
      router.push("/login")
    }
  }, [user, loading, authState])

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
        return <span className="text-[#FE8888]">Aa</span>
      case "number":
        return <Hash className="text-[#FE8888]" />
      case "email":
        return <Mail className="text-[#FE8888]" />
      case "textarea":
        return <AlignLeft className="text-[#FE8888]" />
      case "stars":
        return <Star className="text-[#FE8888]" />
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
                    ? "fill-[#FE8888] text-[#FE8888]"
                    : "text-zinc-600"
                }`}
              />
            ))}
          </div>
        )
      case "textarea":
        return (
          <div className="max-h-20 overflow-y-auto text-zinc-300">{value}</div>
        )
      default:
        return <span className="text-zinc-300">{value}</span>
    }
  }

  if (isLoading) {
    return (
      <div className="relative min-h-screen bg-zinc-950 px-4 py-32 sm:px-6 md:px-20">
        <div className="absolute inset-0 bg-[url(/grid.svg)] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))]" />
        <div className="relative">
          <h1 className="bg-gradient-to-r from-[#FF555F] to-[#FE8888] bg-clip-text py-2 text-center font-poppins text-4xl font-bold text-transparent sm:text-5xl">
            Feedback Insights
          </h1>
          <p className="text-center text-zinc-400">
            Analyzing your valuable feedback
          </p>
          <div className="mt-12 flex items-center justify-center">
            <div className="h-12 w-12 animate-spin rounded-full border-4 border-[#FE8888] border-t-transparent" />
          </div>
        </div>
      </div>
    )
  }

  if (!projectData) {
    return (
      <div className="relative min-h-screen bg-zinc-950 px-4 py-32 sm:px-6 md:px-20">
        <div className="absolute inset-0 bg-[url(/grid.svg)] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))]" />
        <div className="relative">
          <h1 className="bg-gradient-to-r from-[#FF555F] to-[#FE8888] bg-clip-text py-2 text-center font-poppins text-4xl font-bold text-transparent sm:text-5xl">
            Feedback Void
          </h1>
          <p className="text-center text-zinc-400">
            No feedback available yet. Stay tuned!
          </p>
        </div>
      </div>
    )
  }

  const fields = parseFields(projectData.fields)

  return (
    <div className="relative min-h-screen bg-zinc-950 px-4 py-32 sm:px-6 md:px-20">
      <div className="absolute inset-0 bg-[url(/grid.svg)] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))]" />
      <div className="relative">
        <div className="absolute -left-4 -top-4 h-96 w-96 rounded-full bg-[#FE8888]/10 blur-3xl" />
        <div className="absolute -bottom-4 -right-4 h-96 w-96 rounded-full bg-[#FF555F]/10 blur-3xl" />
        <div className="relative">
          <h1 className="bg-gradient-to-r from-[#FF555F] to-[#FE8888] bg-clip-text py-2 text-center font-poppins text-4xl font-bold text-transparent sm:text-5xl">
            {projectData.name}
          </h1>
          <p className="mb-8 text-center text-zinc-400">
            {projectData.description}
          </p>
          <div className="my-10">
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem>
                  <BreadcrumbLink
                    href="/projects"
                    className="flex items-center gap-2 text-zinc-400 transition-colors hover:text-[#FE8888]"
                  >
                    <ArrowLeft className="h-4 w-4" />
                    Go back to projects
                  </BreadcrumbLink>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>
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
                  <Card className="group relative overflow-hidden rounded-xl border border-zinc-800 bg-zinc-900/50 shadow-2xl transition-all duration-300 hover:border-zinc-700 hover:shadow-[#FE8888]/10">
                    <div className="absolute -left-20 -top-20 h-40 w-40 rounded-full bg-[#FE8888]/10 blur-2xl transition-all duration-300 group-hover:bg-[#FE8888]/20" />
                    <div className="absolute -bottom-20 -right-20 h-40 w-40 rounded-full bg-[#FF555F]/10 blur-2xl transition-all duration-300 group-hover:bg-[#FF555F]/20" />
                    <CardHeader className="relative h-24">
                      <div
                        className="absolute inset-0 bg-cover bg-center"
                        style={
                          projectData.style.type === "gradient"
                            ? { background: projectData.style.value }
                            : {
                                backgroundImage: `linear-gradient(to bottom, rgba(24, 24, 27, 0.8), rgba(24, 24, 27, 0.95)), url(${projectData.style.value})`,
                                backgroundSize: "cover",
                                backgroundPosition: "center",
                              }
                        }
                      />
                      <CardTitle className="relative z-10 flex items-center justify-between">
                        <span className="bg-gradient-to-r from-[#FF555F] to-[#FE8888] bg-clip-text text-lg font-bold text-transparent">
                          Feedback #{index + 1}
                        </span>
                        <Badge
                          variant="outline"
                          className="border-zinc-700 bg-zinc-900/50 text-xs text-zinc-300"
                        >
                          <Calendar className="mr-1 h-3 w-3" />
                          {new Date(item.$createdAt).toLocaleDateString()}
                        </Badge>
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="relative space-y-4 pt-4">
                      {fields.map((field) => (
                        <div
                          key={field.name}
                          className="flex items-center gap-3 rounded-lg border border-zinc-800 bg-zinc-900/30 p-3 transition-colors hover:border-zinc-700"
                        >
                          <div className="flex h-8 w-8 items-center justify-center rounded-md bg-zinc-800">
                            {renderFieldIcon(field.type)}
                          </div>
                          <div className="flex flex-col gap-1">
                            <span className="text-sm font-medium text-zinc-400">
                              {field.name}
                            </span>
                            {renderFieldValue(field, feedbackData[field.name])}
                          </div>
                        </div>
                      ))}
                    </CardContent>
                  </Card>
                </motion.div>
              )
            })}
          </main>
        </div>
      </div>
    </div>
  )
}

export default FeedbackListing
