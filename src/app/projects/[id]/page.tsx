"use client"
import FormFieldsCard from "@/components/FormFieldsCard"
import FormSettingsCard from "@/components/FormDetailsCard"
import PreviewCard from "@/components/PreviewCard"
import ProjectDetailsCard from "@/components/ProjectDetailsCard"
import React, { useCallback, useEffect, useState } from "react"
import dbService from "@/appwrite/db"
import { useParams, useRouter } from "next/navigation"
import { toast } from "sonner"
import { z } from "zod"
import { toFormikValidationSchema } from "zod-formik-adapter"
import { useFormik } from "formik"
import { Collection } from "@/appwrite/types"
import isEqual from "lodash/isEqual"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { useCheckSession } from "@/components/hooks/check-session"
import { useStore } from "@/lib/store"

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
        // update db call here
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
      <div className="mt-36 px-4 sm:px-6 md:px-20">
        <div className="mb-8">
          <h1 className="bg-gradient-to-bl from-[#FF555F] to-[#FE8888] bg-clip-text py-2 text-center text-3xl font-semibold text-transparent sm:text-4xl md:text-5xl">
            Form Builder
          </h1>
          <p className="text-center text-xs text-zinc-400 sm:text-sm">
            Customize your feedback form
          </p>
        </div>
        <main className="flex flex-col gap-6">
          <div className="flex h-96 items-center justify-center">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-[#FE8888] border-t-transparent" />
          </div>
        </main>
      </div>
    )
  }

  if (error != "") {
    return (
      <div className="mt-36 px-4 sm:px-6 md:px-20">
        <div className="mb-8">
          <h1 className="bg-gradient-to-bl from-[#FF555F] to-[#FE8888] bg-clip-text py-2 text-center text-3xl font-semibold text-transparent sm:text-4xl md:text-5xl">
            Form Builder
          </h1>
          <p className="text-center text-xs text-zinc-400 sm:text-sm">
            Customize your feedback form
          </p>
        </div>
        <main className="flex flex-col gap-6">
          <div className="flex h-96 items-center justify-center">{error}</div>
        </main>
      </div>
    )
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
        <div className="mt-10">
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink href="/">Rroist</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbLink href="/projects">Projects</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage>{id}</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
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
        <div className="space-y-6">
          <ProjectDetailsCard
            projectId={projectDetails.projectId}
            secretKey={projectDetails.secretKey}
            isLive={formik.values.live}
            setIsLive={() => {
              formik.setFieldValue("live", !formik.values.live)
            }}
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
  )
}
