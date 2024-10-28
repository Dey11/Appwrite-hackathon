"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"
import AddProjectDialog from "@/components/AddProjectDialog"
import dbService from "@/appwrite/db"
import { useEffect, useState, useMemo, memo } from "react"
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
      Live
    </span>
  </div>
))
LiveStatusIndicator.displayName = "LiveStatusIndicator"

const ProjectCard = memo(({ project }: { project: Projects }) => (
  <Link href={`/projects/${project.id}`}>
    <Card className="border border-zinc-700 bg-zinc-900 transition-transform hover:scale-[1.02]">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>{project.name}</CardTitle>
        <LiveStatusIndicator isLive={project.live} />
      </CardHeader>
      <CardContent>
        <p className="text-2xl font-semibold">{project.count}</p>
        <p className="text-muted-foreground">Responses</p>
      </CardContent>
    </Card>
  </Link>
))
ProjectCard.displayName = "ProjectCard"

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
    return (
      <div className="mt-36 px-4 sm:px-6 md:px-20">
        <h1 className="bg-gradient-to-bl from-[#FF555F] to-[#FE8888] bg-clip-text py-2 text-center text-3xl font-semibold text-transparent sm:text-4xl md:text-5xl">
          Projects
        </h1>
        <p className="text-center text-xs text-zinc-400 sm:text-sm">
          Create a free project
        </p>
        <main className="flex flex-col gap-6">
          <div className="flex h-96 items-center justify-center">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-[#FE8888] border-t-transparent" />
          </div>
        </main>
      </div>
    )
  }

  return (
    <div className="mt-36 px-4 sm:px-6 md:px-20">
      <h1 className="bg-gradient-to-bl from-[#FF555F] to-[#FE8888] bg-clip-text py-2 text-center text-3xl font-semibold text-transparent sm:text-4xl md:text-5xl">
        Projects
      </h1>
      <p className="text-center text-xs text-zinc-400 sm:text-sm">
        Create a free project
      </p>
      <main className="flex flex-col gap-6">
        <div className="flex justify-end">
          <AddProjectDialog
            maxFieldlimit={userState.maxFieldLimit}
            allow={userState.allowCreatingProject}
          />
        </div>
        {projectsGrid}
      </main>
    </div>
  )
}

export default Page
