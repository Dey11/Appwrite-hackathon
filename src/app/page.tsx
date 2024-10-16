import { Button } from "@/components/ui/button"
import Image from "next/image"

export default function Component() {
  return (
    <div>
      <div className="relative h-screen w-full overflow-hidden">
        <Image alt="Background waves" src="/waves.svg" layout="fill" />
        <div className="absolute inset-0 z-10 flex flex-col items-center justify-center gap-6 px-4 text-center md:px-0">
          <h1 className="font-poppins text-3xl font-semibold text-white sm:text-4xl md:text-5xl">
            Effortless Feedback, Seamless Integration.
          </h1>
          <p className="max-w-[733px] text-xs text-zinc-400 sm:text-sm">
            Rroist designs aesthetic feedback components for your apps. Our
            platform specializes in creating high-quality UI components designed
            specifically for feedback systems. These components are easy to
            integrate into any project, providing a seamless user experience.
          </p>
          <Button>Get Started</Button>
        </div>
        <div className="absolute bottom-0 left-0 right-0 z-20 h-2 w-full bg-white blur-2xl"></div>
      </div>
      <div className="relative h-96 w-full overflow-hidden md:min-h-screen">
        <div className="absolute inset-0 left-0 right-0 z-20 h-2 w-full bg-white blur-2xl"></div>
        <div className="absolute inset-4 z-10 flex flex-col items-center gap-10 text-center md:inset-44">
          <h1 className="font-quicksand text-3xl font-semibold text-white sm:text-4xl md:text-5xl">
            Build your next project with{" "}
            <span className="bg-gradient-to-bl from-[#FF555F] to-[#FE8888] bg-clip-text text-transparent">
              Roist
            </span>
          </h1>
          <Image
            width={849}
            height={477}
            alt="image1"
            className="max-w-full bg-white"
            src={"/image1.jpg"}
          />
        </div>
      </div>
      <div className="mt-20">
        <div className="mx-4 md:ml-32">
          <h1 className="mb-10 font-quicksand text-3xl font-semibold text-white sm:text-4xl md:mb-20 md:text-5xl">
            Build your next project with{" "}
            <span className="bg-gradient-to-bl from-[#FF555F] to-[#FE8888] bg-clip-text text-transparent">
              Roist
            </span>
          </h1>
          <p className="max-w-[1200px] text-sm text-zinc-200 md:text-base">
            Myrtle is a cutting-edge AI-powered platform designed to bring your
            creative visions to life with minimal effort. Specializing in the
            generation of unique logos and captivating images, Myrtle offers an
            impressive array of styles to suit any project. Whether you're
            looking for playful and quirky doodles, vibrant and expressive anime
            designs, or highly detailed and photorealistic imagery, Myrtle has
            the tools to deliver exceptional results. Perfect for businesses,
            content creators, and individuals alike, Myrtle combines advanced AI
            technology with artistic flexibility, allowing users to explore
            endless design possibilities. No matter the style or complexity,
            Myrtle ensures every creation is a perfect blend of creativity and
            innovation, tailored to your exact specifications.
          </p>
        </div>
        <div className="relative bottom-52 right-40 hidden h-[320px] w-[320px] rounded-full bg-gradient-to-b from-[rgba(100,101,240,0.5)] to-[rgba(136,70,200,0.5)] blur-2xl md:block"></div>
      </div>
    </div>
  )
}
