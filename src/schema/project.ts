import { z } from "zod"

export const fieldSchema = z.object({
  name: z.string().min(1, "Field name is required"),
  type: z.enum(["string", "number", "email", "textarea", "stars"]),
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
  fields: [{ name: "", type: "string" }],
}
