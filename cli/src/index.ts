#!/usr/bin/env node

import { Command } from "commander";
import { add } from "./commands/add";

const program = new Command();

program.addCommand(add);

program.parse(process.argv);
