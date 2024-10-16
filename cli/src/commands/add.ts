import chalk from "chalk";
import { Command } from "commander";
import { mkdirSync, writeFileSync, existsSync } from "fs";
import { resolve } from "path";

export const add = new Command("add")
  .description("Create a component")
  .argument("<name>", "Component name")
  .action((name) => {
    console.log(chalk.yellow(`Creating ${name} component`));
    const baseDir = existsSync(resolve(process.cwd(), "src"))
      ? "src/components"
      : "components";
    const dirPath = resolve(process.cwd(), baseDir);
    console.log(dirPath);
    mkdirSync(dirPath, { recursive: true });
    const filePath = resolve(dirPath, `${name}.ts`);
    writeFileSync(filePath, `// ${name} component`);
    console.log(chalk.green(`${name}.ts created in /components`));
  });
