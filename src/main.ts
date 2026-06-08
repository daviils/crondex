#!/usr/bin/env node

import { createCli } from './cli/cli.factory.js';
import { createContainer } from './cli/container.js';

const container = createContainer(process.argv[1]);
const cli = createCli(container);

await cli.parseAsync(process.argv);
