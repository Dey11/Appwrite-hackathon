"use client"
import FormFieldsCard from "@/components/FormFieldsCard"
import FormSettingsCard from "@/components/FormDetailsCard"
import PreviewCard from "@/components/PreviewCard"
import ProjectDetailsCard from "@/components/ProjectDetailsCard"
import React, { useEffect, useState } from "react"
import dbService from "@/appwrite/db"
import { useParams, usePathname } from "next/navigation"
import { toast } from "sonner"
import { z } from "zod"
import { toFormikValidationSchema } from "zod-formik-adapter"
import { useFormik } from "formik"

const projectSchema = z.object({
  name: z.string().min(1, "Project name is required"),
  description: z.string().min(1, "Project description is required"),
  fields: z
    .array(
      z.object({
        id: z.string(),
        name: z.string().min(1, "Field name is required"),
        type: z.enum(["string", "number", "email", "textarea", "stars"]),
        required: z.boolean(),
      }),
    )
    .min(1, "At least one field is required"),
  style: z.object({
    type: z.enum(["gradient", "image"]),
    value: z.string(),
  }),
})

type ProjectFormValues = z.infer<typeof projectSchema>

export interface FormField {
  id: string
  name: string
  type: "string" | "number" | "email" | "textarea" | "stars"
  required: boolean
}

export interface ProjectData {
  name: string
  description: string
  fields: FormField[]
  style: {
    type: "gradient" | "image"
    value: string
  }
}
export const BACKGROUND_STYLES = {
  gradients: [
    {
      id: "gradient1",
      name: "Purple Dream",
      value: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
      preview: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
    },
    {
      id: "gradient2",
      name: "Sunset Vibes",
      value: "linear-gradient(135deg, #ff9a9e 0%, #fad0c4 100%)",
      preview: "linear-gradient(135deg, #ff9a9e 0%, #fad0c4 100%)",
    },
    {
      id: "gradient3",
      name: "Ocean Breeze",
      value: "linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)",
      preview: "linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)",
    },
  ],
  images: [
    {
      id: "sunny vibes",
      name: "sunny vibes",
      value: "/sunny.webp",
      preview: "/sunny.webp",
    },
    {
      id: "forest vibes",
      name: "forest vibes",
      value: "/forest.webp",
      preview: "/forest.webp",
    },
    {
      id: "graphitti",
      name: "graphitti Shapes",
      value: "/graphitti.jpg",
      preview: "/graphitti.jpg",
    },
  ],
}

export default function ProjectFormBuilder() {
  const { id }: { id: string } = useParams()
  const [isLoading, setIsLoading] = useState(true)
  const [maxFieldLimit, setMaxFieldLimit] = useState<number>(5)
  const [projectDetails, setProjectDetails] = useState({
    projectId: "",
    secretKey: "",
  })
  const [isLive, setIsLive] = useState(false)

  const formik = useFormik<ProjectFormValues>({
    initialValues: {
      name: "",
      description: "",
      style: {
        type: "gradient",
        value: BACKGROUND_STYLES.gradients[0].value,
      },
      fields: [],
    },
    validationSchema: toFormikValidationSchema(projectSchema),
    onSubmit: async (values) => {
      try {
        // update db call here
        console.log(values)
      } catch (error) {
        toast.error("An error occurred while updating the project")
      }
    },
  })

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true)
        const project = await dbService.findProjectById(id)
        const user = await dbService.getCurrentUser()

        if (project.success && user.success) {
          setMaxFieldLimit(user.payload.maxFields)

          const projectObject: ProjectFormValues = {
            name: project.payload.name || "Default Project Name",
            description:
              project.payload.description || "Default project description",
            style: {
              type: "gradient",
              value: BACKGROUND_STYLES.gradients[0].value,
            },
            fields: JSON.parse(project.payload.fields).map(
              (
                field: { name: string; type: string; required: boolean },
                index: number,
              ) => ({
                id: (index + 1).toString(),
                name: field.name,
                type: field.type,
                required: field.required,
                value: field.type === "stars" ? 0 : "",
              }),
            ),
          }
          setProjectDetails({
            projectId: project.payload.$id,
            secretKey: project.payload.secret,
          })
          formik.setValues(projectObject)
          setIsLive(project.payload.live)
        }
      } catch (error) {
        console.error("Error fetching data:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()
  }, [id])

  const addField = () => {
    const newField: FormField = {
      id: Date.now().toString(),
      name: "New Field",
      type: "string",
      required: false,
    }
    formik.setFieldValue("fields", [...formik.values.fields, newField])
  }

  const deleteField = (id: string) => {
    formik.setFieldValue(
      "fields",
      formik.values.fields.filter((field: { id: string }) => field.id !== id),
    )
  }

  const updateField = (id: string, updates: Partial<FormField>) => {
    formik.setFieldValue(
      "fields",
      formik.values.fields.map((field: { id: string }) =>
        field.id === id ? { ...field, ...updates } : field,
      ),
    )
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
    toast.success("copied to clipboard")
  }
  return (
    <div className="container mx-auto mt-36 max-w-7xl p-6">
      <div className="mb-8">
        <h1 className="bg-gradient-to-bl from-[#FF555F] to-[#FE8888] bg-clip-text py-2 text-center text-3xl font-semibold text-transparent sm:text-4xl md:text-5xl">
          Form Builder
        </h1>
        <p className="text-center text-xs text-zinc-400 sm:text-sm">
          Customize your feedback form
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div className="space-y-6">
          <FormSettingsCard
            projectData={formik.values}
            setProjectData={(newData) => formik.setValues(newData)}
            errors={formik.errors}
          />
          <FormFieldsCard
            projectData={formik.values}
            addField={addField}
            deleteField={deleteField}
            updateField={updateField}
            errors={formik.errors}
            maxFieldLimit={maxFieldLimit}
          />
        </div>
        <div className="space-y-6">
          <ProjectDetailsCard
            projectId={projectDetails.projectId}
            secretKey={projectDetails.secretKey}
            isLive={isLive}
            setIsLive={setIsLive}
            copyToClipboard={copyToClipboard}
            onSaveChanges={() => formik.handleSubmit()}
            valid={formik.isValid}
            submitting={formik.isSubmitting}
          />
          <PreviewCard projectData={formik.values} updateField={updateField} />
        </div>
      </div>
    </div>
  )
}