import chalk from "chalk"
import { Command, program } from "commander"
import { mkdirSync, writeFileSync, existsSync } from "fs"
import { resolve } from "path"
import inquirer from "inquirer"

export const init = new Command("init")
  .description("creates the config file")
  .option("-f, --force", "overwrite existing config file")
  .action(async (options) => {
    if (options.force) {
      console.log(chalk.yellow(`Overwriting existing config file`))
    } else {
      const baseDir = existsSync(resolve(process.cwd(), "form.config.json"))
        ? true
        : false

      if (baseDir) {
        console.log(
          chalk.red(`Config file already exists. Use -f to overwrite`),
        )
        return
      }
    }

    console.log(chalk.yellow(`Please choose your preferences`))

    const { fileType } = await inquirer.prompt([
      {
        type: "list",
        name: "fileType",
        message: "What file extension should the component have?",
        choices: ["js", "ts"],
      },
    ])

    const configPref = {
      fileType: fileType,
    }

    const dirPath = resolve(process.cwd(), "")

    mkdirSync(dirPath, { recursive: true })
    const filePath = resolve(dirPath, `form.config.json`)
    writeFileSync(filePath, JSON.stringify(configPref))
    console.log(chalk.green(`form.config.json created in the root directory`))
  })
