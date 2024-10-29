"use client"

import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import Link from "next/link"
import AddProjectDialog from "@/components/AddProjectDialog"
import dbService from "@/appwrite/db"
import { useEffect, useState, useMemo, memo } from "react"
import { Eye, MessageSquare, Plus, Sparkles } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"
import { useCheckSession } from "@/components/hooks/check-session"
import { useStore } from "@/lib/store"

type Projects = {
  id: string
  name: string
  count: number
  live: boolean
}

const LiveStatusIndicator = memo(({ isLive }: { isLive: boolean }) => (
  <div className="inline-flex items-center rounded-full px-3 py-1">
    <span className="relative mr-[6px] flex h-[6px] w-[6px]">
      <span
        className={`absolute inline-flex h-full w-full animate-ping rounded-full ${
          isLive ? "bg-green-500" : "bg-red-500"
        } opacity-75`}
      />
      <span
        className={`absolute inline-flex h-[6px] w-[6px] rounded-full blur-sm ${
          isLive ? "bg-green-500" : "bg-red-500"
        }`}
      />
      <span
        className={`relative inline-flex h-[6px] w-[6px] rounded-full ${
          isLive ? "bg-green-500" : "bg-red-500"
        }`}
      />
    </span>
    <span
      className={`text-sm font-medium ${
        isLive ? "text-green-500" : "text-red-500"
      } font-quicksand font-extrabold`}
    >
      {isLive ? "Live" : "Offline"}
    </span>
  </div>
))
LiveStatusIndicator.displayName = "LiveStatusIndicator"

const ProjectCard = memo(({ project }: { project: Projects }) => (
  <Link href={`/projects/${project.id}`} className="group block">
    <Card className="relative h-full overflow-hidden border border-zinc-800 bg-zinc-900/50 transition-all duration-300 hover:border-[#FE8888]/50 hover:shadow-lg">
      <div className="absolute -right-16 -top-16 h-32 w-32 rounded-full bg-gradient-to-br from-[#FF555F]/10 to-[#FE8888]/10 blur-2xl transition-all duration-300 group-hover:bg-gradient-to-br group-hover:from-[#FF555F]/20 group-hover:to-[#FE8888]/20" />
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-lg font-medium text-white">
          {project.name}
        </CardTitle>
        <LiveStatusIndicator isLive={project.live} />
      </CardHeader>
      <CardContent>
        <div className="mt-2 flex items-center space-x-2">
          <div className="flex items-center space-x-1">
            <MessageSquare className="h-5 w-5 text-[#FE8888]" />
            <span className="text-2xl font-semibold text-white">
              {project.count}
            </span>
          </div>
          <span className="text-sm text-zinc-400">Total Responses</span>
        </div>
      </CardContent>
      <CardFooter className="justify-between">
        <Button
          variant="outline"
          size="sm"
          className="border-zinc-700 bg-zinc-900/50 text-white hover:border-[#FE8888] hover:bg-zinc-800"
          asChild
        >
          <Link href={`/response/${project.id}`}>View Responses</Link>
        </Button>
        <Button
          variant="ghost"
          size="sm"
          className="text-zinc-400 hover:bg-zinc-800 hover:text-white"
          asChild
        >
          <Link href={`/preview/${project.id}`}>
            <Eye className="mr-2 h-4 w-4" />
            Preview
          </Link>
        </Button>
      </CardFooter>
    </Card>
  </Link>
))
ProjectCard.displayName = "ProjectCard"

const EmptyState = () => (
  <div className="flex h-[400px] flex-col items-center justify-center rounded-lg border border-dashed border-zinc-800 bg-zinc-900/50 px-4 text-center">
    <div className="mb-4 rounded-full bg-zinc-900 p-3">
      <Sparkles className="h-6 w-6 text-[#FE8888]" />
    </div>
    <h3 className="mb-2 text-xl font-medium text-white">No projects yet</h3>
    <p className="mb-4 max-w-sm text-sm text-zinc-400">
      Create your first project to start collecting feedback from your users.
    </p>
  </div>
)

const LoadingState = () => (
  <div className="mt-36 px-4 sm:px-6 md:px-20">
    <div className="relative mb-12 text-center">
      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
        <div className="h-32 w-32 rounded-full bg-gradient-to-br from-[#FF555F]/20 to-[#FE8888]/20 blur-3xl" />
      </div>
      <h1 className="relative bg-gradient-to-bl from-[#FF555F] to-[#FE8888] bg-clip-text py-2 text-3xl font-semibold text-transparent sm:text-4xl md:text-5xl">
        Projects
      </h1>
      <p className="relative text-sm text-zinc-400">Create a free project</p>
    </div>
    <div className="flex h-96 items-center justify-center">
      <div className="h-8 w-8 animate-spin rounded-full border-4 border-[#FE8888] border-t-transparent" />
    </div>
  </div>
)

const Page = () => {
  const [userState, setUserState] = useState({
    allowCreatingProject: false,
    maxFieldLimit: 5,
  })
  const [projects, setProjects] = useState<Projects[]>([])
  const [isLoading, setIsLoading] = useState(true)

  const { user, loading } = useCheckSession()
  const { authState } = useStore()
  const router = useRouter()

  useEffect(() => {
    if (!loading && authState == null) {
      router.push("/login")
    }
  }, [user, loading, authState])

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true)
        const user = await dbService.getCurrentUser()
        const userProject = await dbService.getAllProjects()

        if (user.success && userProject.success) {
          const formattedProjects = userProject.payload.map((project) => ({
            id: project.$id,
            name: project.name,
            count: project.feedback.length,
            live: project.live,
          }))

          setProjects(formattedProjects)
          setUserState({
            allowCreatingProject:
              user.payload.project.length < user.payload.projectLimit,
            maxFieldLimit: user.payload.maxFields,
          })
        }
      } catch (error) {
        console.error("Error fetching data:", error)
      } finally {
        setIsLoading(false)
      }
    }

    user && fetchData()
  }, [user])

  const projectsGrid = useMemo(
    () => (
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {projects.map((project) => (
          <ProjectCard key={project.id} project={project} />
        ))}
      </div>
    ),
    [projects],
  )

  if (isLoading) {
    return <LoadingState />
  }

  return (
    <div className="mt-36 px-4 sm:px-6 md:px-20">
      <div className="relative mb-12 text-center">
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
          <div className="h-32 w-32 rounded-full bg-gradient-to-br from-[#FF555F]/20 to-[#FE8888]/20 blur-3xl" />
        </div>
        <h1 className="relative bg-gradient-to-bl from-[#FF555F] to-[#FE8888] bg-clip-text py-2 text-3xl font-semibold text-transparent sm:text-4xl md:text-5xl">
          Projects
        </h1>
        <p className="relative text-sm text-zinc-400">Create a free project</p>
      </div>

      <main className="flex flex-col gap-6">
        <div className="flex justify-end">
          
          <AddProjectDialog
            maxFieldlimit={userState.maxFieldLimit}
            allow={userState.allowCreatingProject}
          />
        </div>

        {projects.length === 0 ? <EmptyState /> : projectsGrid}
      </main>
    </div>
  )
}

export default Page
