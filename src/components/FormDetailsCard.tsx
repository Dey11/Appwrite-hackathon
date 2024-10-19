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
import { Textarea } from "@/components/ui/textarea"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import Image from "next/image"
import { BACKGROUND_STYLES, ProjectData } from "@/app/projects/[id]/page"
import { FormikErrors } from "formik"

interface FormSettingsCardProps {
  projectData: ProjectData
  setProjectData: React.Dispatch<React.SetStateAction<ProjectData>>
  errors: FormikErrors<ProjectData>
}

export default function FormSettingsCard({
  projectData,
  setProjectData,
  errors,
}: FormSettingsCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Form Details</CardTitle>
        <CardDescription>Customize your form appearance</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <Label>Form Name</Label>
          <Input
            value={projectData.name}
            onChange={(e) =>
              setProjectData({ ...projectData, name: e.target.value })
            }
          />
          {errors.name && (
            <p className="mt-1 text-sm text-red-500">{errors.name}</p>
          )}
        </div>
        <div>
          <Label>Form Description</Label>
          <Textarea
            value={projectData.description}
            onChange={(e) =>
              setProjectData({
                ...projectData,
                description: e.target.value,
              })
            }
          />
          {errors.description && (
            <p className="mt-1 text-sm text-red-500">{errors.description}</p>
          )}
        </div>
        <div className="space-y-4">
          <Label>Form Style</Label>
          <Tabs defaultValue="gradients" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="gradients">Gradients</TabsTrigger>
              <TabsTrigger value="images">Images</TabsTrigger>
            </TabsList>
            <TabsContent value="gradients">
              <RadioGroup
                value={
                  projectData.style.type === "gradient"
                    ? projectData.style.value
                    : undefined
                }
                onValueChange={(value) =>
                  setProjectData({
                    ...projectData,
                    style: { type: "gradient", value },
                  })
                }
                className="grid grid-cols-3 gap-4"
              >
                {BACKGROUND_STYLES.gradients.map((gradient) => (
                  <div key={gradient.id} className="relative">
                    <RadioGroupItem
                      value={gradient.value}
                      id={gradient.id}
                      className="peer sr-only"
                    />
                    <Label
                      htmlFor={gradient.id}
                      className="flex flex-col items-center justify-center rounded-md border-2 border-muted bg-transparent p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
                    >
                      <div
                        className="mb-2 h-16 w-full rounded-md"
                        style={{ background: gradient.preview }}
                      />
                      <span className="text-sm">{gradient.name}</span>
                    </Label>
                  </div>
                ))}
              </RadioGroup>
            </TabsContent>
            <TabsContent value="images">
              <RadioGroup
                value={
                  projectData.style.type === "image"
                    ? projectData.style.value
                    : undefined
                }
                onValueChange={(value) =>
                  setProjectData({
                    ...projectData,
                    style: { type: "image", value },
                  })
                }
                className="grid grid-cols-3 gap-4"
              >
                {BACKGROUND_STYLES.images.map((image) => (
                  <div key={image.id} className="relative">
                    <RadioGroupItem
                      value={image.value}
                      id={image.id}
                      className="peer sr-only"
                    />
                    <Label
                      htmlFor={image.id}
                      className="flex flex-col items-center justify-center rounded-md border-2 border-muted bg-transparent p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
                    >
                      <div className="relative mb-2 h-16 w-full overflow-hidden rounded-md">
                        <Image
                          width={1000}
                          height={1000}
                          src={image.preview}
                          alt={image.name}
                          className="h-full w-full object-cover"
                        />
                      </div>
                      <span className="text-sm">{image.name}</span>
                    </Label>
                  </div>
                ))}
              </RadioGroup>
            </TabsContent>
            <div className="flex justify-center">
              <Badge className="mt-6 text-blue-600">
                upload custom image feature is coming soon!!
              </Badge>
            </div>
          </Tabs>
        </div>
      </CardContent>
    </Card>
  )
}
