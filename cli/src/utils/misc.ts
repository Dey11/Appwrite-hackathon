import { cosmiconfig } from "cosmiconfig"
import { detect } from "@antfu/ni"

export async function getPackageManager(
  targetDir: string,
): Promise<"yarn" | "pnpm" | "bun" | "npm"> {
  const packageManager = await detect({ programmatic: true, cwd: targetDir })

  if (packageManager === "yarn@berry") return "yarn"
  if (packageManager === "pnpm@6") return "pnpm"
  if (packageManager === "bun") return "bun"
  return packageManager ?? "npm"
}

type Config = {
  config: {
    fileType: "js" | "ts"
    dirPref: "src/components" | "components"
  }
  filepath: string
  isEmpty?: boolean
}

export const fetchConfig = async (): Promise<Config | null> => {
  try {
    const explorer = cosmiconfig("form", {
      searchPlaces: ["form.config.json"],
    })
    const result = await explorer.search().then((res) => {
      return res
    })

    return result
  } catch (error) {
    console.error(error)
    return null
  }
}
