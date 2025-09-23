#!/usr/bin/env node

import CliCore from '@giancarl021/cli-core';
import VaultExtension from '@giancarl021/cli-core-vault-extension';
import './src/util/types';

import * as commands from './src/commands';
import help from './src/util/help.json';
import getExecutionMode, { ExecutionModes } from './src/util/getExecutionMode';
import JsonExtension from './src/services/JsonExtension';

const appName = 'gph';
const executionMode = getExecutionMode();

const app = CliCore({
    appName,
    appDescription: 'CLI wrapper of graph-interface',
    behavior: {
        debugMode: executionMode >= ExecutionModes.debug,
        extensionLogging: executionMode >= ExecutionModes.trace
    },
    commands,
    help,
    extensions: [
        JsonExtension(),
        VaultExtension({
            initialData: {
                credentials: {
                    default: undefined,
                    items: {}
                }
            },
            tempInitialData: {
                cache: {}
            }
        })
    ]
});

const process = app.run();

if (executionMode >= ExecutionModes.debug) {
    process
        .then(result => {
            console.log(result);
        })
        .catch(err => {
            console.error(err);
        });
}
