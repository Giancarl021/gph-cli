import { Commands } from '@giancarl021/cli-core/interfaces';
import { writeFile } from 'fs/promises';
import locate from '@giancarl021/locate';

import { Credentials, Template } from '../interfaces';

import constants from '../util/constants';

const commands: Commands = {
    async save(args, flags) {
        const key = this.helpers.valueOrDefault(
            this.helpers.getFlag('c', 'credentials')?.toString(),
            this.extensions.vault.getData('credentials.default')
        );

        if (!key) throw new Error('No credentials provided');

        const output = String(this.helpers.getFlag('o', 'output'));

        if (!output) throw new Error('No output file provided');

        const credentials: Credentials | null = JSON.parse(
            (await this.extensions.vault.getSecret(key)) ?? 'null'
        );

        if (!credentials) throw new Error('Credentials not found');

        const [command, ..._args] = args;
        const _flags = { ...flags };

        delete _flags['c'];
        delete _flags['credentials'];
        delete _flags['o'];
        delete _flags['output'];

        if (!constants.template.availableCommands.includes(command))
            throw new Error(
                `Command "${command}" not available for templates, the command should be one of ${constants.template.availableCommands.join(
                    ', '
                )}`
            );

        const template: Template = {
            command,
            args: _args,
            flags: _flags,
            credentialsId: key
        };

        const path = locate(output, true);

        await writeFile(path, JSON.stringify(template, null, 2));

        return `Request template saved on "${path}"`;
    },

    async run(args, flags) {
        return '';
    }
};

export default commands;
