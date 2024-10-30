"use client"

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
import { Trash2, ChevronDown, PlusCircle, GripVertical } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { FormikErrors } from "formik"
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd"

interface FormField {
  id: string
  name: string
  type: "string" | "number" | "email" | "textarea" | "stars"
  required: boolean
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
  reorderFields: (startIndex: number, endIndex: number) => void
  errors: FormikErrors<ProjectData>
  maxFieldLimit: number
}

export default function FormFieldsCard({
  projectData,
  addField,
  deleteField,
  updateField,
  reorderFields,
  errors,
  maxFieldLimit = 5,
}: FormFieldsCardProps) {
  const onDragEnd = (result: any) => {
    if (!result.destination) {
      return
    }

    reorderFields(result.source.index, result.destination.index)
  }

  return (
    <Card className="border-zinc-800 bg-zinc-900/50 shadow-lg">
      <CardHeader>
        <CardTitle>Form Fields</CardTitle>
        <CardDescription>Add and customize form fields</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <DragDropContext onDragEnd={onDragEnd}>
          <Droppable droppableId="fields">
            {(provided) => (
              <div {...provided.droppableProps} ref={provided.innerRef}>
                {projectData.fields.map((field, index) => (
                  <Draggable
                    key={field.id}
                    draggableId={field.id}
                    index={index}
                  >
                    {(provided) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        className="mb-4"
                      >
                        <Collapsible
                          className="rounded-lg border bg-card shadow-sm transition-all hover:shadow-md"
                          defaultOpen={true}
                        >
                          <CollapsibleTrigger className="flex w-full items-center justify-between p-4">
                            <div className="flex items-center">
                              <div
                                {...provided.dragHandleProps}
                                className="mr-2"
                              >
                                <GripVertical className="pointer-events-auto h-5 w-5 text-gray-400 hover:text-[#FE8888] focus:text-[#FE8888]" />
                              </div>
                              <span className="text-lg font-medium">
                                {field.name}
                              </span>
                            </div>
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
                                        className="mt-1.5 border-zinc-800 bg-zinc-900 text-white placeholder:text-zinc-500 focus:border-[#FE8888] focus:ring-[#FE8888]"
                                      />
                                      {errors.fields &&
                                        typeof errors.fields[index] ===
                                          "object" &&
                                        errors.fields[index] !== null &&
                                        "name" in errors.fields[index] && (
                                          <p className="mt-1 text-sm text-red-500">
                                            {errors.fields[index].name}
                                          </p>
                                        )}
                                    </div>
                                    <div>
                                      <Label>Type</Label>
                                      <Select
                                        value={field.type}
                                        onValueChange={(
                                          value: FormField["type"],
                                        ) =>
                                          updateField(field.id, { type: value })
                                        }
                                      >
                                        <SelectTrigger className="mt-1.5 border-zinc-800 bg-zinc-900 text-white placeholder:text-zinc-500 focus:border-[#FE8888] focus:ring-[#FE8888]">
                                          <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent className="mt-1.5 border-zinc-800 bg-zinc-900 text-white placeholder:text-zinc-500 focus:border-[#FE8888] focus:ring-[#FE8888]">
                                          <SelectItem value="string">
                                            Text
                                          </SelectItem>
                                          <SelectItem value="number">
                                            Number
                                          </SelectItem>
                                          <SelectItem value="email">
                                            Email
                                          </SelectItem>
                                          <SelectItem value="textarea">
                                            Textarea
                                          </SelectItem>
                                          <SelectItem value="stars">
                                            Rating Stars
                                          </SelectItem>
                                        </SelectContent>
                                      </Select>
                                    </div>
                                  </div>
                                  <div className="flex items-center space-x-2">
                                    <Checkbox
                                      id={`required-${field.id}`}
                                      checked={field.required}
                                      onCheckedChange={(
                                        value: FormField["required"],
                                      ) => {
                                        updateField(field.id, {
                                          required: value,
                                        })
                                      }}
                                      className="data-[state=checked]:border-[#FE8888] data-[state=checked]:bg-[#FE8888]"
                                    />
                                    <Label htmlFor={`required-${field.id}`}>
                                      Required field
                                    </Label>
                                  </div>
                                  <Button
                                    size="sm"
                                    onClick={() => deleteField(field.id)}
                                    className="w-full"
                                  >
                                    <Trash2 className="mr-2 h-4 w-4" /> Delete
                                    Field
                                  </Button>
                                </div>
                              </motion.div>
                            </AnimatePresence>
                          </CollapsibleContent>
                        </Collapsible>
                      </div>
                    )}
                  </Draggable>
                ))}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        </DragDropContext>
        {errors.fields && typeof errors.fields === "string" && (
          <p className="mt-1 text-sm text-red-500">{errors.fields}</p>
        )}
        <Button
          type="button"
          variant="outline"
          onClick={addField}
          className="w-full"
          disabled={projectData.fields.length >= maxFieldLimit}
        >
          <PlusCircle className="mr-2 h-5 w-5 text-[#FE8888]" size={15} />
          Add field{" "}
          {projectData.fields.length >= maxFieldLimit && "(Limit reached)"}
        </Button>
      </CardContent>
    </Card>
  )
}
