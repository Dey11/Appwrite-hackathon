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

interface Field {
  name: string
  type: string
}

export interface NewProject {
  name: string
  description: string
  fields: Field[]
}

interface AddProjectDialogProps {
  onAddProject: (project: NewProject) => void
}

export default function AddProjectDialog(
  { onAddProject }: AddProjectDialogProps = { onAddProject: () => {} },
) {
  const [newProject, setNewProject] = useState<NewProject>({
    name: "",
    description: "",
    fields: [],
  })

  const addField = () => {
    setNewProject((prev) => ({
      ...prev,
      fields: [...prev.fields, { name: "", type: "string" }],
    }))
  }

  const updateField = (index: number, key: keyof Field, value: string) => {
    setNewProject((prev) => ({
      ...prev,
      fields: prev.fields.map((field, i) =>
        i === index ? { ...field, [key]: value } : field,
      ),
    }))
  }

  const removeField = (index: number) => {
    setNewProject((prev) => ({
      ...prev,
      fields: prev.fields.filter((_, i) => i !== index),
    }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onAddProject(newProject)
    setNewProject({ name: "", description: "", fields: [] })
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button>Add Project</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Add Project</DialogTitle>
          <DialogDescription>Create a new project</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-6 items-center gap-4">
              <Label htmlFor="name" className="col-span-1 text-left">
                Name
              </Label>
              <Input
                id="name"
                className="col-span-5"
                value={newProject.name}
                onChange={(e) =>
                  setNewProject((prev) => ({ ...prev, name: e.target.value }))
                }
              />
            </div>
            <div className="grid grid-cols-6 items-center gap-4">
              <Label htmlFor="description" className="col-span-1 text-left">
                Description
              </Label>
              <Input
                id="description"
                className="col-span-5"
                value={newProject.description}
                onChange={(e) =>
                  setNewProject((prev) => ({
                    ...prev,
                    description: e.target.value,
                  }))
                }
              />
            </div>
            <div className="flex max-h-[380px] flex-col gap-4 overflow-y-auto">
              {newProject.fields.map((field, index) => (
                <div
                  key={index}
                  className="grid grid-cols-10 items-center gap-4"
                >
                  <Input
                    placeholder="Field name"
                    className="col-span-6"
                    value={field.name}
                    onChange={(e) => updateField(index, "name", e.target.value)}
                  />
                  <Select
                    value={field.type}
                    onValueChange={(value) => updateField(index, "type", value)}
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
                    className="col-span-1 border border-red-400"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
            <Button type="button" variant="outline" onClick={addField}>
              <PlusCircle className="mr-2" size={15} />
              Add field
            </Button>
          </div>
          <DialogFooter>
            <Button type="submit">Save changes</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
