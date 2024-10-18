"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogTrigger,
  DialogDescription,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { PlusCircle, X } from "lucide-react"
import { useFormik } from "formik"
import { toFormikValidationSchema } from "zod-formik-adapter"
import {
  projectFormSchema,
  ProjectFormValues,
  initialValues,
} from "@/schema/project"

export default function AddProjectDialog() {
  const [open, setOpen] = useState(false)

  const formik = useFormik<ProjectFormValues>({
    initialValues,
    validationSchema: toFormikValidationSchema(projectFormSchema),
    onSubmit: (values, { resetForm }) => {
      // db call to create a project
      // user can add maximum 5(defualt value) fields per project (max_field come from the user table)
      console.log(values)
      // reset form after res.ok
      resetForm()
      // add toaster for successfull message
      // close the dialog and redirect the user to the projects/[projectid]
      setOpen(false)
    },
  })

  const addField = () => {
    formik.setFieldValue("fields", [
      ...formik.values.fields,
      { name: "", type: "string" },
    ])
  }

  const removeField = (index: number) => {
    const newFields = [...formik.values.fields]
    newFields.splice(index, 1)
    formik.setFieldValue("fields", newFields)
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>Add Project</Button>
      </DialogTrigger>
      <DialogContent className="md:max-w-[600px]">
        <DialogHeader className="px-2">
          <DialogTitle>Add Project</DialogTitle>
          <DialogDescription>Create a new project</DialogDescription>
        </DialogHeader>
        <form onSubmit={formik.handleSubmit}>
          <div className="grid gap-4">
            <div className="grid grid-cols-6 items-center gap-4 px-2 py-4">
              <Label htmlFor="name" className="col-span-1 text-left">
                Name
              </Label>
              <div className="col-span-5">
                <Input
                  id="name"
                  {...formik.getFieldProps("name")}
                  aria-invalid={
                    formik.errors.name && formik.touched.name ? "true" : "false"
                  }
                  className={
                    formik.errors.name && formik.touched.name
                      ? "border-red-500"
                      : ""
                  }
                />
                {formik.errors.name && formik.touched.name && (
                  <p className="mt-1 text-sm text-red-500">
                    {formik.errors.name}
                  </p>
                )}
              </div>
            </div>
            <div className="grid grid-cols-6 items-center gap-4 px-2">
              <Label htmlFor="description" className="col-span-1 text-left">
                Description
              </Label>
              <div className="col-span-5">
                <Input
                  id="description"
                  {...formik.getFieldProps("description")}
                  aria-invalid={
                    formik.errors.description && formik.touched.description
                      ? "true"
                      : "false"
                  }
                  className={
                    formik.errors.description && formik.touched.description
                      ? "border-red-500"
                      : ""
                  }
                />
                {formik.errors.description && formik.touched.description && (
                  <p className="mt-1 text-sm text-red-500">
                    {formik.errors.description}
                  </p>
                )}
              </div>
            </div>
            <div
              className={`flex max-h-[380px] flex-col gap-4 overflow-y-auto ${
                formik.values.fields.length > 0 ? "p-2" : ""
              }`}
            >
              {formik.values.fields.map((field, index) => (
                <div
                  key={index}
                  className="grid grid-cols-10 items-center gap-4"
                >
                  <div className="col-span-6">
                    <Input
                      placeholder="Field name"
                      {...formik.getFieldProps(`fields.${index}.name`)}
                    />
                  </div>
                  <Select
                    value={field.type}
                    onValueChange={(value) =>
                      formik.setFieldValue(`fields.${index}.type`, value)
                    }
                  >
                    <SelectTrigger className="col-span-3">
                      <SelectValue placeholder="Type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="string">String</SelectItem>
                      <SelectItem value="number">Number</SelectItem>
                      <SelectItem value="email">Email</SelectItem>
                      <SelectItem value="textarea">Textarea</SelectItem>
                      <SelectItem value="stars">Stars</SelectItem>
                    </SelectContent>
                  </Select>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() => removeField(index)}
                    className="group col-span-1 border hover:border-red-400 hover:bg-zinc-900 hover:shadow-2xl"
                  >
                    <X className="h-4 w-4 group-hover:text-red-400" />
                    <span className="sr-only">Remove field</span>
                  </Button>
                </div>
              ))}
            </div>
            {formik.errors.fields &&
              typeof formik.errors.fields === "string" && (
                <p className="px-2 text-sm text-red-500">
                  {formik.errors.fields}
                </p>
              )}
            <div className="px-2">
              <Button
                type="button"
                variant="outline"
                onClick={addField}
                className="w-full"
              >
                <PlusCircle className="mr-2" size={15} />
                Add field
              </Button>
            </div>
          </div>
          <DialogFooter className="mt-6 px-2">
            <Button
              type="submit"
              disabled={!formik.isValid || formik.isSubmitting}
            >
              Create Project
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
