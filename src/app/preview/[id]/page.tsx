"use client"
import React, { useEffect, useState } from "react"
import dbService from "@/appwrite/db"
import FeedbackForm from "@/components/FeedbackForm"
import { FormField, ProjectData } from "@/app/projects/[id]/page"
import { useParams } from "next/navigation"

const PreviewPage = () => {
  const { id }: { id: string } = useParams()
  const [projectData, setProjectData] = useState<ProjectData>({
    name: "",
    description: "",
    style: {
      type: "image",
      value: "/sunny.webp",
    },
    fields: [],
    live: false,
  })
  const [loading, setLoading] = useState(true)
  useEffect(() => {
    async function getProjectData() {
      const project = await dbService.findProjectById(id)
      if (project.success) {
        const fields = JSON.parse(project.payload.fields).map(
          (field: Omit<FormField, "id">, index: number) => ({
            id: (index + 1).toString(), // Add sequential id
            ...field,
          }),
        )
        const projectData = {
          name: project.payload.name,
          description: project.payload.description,
          style: JSON.parse(project.payload.image),
          fields: fields,
          live: project.payload.live,
        }
        setProjectData(projectData)
        setLoading(false)
      }
    }
    getProjectData()
  }, [])
  if (loading) {
    return (
      <div className="min-h-screen p-4 md:p-8">
        <div className="mx-auto max-w-3xl">
          <div className="mb-8 text-center">
            <h1 className="text-3xl font-bold">This form is build by Rroist</h1>
            <p className="mt-2 text-zinc-500">Made with ❤️ by Rroist</p>
          </div>

          <div className="rounded-lg p-4 md:p-6">
            <div className="relative">
              <main className="flex min-h-[600px] flex-col gap-6 rounded-xl border">
                <div className="mx-auto my-auto">
                  <div className="h-8 w-8 animate-spin rounded-full border-4 border-[#FE8888] border-t-transparent" />
                </div>
              </main>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (!projectData.live) {
    return (
      <div className="min-h-screen p-4 md:p-8">
        <div className="mx-auto max-w-3xl">
          <div className="mb-8 text-center">
            <h1 className="text-3xl font-bold">This form is built by Rroist</h1>
            <p className="mt-2 text-zinc-500">Made with ❤️ by Rroist</p>
          </div>
          <div className="rounded-lg p-4 md:p-6">
            <div className="relative">
              <main
                className="flex min-h-[600px] flex-col gap-6 overflow-hidden rounded-xl"
                style={
                  projectData.style.type === "gradient"
                    ? { background: projectData.style.value }
                    : {
                        backgroundImage: `url(${projectData.style.value})`,
                        backgroundSize: "cover",
                        backgroundPosition: "center",
                      }
                }
              >
                <div className="absolute inset-0 rounded-md bg-black/40 backdrop-blur-[1px]" />
                <div className="relative z-10 mx-auto my-auto p-6 text-center">
                  <h3 className="mb-2 text-xl font-semibold text-white">
                    Feedback Collection Ended
                  </h3>
                  <p className="text-zinc-200">
                    Thank you for your interest. The feedback collection period
                    for this project has ended.
                  </p>
                </div>
              </main>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen p-4 md:p-8">
      <div className="mx-auto max-w-3xl">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold">This form is build by Rroist</h1>
          <p className="mt-2 text-zinc-500">Made with ❤️ by Rroist</p>
        </div>

        <div className="rounded-lg p-4 md:p-6">
          <div className="relative">
            {/* Preview Label */}
            <div className="absolute -top-3 right-4 z-10 rounded-full bg-blue-500 px-3 py-1 text-sm font-medium text-white shadow-md">
              Welcome
            </div>

            {/* PreviewCard Component */}
            <FeedbackForm projectData={projectData} />
          </div>
        </div>
      </div>
    </div>
  )
}

export default PreviewPage
