import chalk from "chalk"
import { getPackageManager } from "./misc"
import { execSync } from "child_process"

export const installDeps = async (item: {
  dependencies: string[]
  devDependencies: string[]
}) => {
  const cwd = process.cwd()
  console.log(chalk.yellow(`Installing dependencies...`))
  const packageManager = await getPackageManager(cwd)

  if (item.dependencies?.length) {
    execSync(
      `${packageManager} ${packageManager === "npm" ? "install" : "add"} ${item.dependencies.join(" ")}`,
      {
        stdio: "inherit",
        cwd,
      },
    )
  }

  if (item.devDependencies?.length) {
    execSync(
      `${packageManager} ${packageManager === "npm" ? "install" : "add"} -D ${item.devDependencies.join(" ")}`,
      {
        stdio: "inherit",
        cwd,
      },
    )
  }
}
