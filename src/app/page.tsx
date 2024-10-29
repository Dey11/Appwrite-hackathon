import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { CheckCircle, Code, ArrowRight, Star, Users, Zap } from "lucide-react"
import Image from "next/image"

export default function Component() {
  return (
    <div className="bg-zinc-950 text-white">
      {/* Hero Section - Updated */}
      <div className="relative bg-zinc-900/30">
        <div className="container mx-auto grid min-h-screen items-center gap-12 px-4 py-20 md:grid-cols-2 lg:gap-20">
          <div className="relative z-10 flex flex-col gap-6">
            <div className="flex items-center gap-2 text-sm text-[#FE8888]">
              <Star className="h-4 w-4" />
              <span>Trusted by 10,000+ developers</span>
            </div>
            <h1 className="font-poppins text-4xl font-bold text-white sm:text-5xl md:text-6xl">
              Form Building,{" "}
              <span className="bg-gradient-to-r from-[#FF555F] to-[#FE8888] bg-clip-text text-transparent">
                Reimagined
              </span>
            </h1>
            <p className="text-lg text-zinc-400">
              Create stunning feedback forms with our developer-first platform.
              Built for teams who value clean code and exceptional user
              experience.
            </p>
            <div className="flex flex-wrap gap-4">
              <Button size="lg" className="bg-[#FE8888] hover:bg-[#FF555F]">
                Start Building
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="border-zinc-700 bg-zinc-900/50 hover:bg-zinc-800"
              >
                View Documentation
              </Button>
            </div>
            <div className="mt-4 flex items-center gap-6 text-sm text-zinc-500">
              <div className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-[#FE8888]" />
                <span>Free Tier Available</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-[#FE8888]" />
                <span>No Credit Card Required</span>
              </div>
            </div>
          </div>
          <div className="relative h-[500px] w-full">
            <div className="absolute -left-8 -top-8 h-72 w-72 rounded-full bg-[#FE8888]/20 blur-3xl" />
            <div className="absolute -bottom-8 -right-8 h-72 w-72 rounded-full bg-[#FF555F]/20 blur-3xl" />
            <div className="relative h-full w-full overflow-hidden rounded-xl border border-zinc-800 bg-zinc-900/50 shadow-2xl">
              <Image
                fill
                alt="Platform preview"
                src="/home.png"
                className="object-cover"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Build with Roist Section - Updated */}
      <div className="relative border-y border-zinc-800 bg-zinc-900/30">
        <div className="container mx-auto px-4 py-24 lg:py-32">
          <div className="mb-16 grid gap-8 md:grid-cols-2">
            <div>
              <div className="mb-6 inline-block rounded-full bg-zinc-800 px-4 py-1 text-sm text-[#FE8888]">
                The Roist Platform
              </div>
              <h2 className="mb-6 font-quicksand text-4xl font-bold sm:text-5xl">
                Build your next project with{" "}
                <span className="bg-gradient-to-r from-[#FF555F] to-[#FE8888] bg-clip-text text-transparent">
                  Roist
                </span>
              </h2>
              <p className="text-lg text-zinc-400">
                Experience the perfect blend of power and simplicity. Our
                platform offers everything you need to create, deploy, and
                manage feedback forms at scale.
              </p>
              <div className="mt-8 grid gap-4 sm:grid-cols-2">
                {[
                  "Drag & Drop Builder",
                  "Custom Themes",
                  "Real-time Analytics",
                  "Advanced Integration",
                ].map((feature, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <CheckCircle className="h-5 w-5 text-[#FE8888]" />
                    <span className="text-zinc-300">{feature}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="relative">
              <div className="absolute -right-4 top-4 h-48 w-48 rounded-full bg-[#FE8888]/20 blur-3xl" />
              <div className="relative overflow-hidden rounded-xl border border-zinc-800 bg-zinc-900/50 shadow-2xl">
                <Image
                  width={1000}
                  height={1000}
                  alt="Platform interface"
                  src="/home.png"
                  className="w-full"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Features Grid */}
      <div className="bg-zinc-900/50 py-24">
        <div className="container mx-auto px-4">
          <div className="grid gap-8 md:grid-cols-3">
            {[
              {
                icon: <Zap className="h-6 w-6 text-[#FE8888]" />,
                title: "Lightning Fast",
                description:
                  "Build and deploy feedback forms in minutes, not hours",
              },
              {
                icon: <Code className="h-6 w-6 text-[#FE8888]" />,
                title: "Developer First",
                description:
                  "Clean API, great DX, and full customization control",
              },
              {
                icon: <Users className="h-6 w-6 text-[#FE8888]" />,
                title: "User Friendly",
                description:
                  "Intuitive interface for both creators and respondents",
              },
            ].map((feature, index) => (
              <Card key={index} className="border-none bg-zinc-900/50 p-6">
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-zinc-800">
                  {feature.icon}
                </div>
                <h3 className="mb-2 text-xl font-semibold">{feature.title}</h3>
                <p className="text-zinc-400">{feature.description}</p>
              </Card>
            ))}
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="border-y border-zinc-800 bg-zinc-900/30">
        <div className="container mx-auto grid gap-8 px-4 py-16 md:grid-cols-3">
          {[
            { number: "500K+", label: "Forms Created" },
            { number: "10M+", label: "Monthly Submissions" },
            { number: "99.9%", label: "Uptime" },
          ].map((stat, index) => (
            <div key={index} className="text-center">
              <div className="text-4xl font-bold text-[#FE8888]">
                {stat.number}
              </div>
              <div className="mt-2 text-zinc-400">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* CTA Section */}
      <div className="relative overflow-hidden py-24">
        <div className="container mx-auto px-4 text-center">
          <h2 className="mb-6 text-3xl font-bold md:text-4xl">
            Ready to transform your feedback process?
          </h2>
          <p className="mx-auto mb-8 max-w-2xl text-zinc-400">
            Join thousands of developers who are already building better
            feedback systems with Roist.
          </p>
          <Button size="lg" className="bg-[#FE8888] hover:bg-[#FF555F]">
            Start Building <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
        <div className="absolute bottom-0 right-0 h-[320px] w-[320px] rounded-full bg-gradient-to-b from-[rgba(100,101,240,0.5)] to-[rgba(136,70,200,0.5)] blur-[100px]" />
      </div>
    </div>
  )
}
