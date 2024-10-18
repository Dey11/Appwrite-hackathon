import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"
import AddProjectDialog from "@/components/AddProjectDialog"

const Page = () => {
  const projects = [
    { id: 1, name: "Demo Site 1", count: 5, live: true },
    { id: 2, name: "Demo Site 2", count: 3, live: false },
    { id: 3, name: "Demo Site 3", count: 7, live: false },
    { id: 4, name: "Demo Site 4", count: 2, live: false },
    { id: 5, name: "Demo Site 5", count: 4, live: true },
  ]

  return (
    <div className="mt-36 px-20">
      <h1 className="bg-gradient-to-bl from-[#FF555F] to-[#FE8888] bg-clip-text py-2 text-center text-3xl font-semibold text-transparent sm:text-4xl md:text-5xl">
        Projects
      </h1>
      <p className="text-center text-xs text-zinc-400 sm:text-sm">
        Create a free project
      </p>
      <main className="flex flex-col gap-6">
        <div className="flex justify-end">
          <AddProjectDialog />
        </div>
        <div>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {projects.map((project) => (
              <Link href={`/project/${project.id}`} key={project.id}>
                <Card className="border border-zinc-700 bg-zinc-900">
                  <CardHeader className="flex flex-row items-center justify-between">
                    <CardTitle>{project.name}</CardTitle>
                    <div className="inline-flex items-center rounded-full px-3 py-1">
                      <span className="relative mr-[6px] flex h-[6px] w-[6px]">
                        <span
                          className={`absolute inline-flex h-full w-full animate-ping rounded-full ${project.live ? "bg-green-500" : "bg-red-500"} opacity-75`}
                        ></span>
                        <span
                          className={`absolute inline-flex h-[6px] w-[6px] rounded-full blur-sm ${project.live ? "bg-green-500" : "bg-red-500"}`}
                        ></span>
                        <span
                          className={`relative inline-flex h-[6px] w-[6px] rounded-full ${project.live ? "bg-green-500" : "bg-red-500"}`}
                        ></span>
                      </span>
                      <span
                        className={`text-sm font-medium ${project.live ? "text-green-500" : "text-red-500"} font-quicksand font-extrabold`}
                      >
                        Live
                      </span>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-2xl font-semibold">{project.count}</p>
                    <p className="text-muted-foreground">Responses</p>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </main>
    </div>
  )
}

export default Page
