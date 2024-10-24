import fs from "fs"
import path from "path"
import { execSync } from "child_process"

export async function add2(id: string) {
  const form = await fetch(`http://localhost:3000/api/preview/${id}`)
  const formSchema = await form.json()

  const componentContent = `
"use client"

import React from "react"
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

interface FormField {
  name: string
  type: "string" | "number" | "email" | "textarea" | "stars"
  required: boolean
}
interface ProjectDocument {
  name: string
  description: string
  userId: string
  style: { type: "image" | "gradient"; value: string }
  fields: FormField[]
  live: boolean
}

const formSchema:ProjectDocument = ${JSON.stringify(formSchema.payload, null, 2)};

export default function ${formSchema.payload.name.charAt(0).toUpperCase() + formSchema.payload.name.slice(1)}Form() {
  const createZodSchema = (fields: FormField[]) => {
    const schemaFields: Record<string, z.ZodTypeAny> = {}
    fields.forEach((field) => {
      let fieldSchema: z.ZodTypeAny

      switch (field.type) {
        case "string":
          fieldSchema = field.required
            ? z
                .string({
                  required_error: \`\${field.name} is required\`,
                  invalid_type_error: \`\${field.name} must be text\`,
                })
                .min(1, \`\${field.name} is required\`)
            : z.string().optional().or(z.literal(""))
          break
        case "number":
          fieldSchema = field.required
            ? z
                .number({
                  required_error: \`\${field.name} is required\`,
                  invalid_type_error: \`\${field.name} must be a number\`,
                })
                .min(1, \`\${field.name} is required\`)
            : z.number().optional()
          break
        case "email":
          fieldSchema = field.required
            ? z
                .string({
                  required_error: \`\${field.name} is required\`,
                  invalid_type_error: \`\${field.name} must be text\`,
                })
                .email(\`Please enter a valid email address\`)
                .min(1, \`\${field.name} is required\`)
            : z
                .string()
                .email(\`Please enter a valid email address\`)
                .optional()
                .or(z.literal(""))
          break
        case "textarea":
          fieldSchema = field.required
            ? z
                .string({
                  required_error: \`\${field.name} is required\`,
                  invalid_type_error: \`\${field.name} must be text\`,
                })
                .min(1, \`\${field.name} is required\`)
            : z.string().optional().or(z.literal(""))
          break
        case "stars":
          fieldSchema = field.required
            ? z
                .number({
                  required_error: \`Please provide a \${field.name.toLowerCase()}\`,
                  invalid_type_error: \`\${field.name} must be a number\`,
                })
                .gte(1, \`Please select at least 1 star\`)
                .lte(5, \`Maximum 5 stars allowed\`)
            : z
                .number()
                .gte(0, \`Invalid rating\`)
                .lte(5, \`Maximum 5 stars allowed\`)
                .optional()
          break
        default:
          fieldSchema = field.required
            ? z
                .string({
                  required_error: \`\${field.name} is required\`,
                  invalid_type_error: \`\${field.name} must be text\`,
                })
                .min(1, \`\${field.name} is required\`)
            : z.string().optional()
      }

      schemaFields[field.name] = fieldSchema
    })

    return z.object(schemaFields)
  }

  const zodSchema = createZodSchema(formSchema.fields)
  const validationSchema = toFormikValidationSchema(zodSchema)

  const initialValues: Record<string, string | number> = {}

  for (let i = 0; i < formSchema.fields.length; i++) {
    initialValues[formSchema.fields[i].name] = ""
  }

  const formik = useFormik({
    initialValues,
    validationSchema,
    onSubmit: async (values, { resetForm }) => {
      try {
        await fetch(\`http://localhost:3000/api/feedback/${id}\`,{
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              secret: process.env.NEXT_PUBLIC_PROJECT_SECRET,
              data: values,
            }),
          })
        console.log('Form submitted with values:', values)
        resetForm()
      } catch (error) {
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
              placeholder={\`Enter \${field.name.toLowerCase()}\`}
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
              placeholder={\`Enter \${field.name.toLowerCase()}\`}
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
          className={\`h-6 w-6 cursor-pointer \${
            star <= value ? "fill-yellow-400 text-yellow-400" : "text-gray-300"
          }\`}
          onClick={() => onChange(star)}
        />
      ))}
    </div>
  )

  return (
  <div className="max-w-[800px] mx-auto">
    <Card
      className="overflow-hidden border border-zinc-700"
      style={
        formSchema.style.type === "gradient"
          ? { background: formSchema.style.value }
          : {
              backgroundImage: \`url(\${formSchema.style.value})\`,
              backgroundSize: "cover",
              backgroundPosition: "center",
            }
      }
    >
      <div className="bg-black/40 backdrop-blur-[1px]">
        <CardHeader className="text-white">
          <CardTitle className="text-2xl">{formSchema.name}</CardTitle>
          <CardDescription className="text-white/90">
            {formSchema.description}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={formik.handleSubmit} className="space-y-6 text-black">
            {formSchema.fields.map((field) => (
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
    </div>
  )
}
`

  const componentDir = path.join(process.cwd(), "src", "components", "rroist")
  const componentPath = path.join(
    componentDir,
    `${formSchema.payload.name}Form.tsx`,
  )

  if (!fs.existsSync(componentDir)) {
    fs.mkdirSync(componentDir, { recursive: true })
  }

  fs.writeFileSync(componentPath, componentContent)
  console.log(
    `Added ${formSchema.payload.name}Form component at ${componentPath}`,
  )

  const shadcnComponents = ["card", "label", "input", "textarea", "button"]
  const uiComponentsDir = path.join(process.cwd(), "src", "components", "ui")

  shadcnComponents.forEach((component) => {
    const componentPath = path.join(uiComponentsDir, `${component}.tsx`)
    if (!fs.existsSync(componentPath)) {
      try {
        execSync(`npx shadcn@latest add ${component}`, { stdio: "inherit" })
        console.log(`Installed shadcn ${component} component`)
      } catch (error) {
        console.error(`Failed to install shadcn ${component} component:`, error)
      }
    } else {
      console.log(
        `shadcn ${component} component already exists, skipping installation`,
      )
    }
  })

  const additionalDependencies = [
    "formik",
    "zod",
    "zod-formik-adapter",
    "lucide-react",
  ]
  additionalDependencies.forEach((dep) => {
    try {
      execSync(`npm install ${dep}`, { stdio: "inherit" })
      console.log(`Installed ${dep}`)
    } catch (error) {
      console.error(`Failed to install ${dep}:`, error)
    }
  })
}
