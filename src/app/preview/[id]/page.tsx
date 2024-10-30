import FeedbackForm from "@/components/FeedbackForm"
import { Star } from "lucide-react"

const PreviewPage = async ({ params }: { params: { id: string } }) => {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_APP_URL}/api/preview/${params.id}`,
    {
      cache: "no-cache",
    },
  )
  const project = await res.json()

  const HeaderSection = () => (
    <div className="mb-12 text-center">
      <div className="mb-4 flex items-center justify-center gap-2 text-sm text-[#FE8888]">
        <Star className="h-4 w-4" />
        <span>Built with Rroist</span>
      </div>
      <h1 className="font-poppins text-3xl font-bold text-white md:text-4xl">
        Share Your{" "}
        <span className="bg-gradient-to-r from-[#FF555F] to-[#FE8888] bg-clip-text text-transparent">
          Feedback
        </span>
      </h1>
      <p className="mt-3 text-zinc-400">
        Help us improve by sharing your thoughts and experiences
      </p>
    </div>
  )

  if (!project.success) {
    return (
      <div className="relative min-h-screen bg-zinc-950 px-4 py-16 text-white">
        <div className="absolute inset-0 bg-[url(/grid.svg)] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))]" />
        <div className="relative mx-auto max-w-3xl">
          <HeaderSection />
          <div className="overflow-hidden rounded-xl border border-zinc-800 bg-zinc-900/50 shadow-2xl">
            <div className="relative p-6">
              <div className="absolute -left-32 -top-32 h-64 w-64 rounded-full bg-[#FE8888]/10 blur-3xl" />
              <div className="absolute -bottom-32 -right-32 h-64 w-64 rounded-full bg-[#FF555F]/10 blur-3xl" />
              <div className="relative flex min-h-[400px] items-center justify-center text-center">
                <div className="space-y-4">
                  <p className="text-xl text-zinc-300">
                    Document with the requested ID could not be found.
                  </p>
                  <p className="text-zinc-400">
                    Please check the URL and try again.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  const projectData = project.payload

  if (!projectData.live) {
    return (
      <div className="relative min-h-screen bg-zinc-950 px-4 py-16 text-white">
        <div className="absolute inset-0 bg-[url(/grid.svg)] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))]" />
        <div className="relative mx-auto max-w-3xl">
          <HeaderSection />
          <div
            className="overflow-hidden rounded-xl border border-zinc-800 shadow-2xl"
            style={
              projectData.style.type === "gradient"
                ? { background: projectData.style.value }
                : {
                    backgroundImage: `linear-gradient(to bottom, rgba(24, 24, 27, 0.8), rgba(24, 24, 27, 0.95)), url(${projectData.style.value})`,
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                  }
            }
          >
            <div className="relative p-6">
              <div className="absolute -left-32 -top-32 h-64 w-64 rounded-full bg-[#FE8888]/10 blur-3xl" />
              <div className="absolute -bottom-32 -right-32 h-64 w-64 rounded-full bg-[#FF555F]/10 blur-3xl" />
              <div className="relative flex min-h-[400px] items-center justify-center text-center">
                <div className="space-y-4">
                  <h3 className="text-2xl font-semibold text-white">
                    Feedback Collection Ended
                  </h3>
                  <p className="text-zinc-300">
                    Thank you for your interest. The feedback collection period
                    for this project has ended.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="relative min-h-screen bg-zinc-950 px-4 py-16 text-white">
      <div className="absolute inset-0 bg-[url(/grid.svg)] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))]" />
      <div className="relative mx-auto max-w-3xl">
        <HeaderSection />
        <div className="relative rounded-xl">
          <div className="absolute -left-4 -top-4 h-32 w-32 rounded-full bg-[#FE8888]/20 blur-3xl" />
          <div className="absolute -bottom-4 -right-4 h-32 w-32 rounded-full bg-[#FF555F]/20 blur-3xl" />
          <div className="relative">
            <div className="absolute -top-3 right-4 z-10 rounded-full bg-gradient-to-r from-[#FF555F] to-[#FE8888] px-4 py-1 text-sm font-medium text-white shadow-xl">
              Welcome
            </div>
            <FeedbackForm
              projectData={projectData}
            />
          </div>
        </div>
      </div>
    </div>
  )
}

export default PreviewPage
