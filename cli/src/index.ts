#!/usr/bin/env node

import { Command } from "commander"
import { add } from "./commands/add"
import { init } from "./commands/init"
import { add2 } from "./commands/add2"
// import { test } from "./commands/testcmd"

const program = new Command()

program.addCommand(add).addCommand(init)
// .addCommand(test)
program
  .command("add2")
  .description("Add a form component")
  .argument("[id]", "Id of the component", "FeedBack")
  .action((id) => {
    add2(id)
  })
program.parse(process.argv)
