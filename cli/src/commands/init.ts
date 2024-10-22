import chalk from "chalk"
import { Command } from "commander"
import { existsSync } from "fs"
import { resolve } from "path"
import createConfigFile from "../utils/create-config"

export const init = new Command("init")
  .description("creates the config file")
  .option("-f, --force", "overwrite existing config file")
  .action(async (options) => {
    if (options.force) {
      console.log(chalk.yellow(`Overwriting the existing config file, if any.`))
    } else {
      const baseDir = existsSync(resolve(process.cwd(), "form.config.json"))
        ? true
        : false

      if (baseDir) {
        console.log(
          chalk.red(`Config file already exists. Use -f to overwrite.`),
        )
        return
      }
    }

    createConfigFile()
  })
