import React from "react"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"
import { Plus, Trash2, ChevronDown } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"

interface FormField {
  id: string
  name: string
  type: "string" | "number" | "email" | "textarea" | "stars"
  required: boolean
  value: string | number
}

interface ProjectData {
  name: string
  description: string
  fields: FormField[]
  style: {
    type: "gradient" | "image"
    value: string
  }
}

interface FormFieldsCardProps {
  projectData: ProjectData
  addField: () => void
  deleteField: (id: string) => void
  updateField: (id: string, updates: Partial<FormField>) => void
}

export default function FormFieldsCard({
  projectData,
  addField,
  deleteField,
  updateField,
}: FormFieldsCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Form Fields</CardTitle>
        <CardDescription>Add and customize form fields</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {projectData.fields.map((field) => (
          <Collapsible
            key={field.id}
            className="rounded-lg border bg-card shadow-sm transition-all hover:shadow-md"
            defaultOpen={true}
          >
            <CollapsibleTrigger className="flex w-full items-center justify-between p-4">
              <span className="text-lg font-medium">{field.name}</span>
              <ChevronDown className="h-5 w-5 transition-transform duration-200" />
            </CollapsibleTrigger>
            <CollapsibleContent>
              <AnimatePresence>
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="space-y-4 p-4 pt-0">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label>Field Name</Label>
                        <Input
                          value={field.name}
                          onChange={(e) =>
                            updateField(field.id, {
                              name: e.target.value,
                            })
                          }
                        />
                      </div>
                      <div>
                        <Label>Type</Label>
                        <Select
                          value={field.type}
                          onValueChange={(value: FormField["type"]) =>
                            updateField(field.id, { type: value })
                          }
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="string">Text</SelectItem>
                            <SelectItem value="number">Number</SelectItem>
                            <SelectItem value="email">Email</SelectItem>
                            <SelectItem value="textarea">Textarea</SelectItem>
                            <SelectItem value="stars">Rating Stars</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id={`required-${field.id}`}
                        checked={field.required}
                        onCheckedChange={(value: FormField["required"]) => {
                          updateField(field.id, { required: value })
                        }}
                      />
                      <Label htmlFor={`required-${field.id}`}>
                        Required field
                      </Label>
                    </div>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => deleteField(field.id)}
                      className="w-full"
                    >
                      <Trash2 className="mr-2 h-4 w-4" /> Delete Field
                    </Button>
                  </div>
                </motion.div>
              </AnimatePresence>
            </CollapsibleContent>
          </Collapsible>
        ))}
        <Button onClick={addField} className="w-full" variant="outline">
          <Plus className="mr-2 h-4 w-4" /> Add New Field
        </Button>
      </CardContent>
    </Card>
  )
}
