import chalk from "chalk"
import { Command } from "commander"
import { mkdirSync, writeFileSync, existsSync } from "fs"
import { resolve } from "path"
import { fetchConfig } from "../utils/misc"
import inquirer from "inquirer"
import createConfigFile from "../utils/create-config"
import { installDeps } from "../utils/install-deps"

export const add = new Command("add")
  .description("Create a component")
  .argument("<id>", "Component name")
  .action(async (id) => {
    console.log(chalk.yellow(`Creating component with id: ${id}`))

    const data = await fetchConfig()

    if (!data) {
      console.log(chalk.red("No config file found"))

      const { choice } = await inquirer.prompt([
        {
          type: "confirm",
          name: "choice",
          message:
            "Do you want to create a config file? Config file is necessary.",
          default: true,
        },
      ])

      if (choice) {
        console.log(chalk.yellow("Creating a config file"))
        createConfigFile()
      } else {
        console.log(
          chalk.red("Please create a config file before adding components"),
        )
        return
      }
    }

    // installDeps(dependencies_array)

    let base = "components"
    if (data?.config.dirPref.includes("src")) {
      base = "src/components"
    }

    const dirPath = resolve(process.cwd(), base)
    mkdirSync(dirPath, { recursive: true })

    const filePath = resolve(dirPath, `Form.${data?.config.fileType}`)
    writeFileSync(filePath, `// Form component`)
    console.log(chalk.green(`Form.${data?.config.fileType} created in ${base}`))
  })
