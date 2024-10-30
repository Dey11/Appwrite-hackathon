"use client"

import React, { useEffect } from "react"
import { useFormik } from "formik"
import { z } from "zod"
import { toFormikValidationSchema } from "zod-formik-adapter"
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
import { useParams } from "next/navigation"
import { createFeedbackAction } from "@/actions/createFeedback"

interface FormField {
  name: string
  type: "string" | "number" | "email" | "textarea" | "stars"
  required: boolean
}

interface ProjectData {
  userId: string
  name: string
  description: string
  fields: FormField[]
  style: {
    type: "gradient" | "image"
    value: string
  }
  live: boolean
  permissions: [string]
}

interface PreviewCardProps {
  projectData: ProjectData
}

export default function FeedbackForm({ projectData }: PreviewCardProps) {
  const { id }: { id: string } = useParams()
  const createZodSchema = (fields: FormField[]) => {
    const schemaFields: Record<string, z.ZodTypeAny> = {}
    fields.forEach((field) => {
      let fieldSchema: z.ZodTypeAny

      switch (field.type) {
        case "string":
          fieldSchema = field.required
            ? z
                .string({
                  required_error: `${field.name} is required`,
                  invalid_type_error: `${field.name} must be text`,
                })
                .min(1, `${field.name} is required`)
            : z.string().optional().or(z.literal(""))
          break
        case "number":
          fieldSchema = field.required
            ? z
                .number({
                  required_error: `${field.name} is required`,
                  invalid_type_error: `${field.name} must be a number`,
                })
                .min(1, `${field.name} is required`)
            : z.number().optional()
          break
        case "email":
          fieldSchema = field.required
            ? z
                .string({
                  required_error: `${field.name} is required`,
                  invalid_type_error: `${field.name} must be text`,
                })
                .email(`Please enter a valid email address`)
                .min(1, `${field.name} is required`)
            : z
                .string()
                .email(`Please enter a valid email address`)
                .optional()
                .or(z.literal(""))
          break
        case "textarea":
          fieldSchema = field.required
            ? z
                .string({
                  required_error: `${field.name} is required`,
                  invalid_type_error: `${field.name} must be text`,
                })
                .min(1, `${field.name} is required`)
            : z.string().optional().or(z.literal(""))
          break
        case "stars":
          fieldSchema = field.required
            ? z
                .number({
                  required_error: `Please provide a ${field.name.toLowerCase()}`,
                  invalid_type_error: `${field.name} must be a number`,
                })
                .gte(1, `Please select at least 1 star`)
                .lte(5, `Maximum 5 stars allowed`)
            : z
                .number()
                .gte(0, `Invalid rating`)
                .lte(5, `Maximum 5 stars allowed`)
                .optional()
          break
        default:
          fieldSchema = field.required
            ? z
                .string({
                  required_error: `${field.name} is required`,
                  invalid_type_error: `${field.name} must be text`,
                })
                .min(1, `${field.name} is required`)
            : z.string().optional()
      }

      schemaFields[field.name] = fieldSchema
    })

    return z.object(schemaFields)
  }

  const zodSchema = createZodSchema(projectData.fields)
  const validationSchema = toFormikValidationSchema(zodSchema)

  const initialValues: Record<string, string | number> = {}

  for (let i = 0; i < projectData.fields.length; i++) {
    initialValues[projectData.fields[i].name] = ""
  }

  const formik = useFormik({
    initialValues,
    validationSchema,
    onSubmit: async (values, { resetForm }) => {
      try {
        await createFeedbackAction(
          values,
          id,
          projectData.userId,
          projectData.permissions,
        )
        resetForm()
        toast.success("Feedback sended successfully")
      } catch (error) {
        toast.error("An error occurred while sending feedbacks")
      }
    },
    validateOnMount: true,
  })

  const renderField = (field: FormField) => {
    switch (field.type) {
      case "string":
      case "email":
      case "number":
        return (
          <>
            <Input
              {...formik.getFieldProps(field.name)}
              name={field.name}
              type={field.type}
              placeholder={`Enter ${field.name.toLowerCase()}`}
              className="w-full bg-white/90 backdrop-blur-sm"
              onBlur={formik.handleBlur}
            />
            {formik.touched[field.name] && formik.errors[field.name] && (
              <div className="mt-1 text-sm text-red-500">
                {formik.errors[field.name] as string}
              </div>
            )}
          </>
        )
      case "textarea":
        return (
          <>
            <Textarea
              {...formik.getFieldProps(field.name)}
              placeholder={`Enter ${field.name.toLowerCase()}`}
              className="min-h-[100px] w-full bg-white/90 backdrop-blur-sm"
              onBlur={formik.handleBlur}
            />
            {formik.touched[field.name] && formik.errors[field.name] && (
              <div className="mt-1 text-sm text-red-500">
                {formik.errors[field.name] as string}
              </div>
            )}
          </>
        )
      case "stars":
        return (
          <>
            <StarRating
              value={formik.values[field.name] as number}
              onChange={(value) => {
                formik.setFieldValue(field.name, value)
                formik.setFieldTouched(field.name, true, false)
              }}
            />
            {formik.touched[field.name] && formik.errors[field.name] && (
              <div className="mt-1 text-sm text-red-500">
                {formik.errors[field.name] as string}
              </div>
            )}
          </>
        )
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
      className="overflow-hidden border border-zinc-700"
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
      <div className="bg-black/40 backdrop-blur-[1px]">
        <CardHeader className="text-white">
          <CardTitle className="text-2xl">{projectData.name}</CardTitle>
          <CardDescription className="text-white/90">
            {projectData.description}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={formik.handleSubmit} className="space-y-6 text-black">
            {projectData.fields.map((field) => (
              <div key={field.name} className="space-y-2">
                <Label className="text-white">
                  {field.name}
                  {field.required && (
                    <span className="ml-1 text-red-300">*</span>
                  )}
                </Label>
                {renderField(field)}
              </div>
            ))}
            <Button
              type="submit"
              className="w-full bg-white"
              disabled={!formik.isValid || formik.isSubmitting}
            >
              Submit Feedback
            </Button>
          </form>
        </CardContent>
      </div>
    </Card>
  )
}
