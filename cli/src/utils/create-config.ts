import chalk from "chalk"
import { mkdirSync, writeFileSync } from "fs"
import inquirer from "inquirer"
import { resolve } from "path"

export default async function createConfigFile() {
  console.log(chalk.yellow(`Please choose your preferences`))

  const { fileType } = await inquirer.prompt([
    {
      type: "list",
      name: "fileType",
      message: "What file extension should the component have?",
      choices: ["js", "ts"],
    },
  ])

  const { dirPref } = await inquirer.prompt([
    {
      type: "list",
      name: "dirPref",
      message: "Where should the component be created?",
      choices: ["components", "src/components"],
    },
  ])

  const configPref = {
    fileType,
    dirPref,
  }

  const dirPath = resolve(process.cwd(), "")

  mkdirSync(dirPath, { recursive: true })
  const filePath = resolve(dirPath, `form.config.json`)
  writeFileSync(filePath, JSON.stringify(configPref))
  console.log(chalk.green(`form.config.json has been created`))
}
