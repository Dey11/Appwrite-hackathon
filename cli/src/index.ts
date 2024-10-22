#!/usr/bin/env node

import { Command } from "commander"
import { add } from "./commands/add"
import { init } from "./commands/init"
// import { test } from "./commands/testcmd"

const program = new Command()

program.addCommand(add).addCommand(init)
// .addCommand(test)

program.parse(process.argv)
