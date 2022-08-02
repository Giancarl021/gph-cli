#!/usr/bin/env node

import CliCore from '@giancarl021/cli-core';
import CliCoreVaultExtension from '@giancarl021/cli-core-vault-extension';

import vaultExtensionOptions from './src/util/vaultExtensionOptions';
import commands from './src/commands';

const APP_NAME = 'gph';

async function main() {
    const runner = CliCore(APP_NAME, {
        appDescription: 'CLI wrapper of graph-interface',
        args: {
            flags: {
                helpFlags: [ '?', 'h', 'help' ]
            }
        },
        commands,
        extensions: [ CliCoreVaultExtension(vaultExtensionOptions) ]
    });

    await runner.run();
}

main().catch(console.error);