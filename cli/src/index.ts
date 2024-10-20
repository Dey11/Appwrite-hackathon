#!/usr/bin/env node

import { Command } from "commander"
import { add } from "./commands/add"
import { init } from "./commands/init"

const program = new Command()

program.addCommand(add).addCommand(init)

program.parse(process.argv)
