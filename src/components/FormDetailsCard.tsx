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
import { Image as ImageIcon, Palette } from "lucide-react"
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
    <Card className="border-zinc-800 bg-zinc-900/50 shadow-lg">
      <CardHeader>
        <div className="flex items-center gap-2">
          <Palette className="h-5 w-5 text-[#FE8888]" />
          <CardTitle className="text-white">Form Details</CardTitle>
        </div>
        <CardDescription className="text-zinc-400">
          Customize your form appearance and style
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div>
          <Label className="text-zinc-300">Form Name</Label>
          <Input
            value={projectData.name}
            onChange={(e) =>
              setProjectData({ ...projectData, name: e.target.value })
            }
            className="mt-1.5 border-zinc-800 bg-zinc-900 text-white placeholder:text-zinc-500 focus:border-[#FE8888] focus:ring-[#FE8888]"
            placeholder="Enter form name..."
          />
          {errors.name && (
            <p className="mt-1.5 text-sm text-[#FF555F]">{errors.name}</p>
          )}
        </div>

        <div>
          <Label className="text-zinc-300">Form Description</Label>
          <Textarea
            value={projectData.description}
            onChange={(e) =>
              setProjectData({
                ...projectData,
                description: e.target.value,
              })
            }
            className="mt-1.5 border-zinc-800 bg-zinc-900 text-white placeholder:text-zinc-500 focus:border-[#FE8888] focus:ring-[#FE8888]"
            placeholder="Describe your form..."
          />
          {errors.description && (
            <p className="mt-1.5 text-sm text-[#FF555F]">
              {errors.description}
            </p>
          )}
        </div>

        <div className="space-y-4">
          <Label className="text-zinc-300">Form Style</Label>
          <Tabs defaultValue={projectData.style.type} className="w-full">
            <TabsList className="grid w-full grid-cols-2 border border-zinc-800 bg-zinc-900">
              <TabsTrigger
                value="gradient"
                className="data-[state=active]:bg-[#FE8888] data-[state=active]:text-white"
              >
                <Palette className="mr-2 h-4 w-4" />
                Gradients
              </TabsTrigger>
              <TabsTrigger
                value="image"
                className="data-[state=active]:bg-[#FE8888] data-[state=active]:text-white"
              >
                <ImageIcon className="mr-2 h-4 w-4" />
                Images
              </TabsTrigger>
            </TabsList>

            <TabsContent value="gradient">
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
                      className="flex cursor-pointer flex-col items-center justify-center rounded-md border-2 border-zinc-800 bg-zinc-900/50 p-4 transition-all hover:border-[#FE8888] hover:bg-zinc-800 peer-data-[state=checked]:border-[#FE8888] [&:has([data-state=checked])]:border-[#FE8888]"
                    >
                      <div
                        className="mb-2 h-16 w-full rounded-md"
                        style={{ background: gradient.preview }}
                      />
                      <span className="text-sm text-zinc-300">
                        {gradient.name}
                      </span>
                    </Label>
                  </div>
                ))}
              </RadioGroup>
            </TabsContent>

            <TabsContent value="image">
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
                      className="flex cursor-pointer flex-col items-center justify-center rounded-md border-2 border-zinc-800 bg-zinc-900/50 p-4 transition-all hover:border-[#FE8888] hover:bg-zinc-800 peer-data-[state=checked]:border-[#FE8888] [&:has([data-state=checked])]:border-[#FE8888]"
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
                      <span className="text-sm text-zinc-300">
                        {image.name}
                      </span>
                    </Label>
                  </div>
                ))}
              </RadioGroup>
            </TabsContent>
          </Tabs>

          <div className="flex justify-center">
            <Badge className="mt-6 bg-zinc-900/80 text-[#FE8888]">
              Custom image upload coming soon!
            </Badge>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
