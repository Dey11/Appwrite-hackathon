import React, { useEffect, useState } from "react"
import FeedbackForm from "@/components/FeedbackForm"

const PreviewPage = async ({ params }: { params: { id: string } }) => {
  const res = await fetch(`http://localhost:3000/api/preview/${params.id}`)
  const project = await res.json()

  if (!project.success) {
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
                  <div>Document with the requested ID could not be found.</div>
                </div>
              </main>
            </div>
          </div>
        </div>
      </div>
    )
  }

  const projectData = project.payload

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
