import { z } from "zod"

export const fieldSchema = z.object({
  name: z.string().min(1, "Field name is required"),
  type: z.enum(["string", "number", "email", "textarea", "stars"]),
  required: z.boolean(),
})

export const projectFormSchema = z.object({
  name: z.string().min(1, "Project name is required"),
  description: z.string().min(1, "Description is required"),
  fields: z.array(fieldSchema).min(1, "At least one field is required"),
})

export type ProjectFormValues = z.infer<typeof projectFormSchema>

export const initialValues: ProjectFormValues = {
  name: "",
  description: "",
  fields: [{ name: "", type: "string", required: true }],
}

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