"use client"
import React, { useCallback, useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { toast } from "sonner"
import { z } from "zod"
import { toFormikValidationSchema } from "zod-formik-adapter"
import { useFormik } from "formik"
import isEqual from "lodash/isEqual"
import { Star, Code, ArrowRight, Layout } from "lucide-react"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import FormFieldsCard from "@/components/FormFieldsCard"
import FormSettingsCard from "@/components/FormDetailsCard"
import PreviewCard from "@/components/PreviewCard"
import ProjectDetailsCard from "@/components/ProjectDetailsCard"
import { useCheckSession } from "@/components/hooks/check-session"
import { useStore } from "@/lib/store"
import dbService from "@/appwrite/db"
import { Collection } from "@/appwrite/types"

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
  live: z.boolean(),
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
  live: boolean
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
      value:
        "https://cloud.appwrite.io/v1/storage/buckets/671a57170033088539ab/files/671a5799001ca4f9b59a/view?project=670fed73000836fa0cf1&project=670fed73000836fa0cf1&mode=admin",
      preview:
        "https://cloud.appwrite.io/v1/storage/buckets/671a57170033088539ab/files/671a5799001ca4f9b59a/view?project=670fed73000836fa0cf1&project=670fed73000836fa0cf1&mode=admin",
    },
    {
      id: "forest vibes",
      name: "forest vibes",
      value:
        "https://cloud.appwrite.io/v1/storage/buckets/671a57170033088539ab/files/671a579f001f6b08f3ee/view?project=670fed73000836fa0cf1&project=670fed73000836fa0cf1&mode=admin",
      preview:
        "https://cloud.appwrite.io/v1/storage/buckets/671a57170033088539ab/files/671a579f001f6b08f3ee/view?project=670fed73000836fa0cf1&project=670fed73000836fa0cf1&mode=admin",
    },
    {
      id: "graphitti",
      name: "graphitti Shapes",
      value:
        "https://cloud.appwrite.io/v1/storage/buckets/671a57170033088539ab/files/671a573b0023b9ff9396/view?project=670fed73000836fa0cf1&project=670fed73000836fa0cf1&mode=admin",
      preview:
        "https://cloud.appwrite.io/v1/storage/buckets/671a57170033088539ab/files/671a573b0023b9ff9396/view?project=670fed73000836fa0cf1&project=670fed73000836fa0cf1&mode=admin",
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
  const [initialFormValues, setInitialFormValues] =
    useState<ProjectFormValues | null>(null)

  const [error, setError] = useState("")

  const formik = useFormik<ProjectFormValues>({
    initialValues: {
      name: "",
      description: "",
      style: {
        type: "gradient",
        value: BACKGROUND_STYLES.gradients[0].value,
      },
      fields: [],
      live: false,
    },
    enableReinitialize: true,
    validationSchema: toFormikValidationSchema(projectSchema),
    onSubmit: async (values) => {
      try {
        const updatedProject = await dbService.updateDocument(
          Collection.project,
          id,
          {
            name: values.name,
            description: values.description,
            fields: JSON.stringify(
              values.fields.map((field) => {
                return {
                  name: field.name,
                  type: field.type,
                  required: field.required,
                }
              }),
            ),
            image: JSON.stringify(values.style),
            live: values.live,
          },
        )
        setInitialFormValues(values)
        toast.success("project updated successfully")
      } catch (error) {
        toast.error("An error occurred while updating the project")
      }
    },
  })

  const { user, loading } = useCheckSession()
  const { authState } = useStore()
  const router = useRouter()

  useEffect(() => {
    if (!loading && authState == null) {
      router.push("/login")
    }
  }, [user, loading, authState])

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
            style: JSON.parse(project.payload.image),
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
            live: project.payload.live,
          }
          setProjectDetails({
            projectId: project.payload.$id,
            secretKey: project.payload.secret,
          })
          formik.setValues(projectObject)
          setInitialFormValues(projectObject)
        } else {
          setError(project.message)
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

  const hasChanges = useCallback(() => {
    if (!initialFormValues) return false
    return !isEqual(formik.values, initialFormValues)
  }, [formik.values, initialFormValues])

  const reorderFields = (startIndex: number, endIndex: number) => {
    const newFields = Array.from(formik.values.fields)
    const [reorderedItem] = newFields.splice(startIndex, 1)
    newFields.splice(endIndex, 0, reorderedItem)
    formik.setFieldValue("fields", newFields)
  }

  if (isLoading) {
    return (
      <div className="bg-zinc-950 text-white">
        <div className="container mx-auto px-4 py-24">
          <div className="mb-8 text-center">
            <div className="mb-4 flex items-center justify-center gap-2 text-sm text-[#FE8888]">
              <Layout className="h-4 w-4" />
              <span>Form Builder</span>
            </div>
            <h1 className="font-poppins text-4xl font-bold text-white sm:text-5xl">
              Customize Your{" "}
              <span className="bg-gradient-to-r from-[#FF555F] to-[#FE8888] bg-clip-text text-transparent">
                Form
              </span>
            </h1>
          </div>
          <div className="flex h-96 items-center justify-center">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-[#FE8888] border-t-transparent" />
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="bg-zinc-950 text-white">
        <div className="container mx-auto px-4 py-24">
          <div className="mb-8 text-center">
            <div className="mb-4 flex items-center justify-center gap-2 text-sm text-[#FE8888]">
              <Code className="h-4 w-4" />
              <span>Error</span>
            </div>
            <h1 className="font-poppins text-4xl font-bold text-white sm:text-5xl">
              Something Went{" "}
              <span className="bg-gradient-to-r from-[#FF555F] to-[#FE8888] bg-clip-text text-transparent">
                Wrong
              </span>
            </h1>
          </div>
          <div className="flex h-96 items-center justify-center text-zinc-400">
            {error}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-zinc-950 text-white">
      <div className="container mx-auto px-4 py-24">
        {/* Header Section */}
        <div className="mb-16 text-center">
          <div className="mb-4 flex items-center justify-center gap-2 text-sm text-[#FE8888]">
            <Star className="h-4 w-4" />
            <span>Form Builder</span>
          </div>
          <h1 className="mb-6 font-poppins text-4xl font-bold text-white sm:text-5xl">
            Build Your{" "}
            <span className="bg-gradient-to-r from-[#FF555F] to-[#FE8888] bg-clip-text text-transparent">
              Perfect Form
            </span>
          </h1>
          <p className="mx-auto max-w-2xl text-zinc-400">
            Customize every aspect of your feedback form with our intuitive
            builder. Create fields, style your form, and preview in real-time.
          </p>

          {/* Breadcrumb with matching style */}
          <div className="mt-8">
            <Breadcrumb>
              <BreadcrumbList className="text-zinc-400">
                <BreadcrumbItem>
                  <BreadcrumbLink
                    href="/"
                    className="text-[#FE8888] hover:text-[#FF555F]"
                  >
                    Roist
                  </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <BreadcrumbLink
                    href="/projects"
                    className="text-[#FE8888] hover:text-[#FF555F]"
                  >
                    Projects
                  </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <BreadcrumbPage>{id}</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="relative">
          {/* Decorative gradient backgrounds */}
          <div className="absolute -left-20 -top-20 h-72 w-72 rounded-full bg-[#FE8888]/20 blur-3xl" />
          <div className="absolute -bottom-20 -right-10 h-72 w-72 rounded-full bg-[#FF555F]/20 blur-3xl" />

          {/* Content Grid */}
          <div className="relative grid gap-8 lg:grid-cols-2">
            {/* Left Column */}
            <div className="space-y-6">
              <FormSettingsCard
                projectData={formik.values}
                setProjectData={(newData) => formik.setValues(newData)}
                errors={formik.errors}
              />
              <FormFieldsCard
                reorderFields={reorderFields}
                projectData={formik.values}
                addField={addField}
                deleteField={deleteField}
                updateField={updateField}
                errors={formik.errors}
                maxFieldLimit={maxFieldLimit}
              />
            </div>

            {/* Right Column */}
            <div className="space-y-6">
              <ProjectDetailsCard
                projectId={projectDetails.projectId}
                secretKey={projectDetails.secretKey}
                isLive={formik.values.live}
                setIsLive={() =>
                  formik.setFieldValue("live", !formik.values.live)
                }
                copyToClipboard={copyToClipboard}
                onSaveChanges={() => formik.handleSubmit()}
                valid={formik.isValid}
                submitting={formik.isSubmitting}
                hasChanges={hasChanges()}
              />
              <PreviewCard projectData={formik.values} />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
